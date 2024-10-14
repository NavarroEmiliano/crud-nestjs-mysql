import { Request } from 'express';

export interface UserPayload {
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
