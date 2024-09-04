import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { EventCommands } from 'src/common/event-commands.enum';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(EventCommands.GET_USERS)
  async Login() {
    return this.userService.findAll();
  }
  @GrpcMethod('UserService', 'getUserById')
  async FindUserById(id: number) {
    return this.userService.findOneById(id);
  }

  @GrpcMethod('UserService', 'getUserByEmail')
  async FindUserByEmail(data: { email: string }) {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new RpcException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
