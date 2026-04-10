import { z } from 'zod';
import { applicationStatuses } from '../models/application.model.js';
export const applicationSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    jdLink: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional().default(''),
    dateApplied: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    status: z.enum(applicationStatuses).default('Applied'),
    salaryRange: z.string().optional().default(''),
    requiredSkills: z.array(z.string()).optional().default([]),
    niceToHaveSkills: z.array(z.string()).optional().default([]),
    seniority: z.string().optional().default(''),
    location: z.string().optional().default(''),
    resumeSuggestions: z.array(z.string()).optional().default([])
});
export const applicationUpdateSchema = applicationSchema.partial();
