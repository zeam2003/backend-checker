import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateTicketDto {
  
  @IsString()
  name: string;

  
  @IsString()
  content: string;

  
  @IsNumber()
  status: number;

  
  @IsNumber()
  type: number;

  
  @IsNumber()
  urgency: number;

  
  @IsNumber()
  impact: number;

  
  @IsNumber()
  priority: number;

  
  @IsNumber()
  requesttypes_id: number;

  
  @IsNumber()
  itilcategories_id: number;

  
  @IsArray()
  @Type(() => Number) // Transforma el string a un array de números
  _users_id_requester: number[];

  
  @IsArray()
  @Type(() => Number) // Asegura que se reciba un array de números
  _groups_id_assign: number[];

  
  @IsArray()
  @Type(() => Number) // Transforma los valores a array de números
  _users_id_assign: number[];

 
  @IsNumber()
  entities_id: number;

 
  @IsNumber()
  locations_id: number;

  
  @IsOptional() // Permite que este campo sea opcional
  @IsNumber()
  slas_id_ttr?: number;
}
