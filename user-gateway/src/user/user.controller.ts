import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @ApiOperation({ summary: 'users' })
  @UseGuards(JwtGuard)
  getAllUsers() {
    return this.userService.findAll();
  }
  @Get(':email')
  @ApiOperation({ summary: 'find a user' })
  getUser(@Param('email') email: string) {
    // Puedes construir tu objeto UserDto si es necesario
    return this.userService.findOneUser(email);
  }
}
