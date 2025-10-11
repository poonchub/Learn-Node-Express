import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'supersecret';

export interface JwtPayload {
  id: number;
  role: string;
}

type RequestWithUser = Request & { user?: JwtPayload };

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const r = req as RequestWithUser;
  const authHeader = r.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401, 'NO_TOKEN'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next(new AppError('No token provided', 401, 'NO_TOKEN'));

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.id || !decoded.role) {
      return next(new AppError('Invalid token payload', 403, 'INVALID_TOKEN'));
    }

    r.user = decoded;
    next();
  } catch (err) {
    next(new AppError('Invalid token', 403, 'INVALID_TOKEN'));
  }
};
