// auth.controller.ts (Microservicio Secundario)

import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('UserService', 'register')
  async Register(@Payload() data: RegisterDto) {
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'login')
  async Login(@Payload() data: RegisterDto) {
    return this.authService.login(data);
  }
}
