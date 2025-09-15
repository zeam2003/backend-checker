import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { GetMyTicketsDto } from './dto/get-my-tickets.dto';
import { TicketStatusEnum } from './interfaces/ticket-status.enum';
import { MyTicketsResponseDto } from './dto/my-tickets-response.dto';
import { AppConfigService } from '../config/app-config.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { mapTicketFromSearch } from 'src/shared/utils/map-tickets';
import { MyTicketsReportDto } from './dto/my-tickets-report.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Req() req: RequestWithUser) {
    return this.authService.getUserDetails(req.user);
  }

  @Get('my-tickets')
  @UseGuards(JwtAuthGuard)
  async getMyTickets(
    @Req() req: RequestWithUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: number | number[],
  ): Promise<MyTicketsResponseDto> {
    const sessionToken = req.user?.sessionToken;
    const userId = req.user?.userId;

    if (!sessionToken || !userId) {
      throw new HttpException(
        'Token o usuario inválido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const statusArray = Array.isArray(status)
      ? status.map(Number)
      : status !== undefined
        ? [Number(status)]
        : [];

    return this.authService.getMyTickets(
      sessionToken,
      userId,
      page,
      limit,
      startDate,
      endDate,
      statusArray,
    );
  }

  @Get('my-tickets/next-to-expire')
  @UseGuards(JwtAuthGuard)
  async getNextToExpireTickets(
    @Req() req: RequestWithUser,
  ): Promise<MyTicketsResponseDto> {
    const sessionToken = req.user?.sessionToken;
    const userId = req.user?.userId;

    if (!sessionToken || !userId) {
      throw new HttpException(
        'Token o usuario inválido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authService.getNextToExpireTickets(sessionToken, userId);
  }

  @Get('ticket-status')
  getTicketStatuses() {
    return Object.entries(TicketStatusEnum)
      .filter(([key, val]) => typeof val === 'number')
      .map(([key, val]) => ({
        name: key.replace(/_/g, ' ').toLowerCase(), // "en curso"
        value: val,
      }));
  }

  @Get('test-glpi-simple')
  async testGlpiSimple(
    @Query('sessionToken') sessionToken: string,
    @Query('userId') userIdQuery?: string,
    @Req() req?: any,
  ) {
    if (!sessionToken) throw new Error('Falta sessionToken');
    // Obtener userId: por query o decodificando el JWT si viene en Authorization
    let userId = userIdQuery;
    if (!userId && req && req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded: any = jwt.decode(token);
        userId = decoded?.userId;
      } catch {}
    }
    if (!userId) throw new Error('Falta userId');
    const url = `${this.config.apiUrl}search/Ticket`;
    const params: any = {
      'criteria[0][link]': 'AND',
      'criteria[0][field]': 4, // ID del campo usuario asignado
      'criteria[0][searchtype]': 'equals',
      'criteria[0][value]': userId,
    };
    try {
      const response = await axios.get(url, {
        headers: {
          'Session-Token': sessionToken,
          'App-Token': this.config.glpiToken,
          'Content-Type': 'application/json',
        },
        params,
      });
      const mappedTickets = Array.isArray(response.data.data)
        ? response.data.data.map(mapTicketFromSearch)
        : [];

      // Limita a los 3 primeros tickets
      const limitedTickets = mappedTickets.slice(0, 3);

      return {
        tickets: limitedTickets,
        paginacion: {
          paginaActual: 1,
          elementosPorPagina: 3,
          total: limitedTickets.length,
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

  @Get('my-tickets-report')
  @UseGuards(JwtAuthGuard)
  async getMyTicketsReport(
    @Query() query: MyTicketsReportDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const userId = req.user?.userId;
      const sessionToken = req.user?.sessionToken;
      return this.authService.getMyTicketsReport(userId, sessionToken, query);
    } catch (error) {
      throw new HttpException(error.message || 'Error desconocido', 500);
    }
  }
}
