import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth-guard-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly authGuard: AuthGuard,
  ) {}
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.userService.hashPassword(password);
    const newUser = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const token = this.authGuard.generateToken(newUser.id, newUser.email);
    return { user: newUser, token };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
