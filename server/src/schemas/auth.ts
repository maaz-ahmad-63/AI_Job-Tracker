import { IRegisterRequest, ILoginRequest } from '../types';

export const validateRegisterInput = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Valid email is required');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Valid password is required');
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (!/[A-Z]/.test(data.password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (!/[a-z]/.test(data.password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (!/[0-9]/.test(data.password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateLoginInput = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
