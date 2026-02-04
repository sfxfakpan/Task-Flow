import { Request } from 'express';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Extended Express Request with JWT user data
 */
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    sub: string;
  };
}
