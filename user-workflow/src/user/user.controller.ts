import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { EventCommands } from 'src/common/event-commands.enum';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(EventCommands.GET_USERS)
  async Login() {
    return this.userService.findAll();
  }
}

