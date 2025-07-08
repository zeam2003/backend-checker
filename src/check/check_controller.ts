import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateCheckDto } from './dto/create_check.dto';
import { CheckService } from './check_service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get('pending')
  async getPendingTickets() {
    return this.checkService.getPendingTickets();
  }

  @Post()
  async createCheck(@Body() dto: CreateCheckDto) {
    return this.checkService.createCheck(dto);
  }
}
