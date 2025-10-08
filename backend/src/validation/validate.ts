import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod';

export const validateBody = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.format() });
    }

    req.body = result.data as T;
    next();
  };
};