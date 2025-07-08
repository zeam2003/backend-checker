import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from '../auth/interface/auth.interface';

@Injectable()
export class AuthService {
  async login(credentials: LoginDto): Promise<AuthPayload> {
    const { email, password } = credentials;

    // Simulación de autenticación (reemplazar con lógica real)
    if (email !== 'admin@example.com' || password !== 'admin123') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: AuthPayload = {
      userId: '123',
      email,
      roles: ['admin'],
      accessToken: 'jwt-token-de-ejemplo'
    };

    return payload;
  }
}
