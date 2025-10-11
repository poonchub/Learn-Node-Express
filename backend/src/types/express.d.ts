import type { JwtPayload } from '../middlewares/authGuard.js'; // type-only import

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}