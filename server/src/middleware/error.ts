import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  // MongoDB duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    res.status(400).json({
      message: `A record with this ${field} already exists`,
      code: 'DUPLICATE_KEY',
    });
    return;
  }

  // MongoDB validation error
  if ((error as any).name === 'ValidationError') {
    const messages = Object.values((error as any).errors).map((err: any) => err.message);
    res.status(400).json({
      message: 'Validation failed',
      details: messages,
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
