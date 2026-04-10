import { verifyToken } from '../utils/jwt.js';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        req.user = verifyToken(token);
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
