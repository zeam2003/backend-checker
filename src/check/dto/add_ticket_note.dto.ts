import { IsNumber, IsOptional, IsString,  } from "class-validator";



export class AddTicketNoteDto {
    
    @IsString()
    content: string;
    
    
    @IsNumber()
    tickets_id: number;

    
    @IsOptional()
    file?: Express.Multer.File;
}