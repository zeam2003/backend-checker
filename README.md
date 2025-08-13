# Backend Checker - API Documentation

Backend en NestJS que actúa como intermediario entre una aplicación Flutter y la API REST de GLPI en producción.

## Características

- Autenticación JWT con validación de sesiones GLPI
- Filtrado avanzado de tickets por usuario, estado y fechas
- Endpoints para tickets próximos a vencer
- Comunicación directa con la API de GLPI
- Validación de datos con DTOs
- Manejo de errores robusto

## Endpoints de la API

### Autenticación

#### `POST /auth/login`
**Descripción:** Inicia sesión del usuario en GLPI y devuelve un JWT para autenticación.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Respuesta:**
```json
{
  "session_token": "JWT_TOKEN",
  "valid_id": "GLPI_SESSION_TOKEN",
  "glpiID": 79,
  "glpifriendlyname": "Nombre del Usuario",
  "glpiname": "usuario",
  "glpirealname": "Apellido",
  "glpifirstname": "Nombre",
  "name": "Perfil del Usuario"
}
```

---

### Tickets del Usuario

#### `GET /auth/my-tickets`
**Descripción:** Obtiene los tickets asignados al usuario autenticado con filtros opcionales.

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `startDate` (opcional): Fecha de inicio para filtrar (YYYY-MM-DD)
- `endDate` (opcional): Fecha de fin para filtrar (YYYY-MM-DD)
- `status` (opcional): Estado del ticket (puede ser un número o array de números)

**Ejemplo de uso:**
```
GET /auth/my-tickets?page=1&limit=20&status=2&status=4&startDate=2025-07-01&endDate=2025-07-31
```

**Respuesta:**
```json
{
  "tickets": [
    {
      "id": 35422,
      "name": "Active Directory - Vulnerabilidades Junio 2025",
      "status_code": 2,
      "status": "EN_CURSO",
      "priority": 5,
      "category": "CIBERSEGURIDAD",
      "assignedTo": "79",
      "entity": "80",
      "urgency": 3,
      "impact": 3,
      "type": 1,
      "date_creation": "2025-07-01 16:50:40",
      "closedate": "",
      "solvedate": "",
      "time_to_resolve": "2025-07-08 16:50:40",
      "date_mod": "2025-07-01 16:50:40",
      "content": "Descripción del ticket...",
      "sla_time_to_resolve": "MEDIO (2 DIAS)"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "elementosPorPagina": 20,
    "total": 1
  }
}
```

---

#### `GET /auth/my-tickets/next-to-expire`
**Descripción:** Obtiene los 3 tickets del usuario autenticado que están próximos a vencer, ordenados por fecha de vencimiento.

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Filtros aplicados automáticamente:**
- Solo tickets en curso (status 2) o en espera (status 4)
- Ordenados por `time_to_resolve` ascendente (los que vencen primero)
- Limitado a 3 resultados

**Respuesta:**
```json
{
  "tickets": [
    {
      "id": 35422,
      "name": "Ticket próximo a vencer",
      "status_code": 2,
      "status": "EN_CURSO",
      "priority": 5,
      "category": "CIBERSEGURIDAD",
      "assignedTo": "79",
      "entity": "80",
      "urgency": 3,
      "impact": 3,
      "type": 1,
      "date_creation": "2025-07-01 16:50:40",
      "closedate": "",
      "solvedate": "",
      "time_to_resolve": "2025-07-08 16:50:40",
      "date_mod": "2025-07-01 16:50:40",
      "content": "Descripción del ticket...",
      "sla_time_to_resolve": "MEDIO (2 DIAS)"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "elementosPorPagina": 3,
    "total": 1
  }
}
```

---

### Endpoint de Prueba

#### `GET /auth/test-glpi-simple`
**Descripción:** Endpoint de prueba para verificar la comunicación directa con GLPI.

**Query Parameters:**
- `sessionToken` (requerido): Token de sesión de GLPI (`valid_id` del login)
- `userId` (opcional): ID del usuario (si no se proporciona, se intenta obtener del JWT en Authorization)

**Headers (opcional):** `Authorization: Bearer <JWT_TOKEN>`

**Respuesta:** Respuesta cruda de GLPI para tickets con status = 2.

---

### Otros Endpoints

#### `GET /auth/ticket-status`
**Descripción:** Obtiene la lista de estados de tickets disponibles.

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Respuesta:**
```json
[
  {
    "name": "nuevo",
    "value": 1
  },
  {
    "name": "en curso",
    "value": 2
  },
  {
    "name": "en espera",
    "value": 4
  }
]
```

#### `GET /auth/user`
**Descripción:** Obtiene los detalles del usuario autenticado.

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### `POST /auth/logout`
**Descripción:** Cierra la sesión del usuario en GLPI.

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

---

## Códigos de Estado de Tickets

- `1`: NUEVO
- `2`: EN_CURSO
- `4`: EN_ESPERA
- `5`: RESUELTO
- `6`: CERRADO
- `7`: CANCELADO

---

## Campos Disponibles en la Respuesta

Los tickets incluyen los siguientes campos (cuando están disponibles):

