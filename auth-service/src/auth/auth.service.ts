import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { UtilService } from 'src/utils/utils.service';
import { MailServiceInterface } from 'src/interfaces/mail-interface';
import {
  CreateUserResponse,
  UserServiceInterface,
} from 'src/interfaces/user-interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private emailService: MailServiceInterface;
  private userService: UserServiceInterface;
  constructor(
    @Inject('EMAIL')
    private readonly emailClient: ClientGrpc,
    @Inject('USER-SERVICE')
    private readonly userClient: ClientGrpc,
    private readonly utilService: UtilService,
  ) {
    this.emailService =
      this.emailClient.getService<MailServiceInterface>('MailService');
    this.userService =
      this.userClient.getService<UserServiceInterface>('UserService');
  }
  async register(registerDto: RegisterDto) {
    try {
      const { password } = registerDto;

      const hashedPassword = await this.utilService.hashPassword(password);
      const newUser: CreateUserResponse = await lastValueFrom(
        this.userService.createUser({
          ...registerDto,
          password: hashedPassword,
        }),
      );
      const user = newUser.user || newUser; // Si el usuario está anidado bajo `user`

      await lastValueFrom(
        this.emailService.sendWelcomeEmail({
          name: newUser.user.name,
          email: newUser.user.email,
        }),
      );
      return { user };
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await lastValueFrom(
      this.userService.getUserByEmail({ email }),
    );
    if (!user) {
      throw new RpcException({
        status: 400,
        message: ' usuario no encontrado',
      });
    }
    const isPasswordValid = await this.utilService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new RpcException({
        status: 400,
        message: 'Usuario no encontrado', // Corregido de "messague" a "message"
      });
    }

    return user;
  }
}
