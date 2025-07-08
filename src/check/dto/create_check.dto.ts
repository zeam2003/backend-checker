import { IsNumber, IsEnum, IsOptional, Min, Max, IsString } from 'class-validator';

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
  
  @IsNumber()
  ticketId: number;

 
  @IsNumber()
  @Min(1)
  @Max(2)
  stage: number;

  
  @IsNumber()
  glpiID: number;

  @IsString()
  @IsOptional()
  title?: string;

 
  @IsEnum(CheckType)
  type: CheckType;

 
  @IsEnum(CheckStatus)
  @IsOptional()
  status?: CheckStatus;
}