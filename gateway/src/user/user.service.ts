import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Services } from 'src/common/enums/services.enum';
import { EventCommands } from 'src/common/enums/event-commands.enum';
import { catchError, timeout } from 'rxjs';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(Services.AUTH)
    private readonly clientService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}
  findAll() {
    console.log('Sending getAll request with data:');

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
  findOneUser(email: string) {
    console.log('Sending finOne request with data:');

    return this.clientService
      .send(EventCommands.FIND_USER, email)
      .pipe(timeout(82000))
      .pipe(
        catchError((error) => {
          console.error('Error in getUsersdata:', error);
          throw new RpcException(error);
        }),
      );
  }
}
