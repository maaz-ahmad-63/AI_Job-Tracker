"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});
exports.default = router;
//# sourceMappingURL=health.js.map