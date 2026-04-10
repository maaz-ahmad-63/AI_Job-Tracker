import OpenAI from 'openai';
import { env } from '../config/env.js';
import { parsedJobDescriptionSchema } from '../schemas/ai.schema.js';
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
export async function parseJobDescriptionWithAI(jobDescription) {
    const completion = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: 'You extract structured job data and write highly specific resume bullet suggestions. Return ONLY valid JSON.'
            },
            {
                role: 'user',
                content: `Extract these fields from the job description:\n- company\n- role\n- requiredSkills (array)\n- niceToHaveSkills (array)\n- seniority\n- location\nAlso generate 3 to 5 resumeSuggestions tailored to this exact role and skills.\n\nJob Description:\n${jobDescription}`
            }
        ]
    });
    const content = completion.choices[0]?.message.content;
    if (!content) {
        throw new Error('AI returned an empty response');
    }
    let parsed;
    try {
        parsed = JSON.parse(content);
    }
    catch {
        throw new Error('AI returned invalid JSON');
    }
    const validated = parsedJobDescriptionSchema.safeParse(parsed);
    if (!validated.success) {
        throw new Error('AI response did not match expected schema');
    }
    return validated.data;
}
