import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Services } from 'src/common/enums/services.enum';
import { EventCommands } from 'src/common/enums/event-commands.enum';
import { catchError, timeout } from 'rxjs';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private userService: any;
  private authService: any;
  constructor(
    @Inject('USER-AUTH')
    private readonly client: ClientGrpc,
  ) {
    // this.authService = this.client.getService('AuthService');
    this.userService = this.client.getService('UserService');
  }
  findAll() {}

  findOneUserById(id: number) {
    return this.userService.getUserById({ id });
  }

  findOneUserByEmail(email: string) {
    return this.userService.getUserByEmail({ email });
  }
}
