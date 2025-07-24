export interface Ticket {
  id: number;
  name: string;
  status_code: number;
  status: string;
  priority: number | string;
  category: string;
  assignedTo: string;
  entity: string;
  date_creation: string;
  date_mod: string;
  content: string;
  urgency?: string | number;
  impact?: string | number;
  type?: string | number;
  closedate?: string;
  solvedate?: string;
  time_to_resolve?: string;
  sla_time_to_resolve?: string;
}
export enum TicketStatusEnum {
  NUEVO = 1,
  EN_CURSO = 2,
  EN_ESPERA = 4,
  RESUELTO = 5,
  CERRADO = 6,
  CANCELADO = 7,
}
