export type ApplicationStatus = 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
export interface IApplication {
    _id: string;
    userId: string;
    companyName: string;
    position: string;
    jdLink?: string;
    notes?: string;
    appliedDate: Date;
    status: ApplicationStatus;
    salaryRange?: {
        min?: number;
        max?: number;
    };
    requiredSkills?: string[];
    niceToHaveSkills?: string[];
    seniority?: string;
    location?: string;
    resumeSuggestions?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ICreateApplicationRequest {
    company: string;
    role: string;
    jdLink?: string;
    notes?: string;
    dateApplied?: Date;
    status: ApplicationStatus;
    salaryRange?: {
        min?: number;
        max?: number;
    };
}
export interface IJDParseRequest {
    jobDescription: string;
}
export interface IJDParseResponse {
    company: string;
    role: string;
    requiredSkills: string[];
    niceToHaveSkills: string[];
    seniority: string;
    location: string;
}
//# sourceMappingURL=application.d.ts.map