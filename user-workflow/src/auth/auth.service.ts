import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
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

    return { user: newUser };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }

    const isPasswordValid = await this.userService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
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
