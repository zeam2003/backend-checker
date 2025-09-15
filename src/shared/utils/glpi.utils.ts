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


export async function getTickets(sessionToken: string, options: any) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error('API_URL no está configurada en las variables de entorno');
  }
  
  const baseUrl = apiUrl.replace(/\/+$/, ''); // quitar / final

  // Convertir criterios al formato que espera GLPI
  const params: any = {};
  
  if (options.criteria && Array.isArray(options.criteria)) {
    options.criteria.forEach((criterion: any, index: number) => {
      params[`criteria[${index}][link]`] = criterion.link || (index === 0 ? 'AND' : 'AND');
      params[`criteria[${index}][field]`] = criterion.field;
      params[`criteria[${index}][searchtype]`] = criterion.searchtype;
      params[`criteria[${index}][value]`] = criterion.value;
      if (criterion.group) {
        params[`criteria[${index}][group]`] = criterion.group;
      }
    });
  }

  // Agregar campos a mostrar
  const forceDisplayFields = [1, 2, 3, 4, 5, 7, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21, 30];
  forceDisplayFields.forEach((field, index) => {
    params[`forcedisplay[${index}]`] = field;
  });

  // Agregar ordenamiento si se especifica
  if (options.sort) {
    params.sort = options.sort;
  }
  if (options.order) {
    params.order = options.order;
  }

  // Agregar rango si se especifica
  if (options.range && Array.isArray(options.range)) {
    params.range = `${options.range[0]}-${options.range[1]}`;
  }

  // Log para debugging - mostrar URL y parámetros
  const fullUrl = `${baseUrl}/search/Ticket`;
  console.log('\n=== GLPI DEBUG INFO ===');
  console.log('🔍 GLPI Request URL:', fullUrl);
  console.log('🔍 GLPI Request Params:', JSON.stringify(params, null, 2));
  
  // Construir URL completa con parámetros para testing manual
  const urlParams = new URLSearchParams(params);
  const encodedUrl = `${fullUrl}?${urlParams.toString()}`;
  // Decodificar la URL para que GLPI pueda interpretarla correctamente
  const decodedUrl = decodeURIComponent(encodedUrl);
  
  console.log('\n🔗 URL COMPLETA PARA TESTING MANUAL (DECODIFICADA):');
  console.log(decodedUrl);
  console.log('\n📋 HEADERS NECESARIOS:');
  console.log(`App-Token: ${process.env.GLPI_APP_TOKEN}`);
  console.log(`Session-Token: ${sessionToken}`);
  console.log('Content-Type: application/json');
  console.log('\n📝 COMANDO CURL PARA TESTING (URL DECODIFICADA):');
  console.log(`curl -X GET "${decodedUrl}" \\`);
  console.log(`  -H "App-Token: ${process.env.GLPI_APP_TOKEN}" \\`);
  console.log(`  -H "Session-Token: ${sessionToken}" \\`);
  console.log(`  -H "Content-Type: application/json"`);
  console.log('========================\n');

  const response = await axios.get(fullUrl, {
    headers: {
      'App-Token': process.env.GLPI_APP_TOKEN,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
    params,
  });

  console.log('✅ GLPI Response Status:', response.status);
  console.log('📊 GLPI Response Data Count:', response.data?.data?.length || 0);
  console.log('📈 GLPI Response Total:', response.data?.total || 0);

  return response;
}
