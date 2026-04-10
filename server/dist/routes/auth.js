"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const schemas_1 = require("../schemas");
const services_1 = require("../services");
const middleware_2 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { valid, errors } = (0, schemas_1.validateRegisterInput)(req.body);
    if (!valid) {
        throw new middleware_2.AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }
    const result = await services_1.authService.register(req.body);
    res.status(201).json(result);
}));
/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { valid, errors } = (0, schemas_1.validateLoginInput)(req.body);
    if (!valid) {
        throw new middleware_2.AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }
    const result = await services_1.authService.login(req.body);
    res.status(200).json(result);
}));
/**
 * GET /api/auth/me
 * Get current user info (requires auth)
 */
router.get('/me', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new middleware_2.AppError('User not found', 401, 'UNAUTHORIZED');
    }
    res.status(200).json({
        id: req.user.userId,
        email: req.user.email,
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map