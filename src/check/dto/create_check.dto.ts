import { IsNumber, IsEnum, IsOptional, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum CheckStatus {
  EN_CURSO = 'en_curso',
  EN_ESPERA = 'en_espera',
  FINALIZADO = 'finalizado'
}

enum CheckType {
  LAPTOP = 'laptop',
  DESKTOP = 'desktop',
  MONITOR = 'monitor',
  OTRO = 'otro'
}

export class CreateCheckDto {
  @ApiProperty({
    example: 123,
    description: 'ID del ticket asociado',
  })
  @IsNumber()
  ticketId: number;

  @ApiProperty({
    example: 1,
    description: 'Etapa del check (1 o 2)',
  })
  @IsNumber()
  @Min(1)
  @Max(2)
  stage: number;

  @ApiProperty({
    example: 1234,
    description: 'ID del usuario en GLPI que crea el check',
  })
  @IsNumber()
  glpiID: number;

  @ApiProperty({
    example: 'Revisión laptop HP',
    description: 'Título de referencia del check',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'laptop',
    description: 'Tipo de equipo a revisar',
    enum: CheckType
  })
  @IsEnum(CheckType)
  type: CheckType;

  @ApiProperty({
    example: 'en_curso',
    description: 'Estado del check',
    enum: CheckStatus,
    default: CheckStatus.EN_CURSO
  })
  @IsEnum(CheckStatus)
  @IsOptional()
  status?: CheckStatus;
}