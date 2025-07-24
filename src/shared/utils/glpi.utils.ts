import { Env } from 'src/config/env';
import { STATUS_LABELS } from '../constants/status-label';
import { decode } from './utils';
import axios from 'axios';

export function mapTicket(ticket: any) {
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


export async function getTickets(sessionToken: string, params: any) {
  const baseUrl = Env.apiUrl.replace(/\/+$/, ''); // quitar / final

  const response = await axios.get(`${baseUrl}/Ticket`, {
    headers: {
      'App-Token': Env.glpiToken,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
    params,
  });

  return response;
}
