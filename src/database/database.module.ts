import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Check, CheckSchema } from './schemas/check.schema';
import { CheckDetail, CheckDetailSchema } from './schemas/check-detail.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // ✅ Necesario para que funcione el inject
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // ✅ Necesario para acceder al servicio
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // ✅ Leemos del .env validado
        dbName: 'check-db',
      }),
    }),
    MongooseModule.forFeature([
      { name: Check.name, schema: CheckSchema },
      { name: CheckDetail.name, schema: CheckDetailSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}


