import { IsNumber } from 'class-validator';


export class CheckTicketDto {
 
    @IsNumber()
    ticketId: number;
}