import { Module } from '@nestjs/common';

import { CheckController } from './check_controller';
import { CheckService } from './check_service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';



@Module({
  imports: [HttpModule,DatabaseModule],
  controllers: [CheckController],
  providers: [CheckService],
})
export class CheckModule {}
