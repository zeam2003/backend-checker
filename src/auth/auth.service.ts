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
import { mapTicket, mapTicketFromSearch } from '../shared/utils/map-tickets';
import { Ticket } from './interfaces/ticket.interface';
import * as qs from 'qs';
import { MyTicketsReportDto } from './dto/my-tickets-report.dto';
import { GlpiSearchCriterion } from 'src/shared/interfaces/glpi-search-criterion.interface';
import { STATUS_GROUPS } from 'src/shared/constants/status-label';
import { getTickets } from 'src/shared/utils/glpi.utils';

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
      sla_time_to_resolve: ticket[30] ?? '',
      sla_escalation_level: ticket[32] ?? '',
      sla_time_to_own: ticket[37] ?? '',
    };
  }

  // Inicia sesión en GLPI y devuelve un token JWT
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

  // Cierra la sesión del usuario
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

  //Trae los detalles de un usuario
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

  // Trae todos los tickets de un determinado usuario
  async getMyTickets(
    sessionToken: string,
    userId: number,
    page: number,
    limit: number = 30,
    startDate?: string,
    endDate?: string,
    status?: number[],
  ): Promise<{
    tickets: Ticket[];
    paginacion: {
      paginaActual: number;
      elementosPorPagina: number;
      total: number;
    };
  }> {
    const start = Math.max(0, (page - 1) * limit);
    const end = start + limit - 1;

    const params: any = {
      'criteria[0][link]': 'AND',
      'criteria[0][field]': 4, // ID del campo usuario asignado
      'criteria[0][searchtype]': 'equals',
      'criteria[0][value]': userId,
      
    };
    params['forcedisplay[0]'] = 1;   // name
    params['forcedisplay[1]'] = 2;   // id
    params['forcedisplay[2]'] = 3;   // priority
    params['forcedisplay[3]'] = 4;   // assignedTo
    params['forcedisplay[4]'] = 5;   // entity
    params['forcedisplay[5]'] = 7;   // category
    params['forcedisplay[6]'] = 10;  // urgency
    params['forcedisplay[7]'] = 11;  // impact
    params['forcedisplay[8]'] = 12;  // status
    params['forcedisplay[9]'] = 14;  // type
    params['forcedisplay[10]'] = 15; // date_creation
    params['forcedisplay[11]'] = 16; // closedate
    params['forcedisplay[12]'] = 17; // solvedate
    params['forcedisplay[13]'] = 18; // time_to_resolve
    params['forcedisplay[14]'] = 19; // date_mod
    params['forcedisplay[15]'] = 21; // content
    params['forcedisplay[30]'] = 30; // SLA Nivel de escalamiento
    // Agrega más si necesitas otros campos
    let criteriaIndex = 1;

    // ✅ Filtrado por múltiples status con AND + OR, usando el ID de campo 12 y agrupando
    if (status && status.length > 0) {
      status.forEach((stat, idx) => {
        params[`criteria[${criteriaIndex}][link]`] = idx === 0 ? 'AND' : 'OR';
        params[`criteria[${criteriaIndex}][field]`] = 12; // ID del campo status
        params[`criteria[${criteriaIndex}][searchtype]`] = 'equals';
        params[`criteria[${criteriaIndex}][value]`] = stat;
        params[`criteria[${criteriaIndex}][group]`] = 1;
        criteriaIndex++;
      });
    }

    try {
      // Debug opcional
      //console.log('🔎 Params enviados a GLPI:', params);

      const queryString = qs.stringify(params, { encode: false });
      console.log('🔍 URL final a GLPI:', `/search/Ticket?${queryString}`);

      // Usar paramsSerializer para enviar el query string crudo
      const response = await this.axiosInstance.get('/search/Ticket', {
        headers: {
          'Session-Token': sessionToken,
          'App-Token': this.config.glpiToken,
          'Content-Type': 'application/json',
          Range: `${start}-${end}`,
        },
        params,
        paramsSerializer: () => queryString,
      });

      //console.log('respuesta en crudo', response);

      // Mostrar la respuesta cruda de GLPI antes del mapeo
      console.log('Respuesta cruda de GLPI:', JSON.stringify(response.data.data, null, 2));

      const mappedTickets = Array.isArray(response.data.data)
        ? response.data.data.map(mapTicketFromSearch)
        : [];

      return {
        tickets: mappedTickets,
        paginacion: {
          paginaActual: Number(page) || 1,
          elementosPorPagina: Number(limit),
          total: mappedTickets.length, // Solo contamos los tickets devueltos
        },
      };
    } catch (error) {
      if (error.response) {
        console.error('GLPI error:', error.response.data);
        throw new HttpException(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data),
          error.response.status || 500,
        );
      }
      throw new HttpException(error.message || 'Error desconocido', 500);
    }
  }

  // Trae los tickets próximos a vencer
  async getNextToExpireTickets(sessionToken: string, userId: number): Promise<{ tickets: Ticket[]; paginacion: { paginaActual: number; elementosPorPagina: number; total: number } }> {
    // Reutiliza la lógica de getMyTickets pero limitando a 3 y ordenando por time_to_resolve (ID 18)
    const status = [2, 4];
    const limit = 3;
    const page = 1;

    const params: any = {
      'criteria[0][link]': 'AND',
      'criteria[0][field]': 4, // usuario asignado
      'criteria[0][searchtype]': 'equals',
      'criteria[0][value]': userId,
      //'sort': 18, // ordenar por time_to_resolve
      //'order': 'ASC',
    };
    let criteriaIndex = 1;
    status.forEach((stat, idx) => {
      params[`criteria[${criteriaIndex}][link]`] = 'OR'; // Cambiar a OR para ambos criterios de status
      params[`criteria[${criteriaIndex}][field]`] = 12;
      params[`criteria[${criteriaIndex}][searchtype]`] = 'equals';
      params[`criteria[${criteriaIndex}][value]`] = stat;
      params[`criteria[${criteriaIndex}][group]`] = 1;
      criteriaIndex++;
    });
    // forcedisplay[] igual que en getMyTickets
    params['forcedisplay[0]'] = 1;
    params['forcedisplay[1]'] = 2;
    params['forcedisplay[2]'] = 3;
    params['forcedisplay[3]'] = 4;
    params['forcedisplay[4]'] = 5;
    params['forcedisplay[5]'] = 7;
    params['forcedisplay[6]'] = 10;
    params['forcedisplay[7]'] = 11;
    params['forcedisplay[8]'] = 12;
    params['forcedisplay[9]'] = 14;
    params['forcedisplay[10]'] = 15;
    params['forcedisplay[11]'] = 16;
    params['forcedisplay[12]'] = 17;
    params['forcedisplay[13]'] = 18;
    params['forcedisplay[14]'] = 19;
    params['forcedisplay[15]'] = 21;
    params['forcedisplay[16]'] = 30;
    // ... agrega más si necesitas

    const start = 0;
    const end = limit - 1;
    
    const qs = require('qs');
    const queryString = qs.stringify(params, { encode: false });
    
    const response = await this.axiosInstance.get('/search/Ticket', {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': this.config.glpiToken,
        'Content-Type': 'application/json',
        Range: `${start}-${end}`,
      },
      params,
      paramsSerializer: () => queryString,
    });
    
    const { mapTicketFromSearch } = require('../shared/utils/map-tickets');
    const mappedTickets = Array.isArray(response.data.data)
      ? response.data.data.map(mapTicketFromSearch)
      : [];

    const limitedTickets = mappedTickets.slice(0, 3);

    return {
      tickets: limitedTickets,
      paginacion: {
        paginaActual: 1,
        elementosPorPagina: 3,
        total: limitedTickets.length,
      },
    };
  }

  async getMyTicketsReport(userId: number, sessionToken: string, dto: MyTicketsReportDto) {
    const { page, limit, startDate, endDate, statusGroup, status } = dto;
  
    // Usar la misma lógica que getMyTickets que funciona correctamente
    const params: any = {
      'criteria[0][link]': 'AND',
      'criteria[0][field]': 4, // ID del campo usuario asignado
      'criteria[0][searchtype]': 'equals',
      'criteria[0][value]': userId,
    };

    // Agregar campos a mostrar
    const forceDisplayFields = [1, 2, 3, 4, 5, 7, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21, 30];
    forceDisplayFields.forEach((field, index) => {
      params[`forcedisplay[${index}]`] = field;
    });

    let criteriaIndex = 1;

    // Priorizar array de status específicos sobre statusGroup
    const statusArray = status && status.length > 0 ? status : (statusGroup && STATUS_GROUPS[statusGroup] ? STATUS_GROUPS[statusGroup] : []);
    
    if (statusArray.length > 0) {
      statusArray.forEach((stat, idx) => {
        params[`criteria[${criteriaIndex}][link]`] = idx === 0 ? 'OR' : 'OR';
        params[`criteria[${criteriaIndex}][field]`] = 12; // ID del campo status
        params[`criteria[${criteriaIndex}][searchtype]`] = 'equals';
        params[`criteria[${criteriaIndex}][value]`] = stat;
        params[`criteria[${criteriaIndex}][group]`] = 1;
        criteriaIndex++;
      });
    }

    if (startDate) {
      params[`criteria[${criteriaIndex}][link]`] = 'AND';
      params[`criteria[${criteriaIndex}][field]`] = 15; // ID del campo date_creation
      params[`criteria[${criteriaIndex}][searchtype]`] = 'morethan';
      params[`criteria[${criteriaIndex}][value]`] = startDate;
      criteriaIndex++;
    }

    if (endDate) {
      params[`criteria[${criteriaIndex}][link]`] = 'AND';
      params[`criteria[${criteriaIndex}][field]`] = 15; // ID del campo date_creation
      params[`criteria[${criteriaIndex}][searchtype]`] = 'lessthan';
      params[`criteria[${criteriaIndex}][value]`] = endDate;
      criteriaIndex++;
    }

    console.log('🔍 Criterios construidos:', JSON.stringify(params, null, 2));
  
    // Primero obtener todos los tickets para el resumen (sin paginación)
    const queryString = qs.stringify(params, { encode: false });
    const fullUrl = `${this.config.apiUrl}/search/Ticket?${queryString}`;
    console.log('🌐 URL completa enviada a GLPI:', fullUrl);
    const allResponse = await this.axiosInstance.get('/search/Ticket', {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': this.config.glpiToken,
        'Content-Type': 'application/json',
        Range: '0-9999',
      },
      params,
      paramsSerializer: () => queryString,
    });
  
    const allTickets = allResponse.data?.data ?? [];
    const total = allResponse.data?.total ?? allTickets.length;
  
    // Calcular resumen sobre todos los tickets
    const resumen = {
      enCurso: 0,
      enEspera: 0,
      resueltos: 0,
      cerrados: 0,
    };
  
    for (const t of allTickets) {
      const status = Number(t[12]); // El status está en el índice 12 del array
      if (STATUS_GROUPS.en_curso.includes(status)) resumen.enCurso++;
      else if (STATUS_GROUPS.en_espera.includes(status)) resumen.enEspera++;
      else if (STATUS_GROUPS.resueltos.includes(status)) resumen.resueltos++;
      else if (STATUS_GROUPS.cerrados.includes(status)) resumen.cerrados++;
    }

    // Luego obtener solo los tickets de la página actual
    const offset = (page - 1) * limit;
    const pageResponse = await this.axiosInstance.get('/search/Ticket', {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': this.config.glpiToken,
        'Content-Type': 'application/json',
        Range: `${offset}-${offset + limit - 1}`,
      },
      params,
      paramsSerializer: () => queryString,
    });

    const rawTickets = pageResponse.data?.data ?? [];
    const tickets = rawTickets.map(mapTicketFromSearch);
  
    return {
      data: tickets,
      total,
      page,
      limit,
      resumen,
    };
  }
  //Query params (opcional):

  //page=1

  //limit=10

  //status=2 (por ejemplo, para “EN_CURSO”)

  //startDate=2025-07-01

  //endDate=2025-07-08
}
