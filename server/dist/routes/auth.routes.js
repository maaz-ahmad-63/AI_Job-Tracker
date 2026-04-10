import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { authSchema } from '../schemas/auth.schema.js';
import { signToken } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const authRouter = Router();
authRouter.post('/register', async (req, res) => {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
    }
    const email = parsed.data.email.toLowerCase();
    const existing = await UserModel.findOne({ email });
    if (existing) {
        res.status(409).json({ message: 'Email already in use' });
        return;
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await UserModel.create({ email, passwordHash });
    const token = signToken({ userId: user._id.toString(), email: user.email });
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
});
authRouter.post('/login', async (req, res) => {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
    }
    const email = parsed.data.email.toLowerCase();
    const user = await UserModel.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = signToken({ userId: user._id.toString(), email: user.email });
    res.json({ token, user: { id: user._id, email: user.email } });
});
authRouter.get('/me', authMiddleware, async (req, res) => {
    const user = await UserModel.findById(req.user?.userId).select('email');
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.json({ id: user._id, email: user.email });
});
export { authRouter };
