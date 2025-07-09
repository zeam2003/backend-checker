import { Controller, Post, Body, Get, Req, UseGuards, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { GetMyTicketsDto } from './dto/get-my-tickets.dto';
import { TicketStatusEnum } from './interfaces/ticket-status.enum';
import { MyTicketsResponseDto } from './dto/my-tickets-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Query('status') status?: number | number[]
):Promise<MyTicketsResponseDto> {
  const sessionToken = req.user?.sessionToken;
  const userId = req.user?.userId;

  if (!sessionToken || !userId) {
    throw new HttpException('Token o usuario inválido', HttpStatus.UNAUTHORIZED);
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

@Get('ticket-status')
getTicketStatuses() {
  return Object.entries(TicketStatusEnum)
    .filter(([key, val]) => typeof val === 'number')
    .map(([key, val]) => ({
      name: key.replace(/_/g, ' ').toLowerCase(), // "en curso"
      value: val,
    }));
}


}



