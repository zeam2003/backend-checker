// src/interfaces/ticket-status.enum.ts

export enum TicketStatusEnum {
  NUEVO = 1,
  EN_CURSO = 2,
  EN_ESPERA = 4,
  RESUELTO = 5,
  CERRADO = 6,
}

export const STATUS_LABELS: Record<number, string> = {
  [TicketStatusEnum.NUEVO]: 'Nuevo',
  [TicketStatusEnum.EN_CURSO]: 'En curso',
  [TicketStatusEnum.EN_ESPERA]: 'En espera',
  [TicketStatusEnum.RESUELTO]: 'Resuelto',
  [TicketStatusEnum.CERRADO]: 'Cerrado',
};
