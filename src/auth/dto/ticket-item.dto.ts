// src/dto/ticket-item.dto.ts
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class TicketItemDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  status?: string; // Texto legible del estado, ej. "En curso"

  @IsOptional()
  @IsNumber()
  status_code?: number; // Código numérico del estado

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsDateString()
  date_creation?: string;

  @IsOptional()
  @IsDateString()
  date_mod?: string;
}
