import { decode } from './utils';
import {
  TicketStatusEnum,
  Ticket,
} from '../../auth/interfaces/ticket.interface';

export const STATUS_LABELS: Record<number, string> = {
  [TicketStatusEnum.NUEVO]: 'NUEVO',
  [TicketStatusEnum.EN_CURSO]: 'EN_CURSO',
  [TicketStatusEnum.EN_ESPERA]: 'EN_ESPERA',
  [TicketStatusEnum.RESUELTO]: 'RESUELTO',
  [TicketStatusEnum.CERRADO]: 'CERRADO',
  [TicketStatusEnum.CANCELADO]: 'CANCELADO',
};

export function mapTicket(ticket: any): Ticket {
  return {
    id: ticket.id,
    name: ticket.name,
    status_code: ticket.status,
    status: STATUS_LABELS[ticket.status] || 'Desconocido',
    priority: ticket.priority ?? 'N/A',
    category: ticket.itilcategories_id ?? 'N/A',
    assignedTo:
      ticket._users_id_assign?.name ||
      `${ticket._users_id_assign?.firstname || ''} ${ticket._users_id_assign?.realname || ''}`.trim() ||
      'Sin asignar',
    entity: ticket.entities_id ?? 'N/A',
    date_creation: ticket.date_creation,
    date_mod: ticket.date_mod,
    content: decode(ticket.content || ''),
  };
}

// Nuevo: mapeo para /search/Ticket (campos numéricos)
export function mapTicketFromSearch(ticket: any): Ticket {
  return {
    id: ticket[2],
    name: ticket[1],
    status_code: ticket[12],
    status: STATUS_LABELS[ticket[12]] || 'Desconocido',
    priority: ticket[3] ?? 'N/A',
    category: ticket[7] ?? 'N/A',
    assignedTo: ticket[4]?.toString() || 'Sin asignar',
    entity: ticket[5]?.toString() || 'N/A',
    urgency: ticket[10] ?? '',
    impact: ticket[11] ?? '',
    type: ticket[14] ?? '',
    date_creation: ticket[15] || '',
    closedate: ticket[16] || '',
    solvedate: ticket[17] || '',
    time_to_resolve: ticket[18] || '',
    date_mod: ticket[19] || '',
    content: decode(ticket[21] || ''),
    sla_time_to_resolve: ticket[30] ?? '',
  };
}
