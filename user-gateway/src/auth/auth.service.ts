// auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth-guard-token';
import { Services } from 'src/common/enums/services.enum';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EventCommands } from 'src/common/enums/event-commands.enum';
import { catchError, timeout } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    // private readonly userService: UserService,

    // private readonly authGuard: AuthGuard,

    @Inject(Services.auth)
    private readonly clientService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  // async login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;

  //   const user = await this.userService.findOneByEmail(email);
  //   if (!user) {
  //     throw new BadRequestException("User doesn't exist");
  //   }

  //   const isPasswordValid = await this.userService.comparePasswords(
  //     password,
  //     user.password,
  //   );
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const token = this.authGuard.generateToken(user.id, user.email);
  //   return { token };
  // }

  // async register(registerDto: RegisterDto) {
  //   const { email, password } = registerDto;

  //   const existingUser = await this.userService.findOneByEmail(email);
  //   if (existingUser) {
  //     throw new BadRequestException('User already exists');
  //   }

  //   const hashedPassword = await this.userService.hashPassword(password);
  //   const newUser = await this.userService.createUser({
  //     ...registerDto,
  //     password: hashedPassword,
  //   });

  //   const token = this.authGuard.generateToken(newUser.id, newUser.email);
  //   return { user: newUser, token };
  // }

  sendRegisterRequest(data: RegisterDto) {
    return this.clientService
      .send(EventCommands.SEND_REGISTER, {
        ...data,
      })
      .pipe(timeout(82000))
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
