import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    code?: string | undefined;
    constructor(message: string, statusCode: number, code?: string | undefined);
}
export declare const errorHandler: (error: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.d.ts.map