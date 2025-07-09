// src/dto/get-my-tickets.dto.ts
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketStatusEnum } from '../interfaces/ticket-status.enum';

export class GetMyTicketsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  startDate?: string; // se puede extender para usar @IsDateString si querés validación estricta

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(TicketStatusEnum, {
    message: `status debe ser uno de: ${Object.values(TicketStatusEnum).join(', ')}`
  })
  status?: TicketStatusEnum;
}
