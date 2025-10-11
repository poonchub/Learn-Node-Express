import type { Request, Response, NextFunction } from 'express'
import { loginService, registerService } from '../services/authService.js'
import { AppError } from '../errors/AppError.js'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body
    const user = await registerService(name, email, password)
    res.status(201).json({ success: true, data: user })
  } catch (err) {
    if (err instanceof AppError) {
      next(err)
    } else if (err instanceof Error) {
      next(new AppError(err.message, 500, 'INTERNAL_ERROR'))
    } else {
      next(new AppError(JSON.stringify(err), 500, 'INTERNAL_ERROR'))
    }
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const result = await loginService(email, password)
    res.json({ success: true, ...result })
  } catch (err: unknown) {
    if (err instanceof AppError) {
      next(err)
    } else if (err instanceof Error) {
      next(new AppError(err.message, 500, 'INTERNAL_ERROR'))
    } else {
      next(new AppError(JSON.stringify(err), 500, 'INTERNAL_ERROR'))
    }
  }
}