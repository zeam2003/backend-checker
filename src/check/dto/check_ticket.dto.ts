import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckTicketDto {
    @ApiProperty({
        example: 123,
        description: 'ID del ticket a verificar',
        required: true
    })
    @IsNumber()
    ticketId: number;
}