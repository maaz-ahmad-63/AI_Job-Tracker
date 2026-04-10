import { IRegisterRequest, ILoginRequest, IAuthResponse, IAuthPayload } from '../types';
export declare class AuthService {
    register(data: IRegisterRequest): Promise<IAuthResponse>;
    login(data: ILoginRequest): Promise<IAuthResponse>;
    validateToken(token: string): Promise<IAuthPayload | null>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.d.ts.map