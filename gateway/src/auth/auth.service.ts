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
  constructor(
    @Inject('AUTH')
    private readonly client: ClientGrpc,
    private readonly authGuard: AuthGuard,
    private readonly jwtStrategy: JwtStrategy,
  ) {
    this.authService = this.client.getService('AuthService');
    this.authService = this.client.getService('AuthService');
  }
  async register(data: RegisterDto) {
    try {
      // Obtener el resultado de la llamada al microservicio
      const result = await this.authService.register(data).toPromise();

      const user = result.user;

      // Generar el token usando los datos del usuario
      const token = this.authGuard.generateToken(user.id, user.email);

      // Retornar el usuario y el token
      return { user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async login(data: LoginDto) {
    try {
      await this.authService.login(data).toPromise();

      const user = await this.jwtStrategy.validate({ email: data.email });

      const token = this.authGuard.generateToken(user.id, user.email);

      return { user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
