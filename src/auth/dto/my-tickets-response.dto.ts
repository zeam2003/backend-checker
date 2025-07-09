// src/dto/my-tickets-response.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { TicketItemDto } from './ticket-item.dto';


class PaginacionDto {
  @IsNumber()
  paginaActual: number;

  @IsNumber()
  elementosPorPagina: number;

  @IsNumber()
  total: number;
}

export class MyTicketsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketItemDto)
  tickets: TicketItemDto[];

  @ValidateNested()
  @Type(() => PaginacionDto)
  paginacion: PaginacionDto;
}
