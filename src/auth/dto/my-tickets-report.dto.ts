// auth/dto/my-tickets-report.dto.ts
import { IsOptional, IsIn, IsDateString, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class MyTicketsReportDto {
  @IsOptional()
  @IsIn(['todos', 'en_curso', 'en_espera', 'resueltos', 'cerrados'])
  statusGroup?: 'todos' | 'en_curso' | 'en_espera' | 'resueltos' | 'cerrados';

  @IsOptional()
  @IsArray()
  @IsIn([1, 2, 3, 4, 5], { each: true })
  @Type(() => Number)
  status?: number[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
