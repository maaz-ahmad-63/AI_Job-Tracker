export interface ParsedJobDescription {
    companyName?: string;
    position?: string;
    jdLink?: string;
    salaryRange?: string;
    seniority?: string;
    location?: string;
    keyResponsibilities: string[];
    requiredSkills: string[];
    niceToHaveSkills: string[];
    summary: string;
}
export interface ResumeBullets {
    bullets: string[];
    tips: string[];
}
export declare class AIService {
    /**
     * Parse a job description using OpenAI GPT
     */
    parseJobDescription(jdText: string): Promise<ParsedJobDescription>;
    /**
     * Generate resume bullet points for a role
     */
    generateResumeBullets(position: string, companyName: string, responsibilities: string[], skills: string[]): Promise<ResumeBullets>;
}
export declare const aiService: AIService;
//# sourceMappingURL=ai.d.ts.map