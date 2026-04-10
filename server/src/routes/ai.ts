import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware'
import { aiService } from '../services'
import { asyncHandler } from '../middleware/error'

const router = Router()

// All AI routes require authentication
router.use(authMiddleware)

// POST /api/ai/parse-jd - Parse job description
router.post('/parse-jd', asyncHandler(async (req: Request, res: Response) => {
  const { jobDescription } = req.body

  if (!jobDescription || typeof jobDescription !== 'string') {
    res.status(400).json({
      message: 'Job description is required and must be a string',
    })
    return
  }

  try {
    const parsed = await aiService.parseJobDescription(jobDescription)
    res.status(200).json(parsed)
  } catch (error) {
    console.error('Error parsing job description:', error)
    res.status(500).json({
      message: 'Failed to parse job description',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}))

// POST /api/ai/resume-bullets - Generate resume bullet points
router.post('/resume-bullets', asyncHandler(async (req: Request, res: Response) => {
  const { position, companyName, responsibilities, skills } = req.body

  if (!position || !companyName) {
    res.status(400).json({
      message: 'Position and company name are required',
    })
    return
  }

  try {
    const bullets = await aiService.generateResumeBullets(
      position,
      companyName,
      responsibilities || [],
      skills || []
    )
    res.status(200).json(bullets)
  } catch (error) {
    console.error('Error generating resume bullets:', error)
    res.status(500).json({
      message: 'Failed to generate resume bullets',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}))

export default router
