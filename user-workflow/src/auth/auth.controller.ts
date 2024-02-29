import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { EventCommands } from 'src/common/event-commands.enum';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(EventCommands.SEND_REGISTER)
  async create(@Payload() data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern('findAllAuth')
  findAll() {
    return this.authService.findAll();
  }
}
