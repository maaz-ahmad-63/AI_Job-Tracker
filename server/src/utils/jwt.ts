import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const generateToken = (payload: IAuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): IAuthPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IAuthPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
};
