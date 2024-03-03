import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Services } from 'src/common/enums/services.enum';
import { EventCommands } from 'src/common/enums/event-commands.enum';
import { catchError, timeout } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(Services.USERS)
    private readonly clientService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}
  findAll() {
    console.log('Sending login request with data:');

    return this.clientService
      .send(EventCommands.GET_USERS, {})
      .pipe(timeout(82000))
      .pipe(
        catchError((error) => {
          console.error('Error in getUsersdata:', error);
          throw new RpcException(error);
        }),
      );
  }
}