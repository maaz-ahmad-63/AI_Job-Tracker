import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware';
import { applicationService } from '../services';
import { asyncHandler } from '../middleware/error';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/applications - Get all applications for the user
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const applications = await applicationService.getApplications(userId);
  res.status(200).json(applications);
}));

// GET /api/applications/:id - Get a specific application
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const application = await applicationService.getApplicationById(userId, id);
  res.status(200).json(application);
}));

// POST /api/applications - Create a new application
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { companyName, position, status, appliedDate, jdLink, notes, salaryRange } = req.body;
  
  // Validation
  if (!companyName || !position) {
    res.status(400).json({
      message: 'Company name and position are required',
    });
    return;
  }
  
  const application = await applicationService.createApplication(userId, {
    companyName,
    position,
    status: status || 'applied',
    appliedDate: appliedDate || new Date().toISOString().split('T')[0],
    jdLink,
    notes,
    salaryRange,
  });
  
  res.status(201).json(application);
}));

// PUT /api/applications/:id - Update an application
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const { companyName, position, status, appliedDate, jdLink, notes, salaryRange } = req.body;
  
  const application = await applicationService.updateApplication(userId, id, {
    companyName,
    position,
    status,
    appliedDate,
    jdLink,
    notes,
    salaryRange,
  });
  
  res.status(200).json(application);
}));

// DELETE /api/applications/:id - Delete an application
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  
  await applicationService.deleteApplication(userId, id);
  
  res.status(200).json({ message: 'Application deleted successfully' });
}));

export default router;
