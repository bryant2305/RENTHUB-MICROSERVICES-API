import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { UtilService } from 'src/utils/utils.service';

@Injectable()
export class AuthService {
  private emailService: any;
  private userService: any;
  constructor(
    @Inject('EMAIL')
    private readonly emailClient: ClientGrpc,
    @Inject('USER-SERVICE')
    private readonly userClient: ClientGrpc,
    private readonly utilService: UtilService,
  ) {
    this.emailService = this.emailClient.getService('MailService');
    this.userService = this.userClient.getService('UserService');
  }
  async register(registerDto: RegisterDto) {
    try {
      const { password } = registerDto;

      const hashedPassword = await this.utilService.hashPassword(password);
      const newUser = await this.userService
        .createUser({
          ...registerDto,
          password: hashedPassword,
        })
        .toPromise();
      const user = newUser.user || newUser; // Si el usuario está anidado bajo `user`

      await this.emailService
        .sendWelcomeEmail({
          name: user.name,
          email: user.email,
        })
        .toPromise();
      return { user };
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail({ email }).toPromise();
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
