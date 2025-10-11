import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError.js'

export const requireRole = (role: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('req.user =', req.user)
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'))
    }

    if (req.user.role !== role) {
      return next(new AppError('Forbidden: insufficient permissions', 403, 'FORBIDDEN'))
    }

    next()
  }
}
