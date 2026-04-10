import 'dotenv/config';
import express, { Express } from 'express';
import { connectDatabase } from './config';
import { corsMiddleware, errorHandler } from './middleware';
import { authRoutes, healthRoutes, applicationRoutes, aiRoutes } from './routes';

const app: Express = express();
const PORT = Number(process.env.PORT) || 5002;
const HOST = process.env.HOST || '127.0.0.1';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Job Application Tracker API is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, HOST, () => {
      console.log(`\n🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📍 API base: http://${HOST}:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
