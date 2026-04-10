import { IAuthPayload } from '../types';
export declare const generateToken: (payload: IAuthPayload) => string;
export declare const verifyToken: (token: string) => IAuthPayload;
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
//# sourceMappingURL=jwt.d.ts.map