### Campos Básicos
- **id**: Identificador único del ticket
- **name**: Título/nombre del ticket
- **status**: Estado legible del ticket
- **status_code**: Código numérico del estado
- **priority**: Prioridad del ticket
- **category**: Categoría del ticket

### Campos de Asignación
- **assignedTo**: Usuario asignado al ticket
- **entity**: Entidad del ticket

### Campos de Fechas
- **date_creation**: Fecha de creación
- **date_mod**: Fecha de última modificación
- **closedate**: Fecha de cierre
- **solvedate**: Fecha de resolución
- **time_to_resolve**: Fecha límite para resolver

### Campos de SLA
- **sla_time_to_resolve**: Descripción del SLA (ej: "MEDIO (2 DIAS)")

### Campos de Contenido
- **content**: Descripción detallada del ticket

### Otros Campos
- **urgency**: Nivel de urgencia
- **impact**: Nivel de impacto
- **type**: Tipo de ticket

---

## Filtros y Búsquedas

### Filtrado por Estado
Los endpoints de tickets permiten filtrar por uno o múltiples estados:
```
GET /auth/my-tickets?status=2&status=4
```

### Filtrado por Fechas
Puedes filtrar tickets por rango de fechas:
```
GET /auth/my-tickets?startDate=2025-07-01&endDate=2025-07-31
```

### Ordenamiento
- **Tickets próximos a vencer**: Ordenados por `time_to_resolve` ascendente
- **Tickets generales**: Ordenados por `date_mod` descendente

---

## Paginación

### Parámetros de Paginación
- `page`: Número de página (comienza en 1, default: 1)
- `limit`: Cantidad de elementos por página (default: 10)

### Cómo Funciona
La paginación se aplica **después** de los filtros (status, fechas, etc.). El backend calcula internamente:
```typescript
const start = Math.max(0, (page - 1) * limit);
const end = start + limit - 1;
```

### Ejemplos de URLs con Paginación

#### Página básica (10 elementos):
```
GET /auth/my-tickets
```

#### Primera página con 20 elementos:
```
GET /auth/my-tickets?page=1&limit=20
```

#### Segunda página con 10 elementos:
```
GET /auth/my-tickets?page=2&limit=10
```

#### Tercera página con 15 elementos:
```
GET /auth/my-tickets?page=3&limit=15
```

#### Con filtros y paginación:
```
GET /auth/my-tickets?page=2&limit=20&status=2&status=4&startDate=2025-07-01
```

### Casos de Uso Prácticos

#### Para una tabla paginada:
- **Primera página**: `?page=1&limit=20`
- **Siguiente página**: `?page=2&limit=20`
- **Página anterior**: `?page=1&limit=20`

#### Para diferentes dispositivos:
- **Móvil**: `?page=1&limit=5`
- **Desktop**: `?page=1&limit=25`

### Respuesta de Paginación
```json
{
  "tickets": [...],
  "paginacion": {
    "paginaActual": 2,
    "elementosPorPagina": 10,
    "total": 45
  }
}
```

### Consideraciones Importantes
- **El campo `total`** indica el total de tickets que coinciden con los filtros
- **Si `page` es mayor** que el total de páginas disponibles, devuelve un array vacío
- **El `limit` máximo** depende de la configuración de GLPI (típicamente 100-1000)
- **La paginación se aplica DESPUÉS** de aplicar todos los filtros

---

## Autenticación

### Flujo de Autenticación
1. **Login**: `POST /auth/login` con credenciales de GLPI
2. **Obtener JWT**: La respuesta incluye un `session_token` (JWT)
3. **Usar JWT**: Incluir en el header `Authorization: Bearer <JWT_TOKEN>`

### Tokens
- **JWT**: Token interno del backend para autenticación
- **GLPI Session Token**: Token de sesión de GLPI para comunicaciones con la API externa

---

## Manejo de Errores

### Códigos de Estado HTTP
- `200`: Operación exitosa
- `400`: Error en los parámetros o datos
- `401`: No autorizado (token inválido o expirado)
- `500`: Error interno del servidor

### Respuestas de Error
```json
{
  "statusCode": 400,
  "timestamp": "2025-07-18T18:27:54.976Z",
  "path": "/api/v1/auth/my-tickets",
  "message": "Mensaje de error específico"
}
```

---

## Configuración

### Variables de Entorno Requeridas
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/check-db
GLPI_APP_TOKEN=your_glpi_app_token
API_URL=https://glpi.ecosistemasglobal.com/eco/apirest.php/
JWT_SECRET=your_jwt_secret
```

---

## Uso con Postman

### 1. Login
```
POST http://localhost:3001/api/v1/auth/login
Body: {
  "username": "your_username",
  "password": "your_password"
}
```

### 2. Usar el JWT
```
GET http://localhost:3001/api/v1/auth/my-tickets
Headers: Authorization: Bearer <JWT_FROM_LOGIN>
```

---

## Notas Técnicas

- El backend usa el endpoint `/search/Ticket` de GLPI para búsquedas avanzadas
- Los campos se referencian por ID numérico en las consultas a GLPI
- La paginación se maneja internamente para limitar resultados
- Los tickets se mapean desde la respuesta cruda de GLPI a un formato estructurado
