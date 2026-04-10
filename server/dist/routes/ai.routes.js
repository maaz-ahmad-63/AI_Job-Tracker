import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { parseJobDescriptionInputSchema } from '../schemas/ai.schema.js';
import { parseJobDescriptionWithAI } from '../services/ai.service.js';
const aiRouter = Router();
aiRouter.use(authMiddleware);
aiRouter.post('/parse-jd', async (req, res) => {
    const parsed = parseJobDescriptionInputSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Job description is too short' });
        return;
    }
    try {
        const data = await parseJobDescriptionWithAI(parsed.data.jobDescription);
        res.json(data);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'AI parsing failed';
        res.status(502).json({ message });
    }
});
export { aiRouter };
