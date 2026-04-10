import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { applicationRouter } from './routes/application.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
export const app = express();
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/ai', aiRouter);
app.use(errorHandler);
