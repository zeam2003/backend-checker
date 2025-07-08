import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    example: 'Problema con el servidor',
    description: 'Título del ticket',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'El servidor se ha reiniciado y no responde',
    description: 'Descripción del problema',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
    description: 'ID del estado del ticket',
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de ticket',
  })
  @IsNumber()
  type: number;

  @ApiProperty({
    example: 1,
    description: 'Nivel de urgencia (1: Baja, 2: Media, 3: Alta)',
  })
  @IsNumber()
  urgency: number;

  @ApiProperty({
    example: 2,
    description: 'Nivel de impacto'
  })
  @IsNumber()
  impact: number;

  @ApiProperty({
    example: 3,
    description: 'Nivel de prioridad'
  })
  @IsNumber()
  priority: number;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de solicitud'
  })
  @IsNumber()
  requesttypes_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría ITIL'
  })
  @IsNumber()
  itilcategories_id: number;

  @ApiProperty({
    example: [1],
    description: 'Array con ID del usuario solicitante'
  })
  @IsArray()
  @Type(() => Number) // Transforma el string a un array de números
  _users_id_requester: number[];

  @ApiProperty({
    example: [1],
    description: 'Array con ID del grupo asignado'
  })
  @IsArray()
  @Type(() => Number) // Asegura que se reciba un array de números
  _groups_id_assign: number[];

  @ApiProperty({
    example: [1],
    description: 'Array con ID del técnico asignado'
  })
  @IsArray()
  @Type(() => Number) // Transforma los valores a array de números
  _users_id_assign: number[];

  @ApiProperty({
    example: 1,
    description: 'ID de la entidad'
  })
  @IsNumber()
  entities_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la ubicación'
  })
  @IsNumber()
  locations_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del SLA para tiempo de resolución',
    required: false
  })
  @IsOptional() // Permite que este campo sea opcional
  @IsNumber()
  slas_id_ttr?: number;
}
