import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosInstance } from 'axios';
import { LoginDto } from './dto/login.dto';
import { AppConfigService } from '../config/app-config.service';
import {
  STATUS_LABELS,
  TicketStatusEnum,
} from './interfaces/ticket-status.enum';
import { decode } from '../shared/utils/utils'; // ajustá la ruta si estás en otro nivel

@Injectable()
export class AuthService {
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'App-Token': this.config.glpiToken,
        'Content-Type': 'application/json',
      },
    });
  }

  private mapTicket(ticket: any) {
    const assigned =
      ticket._users_id_assign?.name ||
      `${ticket._users_id_assign?.firstname || ''} ${ticket._users_id_assign?.realname || ''}`.trim();

    return {
      id: ticket.id,
      name: ticket.name,
      status_code: ticket.status,
      status: TicketStatusEnum[ticket.status] || 'Desconocido',
      priority: ticket.priority ?? 'N/A',
      category: ticket.itilcategories_id ?? 'N/A',
      assignedTo: assigned || 'Sin asignar',
      entity: ticket.entities_id ?? 'N/A',
      date_creation: ticket.date_creation,
      date_mod: ticket.date_mod,
      content: decode(ticket.content || ''),
    };
  }

  async login(loginDto: LoginDto) {
    const response = await axios.post(
      `${this.config.apiUrl}initSession`,
      {
        login: loginDto.username,
        password: loginDto.password,
      },
      {
        headers: {
          'App-Token': this.config.glpiToken,
        },
      },
    );

    const sessionToken = response.data.session_token;

    // Obtener detalles del usuario
    const userDetails = await this.getUserDetails(sessionToken);

    // Firmar el JWT propio
    const payload = {
      sessionToken, // lo usaremos en guards y otros endpoints
      userId: userDetails.glpiID,
    };

    const jwt = this.jwtService.sign(payload);

    // Obtener timestamp actual (GLPI también lo devuelve)
    const currentTime = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    return {
      session_token: jwt, // nuestro JWT
      valid_id: sessionToken, // token GLPI real
      glpi_currenttime: currentTime,
      glpi_use_mode: 0,
      glpiID: userDetails.glpiID,
      glpifriendlyname: userDetails.glpifriendlyname,
      glpiname: userDetails.glpiname,
      glpirealname: userDetails.glpirealname,
      glpifirstname: userDetails.glpifirstname,
      glpiactiveprofile: {
        name: userDetails.name,
      },
      name: userDetails.name,
    };
  }

  async logout(user: any) {
    const sessionToken = user?.sessionToken;
    if (!sessionToken) throw new Error('No hay token activo');

    try {
      await this.axiosInstance.get('/killSession', {
        headers: { 'Session-Token': sessionToken },
      });
      return { message: 'Sesión finalizada exitosamente' };
    } catch (error) {
      throw new HttpException(
        'No se pudo cerrar la sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserDetails(sessionToken: string) {
    const response = await axios.get(`${this.config.apiUrl}getFullSession`, {
      headers: {
        'App-Token': this.config.glpiToken,
        'Session-Token': sessionToken,
      },
    });

    const data = response.data.session;

    const firstProfile = data.glpiactiveprofile ?? {
      name: 'Perfil no definido',
    };

    return {
      glpiID: data.glpiID,
      glpifriendlyname: data.glpifriendlyname,
      glpiname: data.glpiname,
      glpirealname: data.glpirealname,
      glpifirstname: data.glpifirstname,
      name: firstProfile.name,
    };
  }

  async getMyTickets(
    sessionToken: string,
    userId: number,
    page: number,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    status?: number[],
  ): Promise<any> {
    const start = Math.max(0, (page - 1) * limit);
    const end = start + limit - 1;

    const params: any = {
      is_deleted: 0,
      'criteria[0][link]': 'AND',
      'criteria[0][field]': '_users_id_assign',
      'criteria[0][searchtype]': 'equals',
      'criteria[0][value]': userId,
      expand_dropdowns: true,
      expand_dropdown: '_users_id_assign',
      sort: 'date_mod',
      order: 'DESC',
      get_hateoas: false,
    };

    let criteriaIndex = 1;

    if (startDate) {
      params[`criteria[${criteriaIndex}][link]`] = 'AND';
      params[`criteria[${criteriaIndex}][field]`] = 'date_mod';
      params[`criteria[${criteriaIndex}][searchtype]`] = 'greater';
      params[`criteria[${criteriaIndex}][value]`] = `${startDate} 00:00:00`;
      criteriaIndex++;
    }

    if (endDate) {
      params[`criteria[${criteriaIndex}][link]`] = 'AND';
      params[`criteria[${criteriaIndex}][field]`] = 'date_mod';
      params[`criteria[${criteriaIndex}][searchtype]`] = 'less';
      params[`criteria[${criteriaIndex}][value]`] = `${endDate} 23:59:59`;
      criteriaIndex++;
    }

    if (status && status.length > 0) {
      // Primera condición con AND
      params[`criteria[${criteriaIndex}][link]`] = 'AND';
      params[`criteria[${criteriaIndex}][field]`] = 'status';
      params[`criteria[${criteriaIndex}][searchtype]`] = 'equals';
      params[`criteria[${criteriaIndex}][value]`] = status[0];
      criteriaIndex++;

      // Las siguientes con OR
      for (let i = 1; i < status.length; i++) {
        params[`criteria[${criteriaIndex}][link]`] = 'OR';
        params[`criteria[${criteriaIndex}][field]`] = 'status';
        params[`criteria[${criteriaIndex}][searchtype]`] = 'in';
        params[`criteria[${criteriaIndex}][value]`] = status[i];
        criteriaIndex++;
      }
    }

    try {
      // Obtener total filtrado
      console.log('🔎 Params enviados a GLPI:', params);
      const countResponse = await this.axiosInstance.get('/Ticket', {
        headers: {
          'Session-Token': sessionToken,
          'App-Token': this.config.glpiToken,
          'Content-Type': 'application/json',
        },
        params: {
          ...params,
          only_count: true,
        },
      });
      console.log('🧾 Respuesta cruda de GLPI (tickets):', countResponse.data);
      // Obtener tickets paginados
      const response = await this.axiosInstance.get('/Ticket', {
        headers: {
          'Session-Token': sessionToken,
          'App-Token': this.config.glpiToken,
          'Content-Type': 'application/json',
          Range: `${start}-${end}`,
        },
        params,
      });

      const mappedTickets = response.data.map((ticket: any) => ({
        id: ticket.id,
        name: ticket.name,
        status_code: ticket.status,
        status: TicketStatusEnum[ticket.status] || 'Desconocido',
        priority: ticket.priority ?? 'N/A',
        category: ticket.itilcategories_id ?? 'N/A',
        assignedTo:
          ticket._users_id_assign?.name ||
          (ticket._users_id_assign?.realname ||
          ticket._users_id_assign?.firstname
            ? `${ticket._users_id_assign?.firstname || ''} ${ticket._users_id_assign?.realname || ''}`.trim()
            : 'Sin asignar'),
        entity: ticket.entities_id ?? 'N/A',
        date_creation: ticket.date_creation,
        date_mod: ticket.date_mod,
        content: decode(ticket.content || ''),
      }));

      return {
        tickets: mappedTickets,
        paginacion: {
          paginaActual: Number(page) || 1,
          elementosPorPagina: Number(limit),
          total: Array.isArray(countResponse.data)
            ? countResponse.data.length
            : 0,
        },
      };
    } catch (error) {
      console.error('Error al obtener tickets:', error.response?.data || error);
      throw new HttpException(
        'Error al obtener tickets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Query params (opcional):

  //page=1

  //limit=10

  //status=2 (por ejemplo, para “EN_CURSO”)

  //startDate=2025-07-01

  //endDate=2025-07-08
}
