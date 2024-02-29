import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { EventCommands } from 'src/common/event-commands.enum';
import { register } from 'module';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(EventCommands.SEND_REGISTER)
  async create(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('findAllAuth')
  findAll() {
    return this.authService.findAll();
  }

  @MessagePattern('findOneAuth')
  findOne(@Payload() id: number) {
    return this.authService.findOne(id);
  }

  @MessagePattern('updateAuth')
  update(@Payload() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(updateAuthDto.id, updateAuthDto);
  }

  @MessagePattern('removeAuth')
  remove(@Payload() id: number) {
    return this.authService.remove(id);
  }
}
