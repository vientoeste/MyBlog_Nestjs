import { Request } from 'express';

export interface RequestWithUser extends Request {
  // [TODO] validation needed
  payload: {
    userUuid: string;
    email: string;
  };
}
