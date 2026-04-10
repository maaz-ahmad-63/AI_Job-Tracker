"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY not set. AI features will not work.');
}
const openai = apiKey ? new openai_1.default({ apiKey }) : null;
class AIService {
    /**
     * Parse a job description using OpenAI GPT
     */
    async parseJobDescription(jdText) {
        if (!openai) {
            return {
                companyName: undefined,
                position: undefined,
                jdLink: undefined,
                salaryRange: undefined,
                seniority: undefined,
                location: undefined,
                keyResponsibilities: [],
                requiredSkills: [],
                niceToHaveSkills: [],
                summary: 'AI service not configured. Please set OPENAI_API_KEY environment variable.',
            };
        }
        try {
            const prompt = `
You are a job description analyzer. Parse the following job description and extract the key information.

Job Description:
${jdText}

Please respond with a JSON object containing:
{
  "companyName": "company name if mentioned",
  "position": "job title",
  "salaryRange": "salary if mentioned, otherwise null",
  "seniority": "seniority level (e.g., Junior, Mid-level, Senior, Staff, Lead)",
  "location": "job location/remote status if mentioned",
  "keyResponsibilities": ["array", "of", "key", "responsibilities"],
  "requiredSkills": ["array", "of", "required", "skills"],
  "niceToHaveSkills": ["array", "of", "nice", "to", "have", "skills"],
  "summary": "1-2 sentence summary of the role"
}

Only respond with valid JSON, no markdown or extra text.
      `;
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });
            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }
            const parsed = JSON.parse(content);
            return {
                companyName: parsed.companyName || undefined,
                position: parsed.position || undefined,
                jdLink: undefined,
                salaryRange: parsed.salaryRange || undefined,
                seniority: parsed.seniority || undefined,
                location: parsed.location || undefined,
                keyResponsibilities: parsed.keyResponsibilities || [],
                requiredSkills: parsed.requiredSkills || [],
                niceToHaveSkills: parsed.niceToHaveSkills || [],
                summary: parsed.summary || '',
            };
        }
        catch (error) {
            console.error('Error parsing job description:', error);
            throw error;
        }
    }
    /**
     * Generate resume bullet points for a role
     */
    async generateResumeBullets(position, companyName, responsibilities, skills) {
        if (!openai) {
            return {
                bullets: [],
                tips: ['AI service not configured. Please set OPENAI_API_KEY environment variable.'],
            };
        }
        try {
            const prompt = `
You are a resume writer specializing in tech roles. Generate 3-5 compelling resume bullet points for this job application.

Position: ${position}
Company: ${companyName}
Key Responsibilities: ${responsibilities.join(', ')}
Skills Required: ${skills.join(', ')}

Generate bullet points that:
1. Start with strong action verbs
2. Show impact and metrics where possible
3. Align with the role's requirements
4. Are concise but specific

Respond with a JSON object:
{
  "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Only respond with valid JSON, no markdown or extra text.
      `;
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });
            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }
            const parsed = JSON.parse(content);
            return {
                bullets: parsed.bullets || [],
                tips: parsed.tips || [],
            };
        }
        catch (error) {
            console.error('Error generating resume bullets:', error);
            throw error;
        }
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=ai.js.map