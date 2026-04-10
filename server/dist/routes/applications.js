"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const services_1 = require("../services");
const error_1 = require("../middleware/error");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(middleware_1.authMiddleware);
// GET /api/applications - Get all applications for the user
router.get('/', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const applications = await services_1.applicationService.getApplications(userId);
    res.status(200).json(applications);
}));
// GET /api/applications/:id - Get a specific application
router.get('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const application = await services_1.applicationService.getApplicationById(userId, id);
    res.status(200).json(application);
}));
// POST /api/applications - Create a new application
router.post('/', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const { companyName, position, status, appliedDate, jdLink, notes, salaryRange } = req.body;
    // Validation
    if (!companyName || !position) {
        res.status(400).json({
            message: 'Company name and position are required',
        });
        return;
    }
    const application = await services_1.applicationService.createApplication(userId, {
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
router.put('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const { companyName, position, status, appliedDate, jdLink, notes, salaryRange } = req.body;
    const application = await services_1.applicationService.updateApplication(userId, id, {
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
router.delete('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    await services_1.applicationService.deleteApplication(userId, id);
    res.status(200).json({ message: 'Application deleted successfully' });
}));
exports.default = router;
//# sourceMappingURL=applications.js.map