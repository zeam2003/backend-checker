import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateCheckDto } from './dto/create_check.dto';

@Injectable()
export class CheckService {
  private readonly logger = new Logger(CheckService.name);
  private readonly apiUrl = process.env.API_URL;
  private readonly appToken = process.env.GLPI_APP_TOKEN;

  constructor(private readonly httpService: HttpService) {}

  async getPendingTickets(): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'App-Token': this.appToken,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.apiUrl}/Tickets`, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error al obtener tickets pendientes', error);
      throw error;
    }
  }

  async createCheck(dto: CreateCheckDto): Promise<any> {
    this.logger.log('Creando check con datos:', dto);

    // Aquí procesarías la lógica de guardado en Mongo, o el POST a GLPI, etc.

    return {
      message: 'Check recibido correctamente',
      check: dto,
    };
  }
}
