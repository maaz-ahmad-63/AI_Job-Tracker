import { Request, Response, NextFunction } from 'express';
import { IAuthPayload } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: IAuthPayload;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map