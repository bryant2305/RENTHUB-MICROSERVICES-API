// auth.controller.ts (Microservicio Secundario)

import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { EventCommands } from 'src/common/event-commands.enum';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(EventCommands.SEND_REGISTER)
  async Register(@Payload() data: RegisterDto) {
    return this.authService.register(data);
  }
  @EventPattern(EventCommands.SEND_LOGIN)
  async Login(@Payload() data: RegisterDto) {
    return this.authService.login(data);
  }
}
