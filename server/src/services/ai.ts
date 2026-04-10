import OpenAI from 'openai'

// Initialize OpenAI client and models
const apiKey = process.env.OPENAI_API_KEY
const jdModel = process.env.OPENAI_JD_MODEL || process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
const resumeModel = process.env.OPENAI_RESUME_MODEL || process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

if (!apiKey) {
  console.warn('⚠️  OPENAI_API_KEY not set. AI features will not work.')
} else {
  console.log(
    `✅ OPENAI_API_KEY loaded (starts with: ${apiKey.substring(0, 20)}...), models -> JD: ${jdModel}, Resume: ${resumeModel}`
  )
}

const openai = apiKey ? new OpenAI({ apiKey }) : null

export interface ParsedJobDescription {
  companyName?: string
  position?: string
  jdLink?: string
  salaryRange?: string
  seniority?: string
  location?: string
  keyResponsibilities: string[]
  requiredSkills: string[]
  niceToHaveSkills: string[]
  summary: string
}

export interface ResumeBullets {
  bullets: string[]
  tips: string[]
}

export class AIService {
  /**
   * Parse a job description using OpenAI GPT
   */
  async parseJobDescription(jdText: string): Promise<ParsedJobDescription> {
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
      }
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
      `

      const response = await openai.chat.completions.create({
        model: jdModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = response.choices[0].message.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      const parsed = JSON.parse(content)
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
      }
    } catch (error: any) {
      console.error('❌ Error parsing job description:', error instanceof Error ? error.message : error)
      if (error?.status === 429) {
        throw new Error(
          `OpenAI rate limit reached for model "${jdModel}". Try a different model via OPENAI_JD_MODEL or switch API key.`
        )
      }
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('OpenAI API key is invalid or expired')
      }
      throw error
    }
  }

  /**
   * Generate resume bullet points for a role
   */
  async generateResumeBullets(
    position: string,
    companyName: string,
    responsibilities: string[],
    skills: string[]
  ): Promise<ResumeBullets> {
    if (!openai) {
      return {
        bullets: [],
        tips: ['AI service not configured. Please set OPENAI_API_KEY environment variable.'],
      }
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
      `

      const response = await openai.chat.completions.create({
        model: resumeModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = response.choices[0].message.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      const parsed = JSON.parse(content)
      return {
        bullets: parsed.bullets || [],
        tips: parsed.tips || [],
      }
    } catch (error: any) {
      console.error('Error generating resume bullets:', error)
      if (error?.status === 429) {
        throw new Error(
          `OpenAI rate limit reached for model "${resumeModel}". Try a different model via OPENAI_RESUME_MODEL or switch API key.`
        )
      }
      throw error
    }
  }
}

export const aiService = new AIService()
