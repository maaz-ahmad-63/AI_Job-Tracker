import { Router } from 'express';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

export default router;
