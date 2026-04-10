import { Router, Request, Response } from 'express';
import { asyncHandler, authMiddleware } from '../middleware';
import { validateRegisterInput, validateLoginInput } from '../schemas';
import { authService } from '../services';
import { AppError } from '../middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { valid, errors } = validateRegisterInput(req.body);

    if (!valid) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const result = await authService.register(req.body);
    res.status(201).json(result);
  })
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { valid, errors } = validateLoginInput(req.body);

    if (!valid) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const result = await authService.login(req.body);
    res.status(200).json(result);
  })
);

/**
 * GET /api/auth/me
 * Get current user info (requires auth)
 */
router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('User not found', 401, 'UNAUTHORIZED');
    }

    res.status(200).json({
      id: req.user.userId,
      email: req.user.email,
    });
  })
);

export default router;
