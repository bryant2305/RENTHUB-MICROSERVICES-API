import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

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
