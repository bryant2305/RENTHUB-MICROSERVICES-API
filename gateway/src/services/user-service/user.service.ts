import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceInterface } from 'src/Interfaces/user-interface';

@Injectable()
export class UserService {
  private userService: UserServiceInterface;
  constructor(
    @Inject('USER-SERVICE')
    private readonly client: ClientGrpc,
  ) {
    this.userService =
      this.client.getService<UserServiceInterface>('UserService');
  }
  findAll() {}

  findOneUserById(id: number) {
    return this.userService.getUserById({ id });
  }

  findOneUserByEmail(email: string) {
    return this.userService.getUserByEmail({ email });
  }
}
