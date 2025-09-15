/* export const STATUS_LABELS: { [key: number]: string } = {
  1: 'NUEVO',
  2: 'EN_CURSO',
  3: 'EN_PRUEBA',
  4: 'EN_ESPERA',
  5: 'RESUELTO',
  6: 'CERRADO',
};
 */

export const STATUS_LABELS = {
  1: 'Nuevo',
  2: 'En curso',
  4: 'En espera',
  5: 'Resuelto',
  6: 'Cerrado',
};

export const STATUS_GROUPS = {
  todos: [],
  en_curso: [2],
  en_espera: [4],
  resueltos: [5],
  cerrados: [6],
};