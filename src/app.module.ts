import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { DatabaseModule } from './database/database.module';
import { CheckModule } from './check/check_module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    AuthModule,
    CheckModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {}

