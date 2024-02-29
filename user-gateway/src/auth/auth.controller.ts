import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // @ApiOperation({ summary: 'login' })
  // @ApiResponse({ status: 201, description: 'logeado!' })
  // login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }

  @Post('register')
  @ApiOperation({ summary: 'register' })
  @ApiResponse({ status: 201, description: 'registrado!' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.sendRegisterRequest(registerDto);
  }
}
