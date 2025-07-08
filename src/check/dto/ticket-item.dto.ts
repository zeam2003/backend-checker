import { ApiProperty } from '@nestjs/swagger';

export class TicketItemDto {
    @ApiProperty({ description: 'ID del registro de Item_Ticket' })
    id: number;

    @ApiProperty({ description: 'ID del item asociado' })
    items_id: number;

    @ApiProperty({ description: 'Tipo de item (ej: Computer, Monitor, etc)' })
    itemtype: string;

    @ApiProperty({ description: 'ID del ticket al que está asociado' })
    tickets_id: number;

    @ApiProperty({ description: 'Fecha de creación del registro', required: false })
    date_creation?: string;

    @ApiProperty({ description: 'Fecha de última modificación', required: false })
    date_mod?: string;
}