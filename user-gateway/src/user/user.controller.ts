import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @ApiOperation({ summary: 'users' })
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
