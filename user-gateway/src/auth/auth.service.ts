// auth.service.ts (Microservicio Principal)

import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth-guard-token';
import { Services } from 'src/common/enums/services.enum';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EventCommands } from 'src/common/enums/event-commands.enum';
import { catchError, timeout } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.AUTH)
    private readonly clientService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

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
