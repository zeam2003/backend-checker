import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Check, CheckSchema } from './schemas/check.schema';
import { CheckDetail, CheckDetailSchema } from './schemas/check-detail.schema';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.mongodbUri,
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

