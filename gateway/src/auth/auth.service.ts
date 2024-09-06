// auth.service.ts (Microservicio Principal)

import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth-guard-token';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  private authService: any;
  private userService: any;
  constructor(
    @Inject('USER-AUTH')
    private readonly client: ClientGrpc,
    private readonly authGuard: AuthGuard,
    private readonly jwtStrategy: JwtStrategy,
  ) {
    this.authService = this.client.getService('AuthService');
    this.userService = this.client.getService('UserService');
  }
  async register(data: RegisterDto) {
    try {
      const result = await this.userService.register(data).toPromise();

      const token = this.authGuard.generateToken(
        result.user.id,
        result.user.email,
      );

      return { user: result.user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async login(data: LoginDto) {
    try {
      // const result = await this.authService.login(data).toPromise();

      const user = await this.jwtStrategy.validate({ email: data.email });

      const token = this.authGuard.generateToken(user.id, user.email);

      return { user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
