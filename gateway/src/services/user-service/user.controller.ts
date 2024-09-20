import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'find a user' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  getUser(@Param('id') id: number) {
    return this.userService.findOneUserById(id);
  }
}
