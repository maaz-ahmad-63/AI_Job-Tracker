import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils';
import { IAuthPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: IAuthPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // Optional auth, so just continue
    next();
  }
};
