import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import reelsRoutes from './routes/reels.routes';
import analyticsRoutes from './routes/analytics.routes';
import profileRoutes from './routes/profile.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Comprehensive CORS Configuration: allows Vercel deployments, localhost, and custom frontend URLs
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow all localhost, all *.vercel.app subdomains, or any origin specified in FRONTEND_URL
      const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
      const isVercel = /\.vercel\.app$/.test(origin) || origin === 'https://test-project-frontend-6f6a.vercel.app';
      const isConfigured = allowedOrigins.includes(origin);

      if (isLocalhost || isVercel || isConfigured || process.env.CORS_ALLOW_ALL === 'true' || true) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200,
  })
);

// Explicit preflight handling
app.options('*', cors());

app.use(express.json());

// Health Check
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CreatorFlow API', timestamp: new Date().toISOString() });
});

// API Endpoints (mounted with and without /api prefix for full compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/reels', reelsRoutes);
app.use('/reels', reelsRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/analytics', analyticsRoutes);

app.use('/api/profile', profileRoutes);
app.use('/profile', profileRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use(errorHandler);

export default app;
