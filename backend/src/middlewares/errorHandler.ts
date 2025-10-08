import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  console.error(err);
  res.status(500).json({ 
    success: false, 
    error: { message: "Internal Server Error" } 
  });
}
