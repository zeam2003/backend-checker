import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // Podés reemplazar `any` por un tipo más preciso, como `AuthPayload`
}
