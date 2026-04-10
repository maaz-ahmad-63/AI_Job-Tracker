interface MockUser {
    _id: string;
    email: string;
    password: string;
    createdAt: Date;
}
interface MockApplication {
    _id: string;
    userId: string;
    companyName: string;
    position: string;
    status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
    appliedDate: Date;
    jdLink?: string;
    notes?: string;
    salaryRange?: {
        min?: number;
        max?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare class MockDatabase {
    private users;
    private emailIndex;
    private applications;
    private userApplicationsIndex;
    findOne(email: string): MockUser | null;
    findOneAsync(email: string): Promise<MockUser | null>;
    create(data: {
        email: string;
        password: string;
    }): Promise<MockUser>;
    updateOne(userId: string, updates: any): Promise<MockUser | null>;
    createApplication(data: any): Promise<MockApplication>;
    getApplicationsByUserId(userId: string): MockApplication[];
    getApplicationById(applicationId: string): MockApplication | null;
    updateApplication(applicationId: string, data: any): MockApplication | null;
    deleteApplication(applicationId: string): MockApplication | null;
    clear(): void;
    getAllUsers(): MockUser[];
}
export declare const mockDb: MockDatabase;
export declare const setMockDatabaseEnabled: (enabled: boolean) => void;
export declare const isMockDatabase: () => boolean;
export {};
//# sourceMappingURL=mockDatabase.d.ts.map