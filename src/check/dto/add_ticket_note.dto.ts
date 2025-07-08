import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddTicketNoteDto {
    @ApiProperty({
        example: 'Se realizó mantenimiento preventivo al equipo',
        description: 'Contenido de la nota o seguimiento'
    })
    @IsString()
    content: string;
    
    @ApiProperty({
        example: 1,
        description: 'ID del ticket al que se agrega la nota'
    })
    @IsNumber()
    tickets_id: number;

    @ApiProperty({
        description: 'Archivo adjunto (opcional)',
        type: 'string',
        format: 'binary',
        required: false
    })
    @IsOptional()
    file?: Express.Multer.File;
}