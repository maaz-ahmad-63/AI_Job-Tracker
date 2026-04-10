"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const services_1 = require("../services");
const error_1 = require("../middleware/error");
const router = (0, express_1.Router)();
// All AI routes require authentication
router.use(middleware_1.authMiddleware);
// POST /api/ai/parse-jd - Parse job description
router.post('/parse-jd', (0, error_1.asyncHandler)(async (req, res) => {
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string') {
        res.status(400).json({
            message: 'Job description is required and must be a string',
        });
        return;
    }
    try {
        const parsed = await services_1.aiService.parseJobDescription(jobDescription);
        res.status(200).json(parsed);
    }
    catch (error) {
        console.error('Error parsing job description:', error);
        res.status(500).json({
            message: 'Failed to parse job description',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
// POST /api/ai/resume-bullets - Generate resume bullet points
router.post('/resume-bullets', (0, error_1.asyncHandler)(async (req, res) => {
    const { position, companyName, responsibilities, skills } = req.body;
    if (!position || !companyName) {
        res.status(400).json({
            message: 'Position and company name are required',
        });
        return;
    }
    try {
        const bullets = await services_1.aiService.generateResumeBullets(position, companyName, responsibilities || [], skills || []);
        res.status(200).json(bullets);
    }
    catch (error) {
        console.error('Error generating resume bullets:', error);
        res.status(500).json({
            message: 'Failed to generate resume bullets',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
exports.default = router;
//# sourceMappingURL=ai.js.map