import mongoose, { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../types';
interface IApplicationDocument extends Document {
    userId: Types.ObjectId;
    company: string;
    role: string;
    jdLink?: string;
    notes?: string;
    dateApplied: Date;
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
export declare const Application: mongoose.Model<IApplicationDocument, {}, {}, {}, mongoose.Document<unknown, {}, IApplicationDocument> & IApplicationDocument & {
    _id: Types.ObjectId;
}, any>;
export {};
//# sourceMappingURL=Application.d.ts.map