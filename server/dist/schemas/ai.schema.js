import { z } from 'zod';
export const parseJobDescriptionInputSchema = z.object({
    jobDescription: z.string().min(40)
});
export const parsedJobDescriptionSchema = z.object({
    company: z.string(),
    role: z.string(),
    requiredSkills: z.array(z.string()),
    niceToHaveSkills: z.array(z.string()),
    seniority: z.string(),
    location: z.string(),
    resumeSuggestions: z.array(z.string()).min(3).max(5)
});
