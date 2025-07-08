import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get port(): number {
    return this.config.get<number>('PORT', 3000);
  }

  get mongodbUri(): string {
    return this.config.get<string>('MONGODB_URI', '');
  }

  get glpiToken(): string {
    return this.config.get<string>('GLPI_APP_TOKEN', '');
  }

  get apiUrl(): string {
    return this.config.get<string>('API_URL', '');
  }
}
