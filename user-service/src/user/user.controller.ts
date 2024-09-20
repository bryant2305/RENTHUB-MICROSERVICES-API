import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { error } from 'console';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'getUserById')
  async FindUserById(data: { id: number }) {
    const user = await this.userService.findOneById(data.id);
    if (!user) {
      return {
        error: true,
        message: `User with ID ${data.id} not found`,
      };
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  @GrpcMethod('UserService', 'getUserByEmail')
  async FindUserByEmail(data: { email: string }) {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      return {
        error: true,
        message: `User with email ${data.email} not found`,
      };
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
  @GrpcMethod('UserService', 'createUser')
  async Register(data: RegisterDto) {
    const user = await this.userService.findOneByEmail(data.email);
    if (user) {
      throw new RpcException('User alredy exist');
    }
    return await this.userService.createUser(data);
  }
}
