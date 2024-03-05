// auth.service.ts (Microservicio Principal)

import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Services } from 'src/common/enums/services.enum';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EventCommands } from 'src/common/enums/event-commands.enum';
import { catchError, timeout } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth-guard-token';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.AUTH)
    private readonly clientService: ClientProxy,
    private readonly configService: ConfigService,
    private readonly authGuard: AuthGuard,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async register(data: RegisterDto) {
    try {
      const result = await this.sendRegisterRequest(data).toPromise();

      const token = this.authGuard.generateToken(
        result.user.id,
        result.user.email,
      );

      return { user: result.user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // auth.controller.ts
  async login(@Payload() data: LoginDto) {
    try {
      const result = await this.sendLoginRequest(data).toPromise();

      const user = await this.jwtStrategy.validate({ email: data.email });

      const token = this.authGuard.generateToken(user.id, user.email);

      return { user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  sendRegisterRequest(data: RegisterDto) {
    console.log('Sending register request with data:', data);

    return this.clientService
      .send(EventCommands.SEND_REGISTER, data)
      .pipe(timeout(82000))
      .pipe(
        catchError((error) => {
          console.error('Error in sendRegisterRequest:', error);
          throw new RpcException(error);
        }),
      );
  }

  sendLoginRequest(data: LoginDto) {
    console.log('Sending login request with data:', data);

    return this.clientService
      .send(EventCommands.SEND_LOGIN, data)
      .pipe(timeout(82000))
      .pipe(
        catchError((error) => {
          console.error('Error in sendLoginRequest:', error);
          throw new RpcException(error);
        }),
      );
  }
}
