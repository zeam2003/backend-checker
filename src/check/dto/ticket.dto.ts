import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
  @ApiProperty({ example: 35501, description: 'ID único del ticket.' })
  id: number;

  @ApiProperty({
    example: 'Ecosistemas > Argentina',
    description: 'Entidad a la que pertenece el ticket.',
  })
  entities_id: string;

  @ApiProperty({
    example: 'Reporte Infra - Junio - 2025',
    description: 'Título o nombre del ticket.',
  })
  name: string;

  @ApiProperty({
    example: '2025-07-07 15:45:01',
    description: 'Fecha de última modificación.',
  })
  date_mod: string;

  @ApiProperty({
    example: 5,
    description:
      'Código de estado del ticket (1:Nuevo, 2:En curso, 4:En espera, 5:Resuelto, 6:Cerrado).',
  })
  status: number;

  @ApiProperty({
    example: 'jlovardo',
    description: 'Usuario asignado al ticket.',
  })
  users_id_recipient: string;

  @ApiProperty({ example: 3, description: 'Nivel de urgencia.' })
  urgency: number;

  @ApiProperty({
    example: '2025-07-07 09:16:53',
    description: 'Fecha de apertura del ticket.',
    required: false,
  })
  date?: string;

  @ApiProperty({
    example: '2025-07-09 09:16:53',
    description: 'Fecha de vencimiento para la resolución.',
    required: false,
  })
  time_to_resolve?: string;
}