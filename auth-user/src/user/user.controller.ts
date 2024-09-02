import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { EventCommands } from 'src/common/event-commands.enum';
import { UserDto } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(EventCommands.GET_USERS)
  async Login() {
    return this.userService.findAll();
  }
  @EventPattern(EventCommands.FIND_USER)
  async FindUser(email: string) {
    return this.userService.findOneByEmail(email);
  }
}
