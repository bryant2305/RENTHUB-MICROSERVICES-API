import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private emailService: any;
  constructor(
    @Inject('EMAIL')
    private readonly emailClient: ClientGrpc,
    private readonly userService: UserService,
  ) {
    this.emailService = this.emailClient.getService('MailService');
  }
  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto;

      const existingUser = await this.userService.findOneByEmail(email);
      if (existingUser) {
        throw new RpcException({
          status: 400,
          message: ' user already exist',
        });
      }

      const hashedPassword = await this.userService.hashPassword(password);
      const newUser = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });
      // Asegúrate de que el `sendWelcomeEmail` está bien definido y corresponde con la RPC en el archivo `.proto`
      await this.emailService
        .sendWelcomeEmail({
          name: newUser.name,
          email: newUser.email,
        })
        .toPromise();

      return { user: newUser };
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new RpcException({
        status: 400,
        message: ' usuario no encontrado',
      });
    }
    const isPasswordValid = await this.userService.comparePasswords(
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
