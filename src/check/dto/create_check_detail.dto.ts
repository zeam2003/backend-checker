import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum ComponentStatus {
  BUENO = 'bueno',
  REGULAR = 'regular',
  MALO = 'malo'
}

enum ComponentType {
  PANTALLA = 'pantalla',
  TECLADO = 'teclado',
  TOUCHPAD = 'touchpad',
  WIFI = 'wifi',
  ETHERNET = 'ethernet',
  BATERIA = 'bateria',
  DETALLES_FISICOS = 'detalles_fisicos',
  FUNCIONAMIENTO_GENERAL = 'funcionamiento_general'
}

export class CreateCheckDetailDto {
  @ApiProperty({
    example: 'pantalla',
    description: 'Tipo de componente a evaluar',
    enum: ComponentType
  })
  @IsEnum(ComponentType)
  componentType: ComponentType;

  @ApiProperty({
    example: 'bueno',
    description: 'Estado del componente',
    enum: ComponentStatus
  })
  @IsEnum(ComponentStatus)
  status: ComponentStatus;

  @ApiProperty({
    example: 'El componente funciona correctamente',
    description: 'Comentarios adicionales',
    required: false
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageName?: string;
}