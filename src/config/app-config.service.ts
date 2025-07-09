import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get<number>('PORT', 3000);
  }

  get apiUrl(): string {
    return this.config.get<string>('API_URL')!;
  }

  get mongodbUri(): string {
    return this.config.get<string>('MONGODB_URI')!;
  }

  get glpiToken(): string {
    return this.config.get<string>('GLPI_APP_TOKEN')!;
  }

  get isProduction(): boolean {
    return this.config.get<string>('NODE_ENV') === 'production';
  }

  get jwtSecret(): string {
  return this.config.get<string>('JWT_SECRET')!;
}

}
