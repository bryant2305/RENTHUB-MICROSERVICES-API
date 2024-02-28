// auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth-guard-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly authGuard: AuthGuard,
  ) {}

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

    const token = this.authGuard.generateToken(user.id, user.email);
    return { token };
  }

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
}
