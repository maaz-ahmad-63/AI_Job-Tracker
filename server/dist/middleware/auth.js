"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const utils_1 = require("../utils");
const authMiddleware = (req, res, next) => {
    try {
        const token = (0, utils_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = (0, utils_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const token = (0, utils_1.extractTokenFromHeader)(req.headers.authorization);
        if (token) {
            const decoded = (0, utils_1.verifyToken)(token);
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        // Optional auth, so just continue
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
//# sourceMappingURL=auth.js.map