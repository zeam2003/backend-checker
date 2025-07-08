import { IsString, IsEnum, IsOptional } from 'class-validator';


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
 
  @IsEnum(ComponentType)
  componentType: ComponentType;


  @IsEnum(ComponentStatus)
  status: ComponentStatus;

  
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