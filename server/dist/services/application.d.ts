import { IApplication } from '../types';
export interface CreateApplicationInput {
    companyName: string;
    position: string;
    status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
    appliedDate: string;
    jdLink?: string;
    notes?: string;
    salaryRange?: string;
}
export interface UpdateApplicationInput {
    companyName?: string;
    position?: string;
    status?: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
    appliedDate?: string;
    jdLink?: string;
    notes?: string;
    salaryRange?: string;
}
export declare class ApplicationService {
    createApplication(userId: string, data: CreateApplicationInput): Promise<IApplication>;
    getApplications(userId: string): Promise<IApplication[]>;
    getApplicationById(userId: string, applicationId: string): Promise<IApplication>;
    updateApplication(userId: string, applicationId: string, data: UpdateApplicationInput): Promise<IApplication>;
    deleteApplication(userId: string, applicationId: string): Promise<void>;
}
export declare const applicationService: ApplicationService;
//# sourceMappingURL=application.d.ts.map