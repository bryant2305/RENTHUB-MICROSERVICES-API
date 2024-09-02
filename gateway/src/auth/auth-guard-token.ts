import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard {
  private readonly jwtSecret = 'your-secret-key';
  public generateToken(userId: number, userEmail: string): string {
    const payload = { sub: userId, email: userEmail };
    const options = { expiresIn: '1h' }; // Puedes ajustar la duración del token según tus necesidades
    return jwt.sign(payload, this.jwtSecret, options);
  }
}
