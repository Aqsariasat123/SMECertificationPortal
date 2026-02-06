import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import smeRoutes from './routes/sme.routes';
import registryRoutes from './routes/registry.routes';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';
import supportRoutes from './routes/support.routes';
import legalRoutes from './routes/legal.routes';
import verifyRoutes from './routes/verify.routes';
import paymentRoutes from './routes/payment.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// ===========================================
// MIDDLEWARE CONFIGURATION
// ===========================================

// Security Headers (relaxed for mobile compatibility)
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for mobile compatibility
  crossOriginEmbedderPolicy: false, // Disabled - causes issues on mobile
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to load cross-origin
}));

// Trust proxy in production (for rate limiting behind reverse proxy)
if (isProduction) {
  app.set('trust proxy', 1);
}

// CORS Configuration - Permissive for mobile Safari compatibility
app.use(cors({
  origin: true, // Allow all origins (mobile Safari has issues with strict CORS)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // Cache preflight for 24 hours
}));

// Rate Limiting (more permissive in development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 500 : 1000, // 500 in prod, 1000 in dev
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProduction, // Skip rate limiting entirely in development
});
app.use(limiter);

// Auth-specific rate limiting (stricter, but skipped in dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 50 : 100, // 50 in prod, 100 in dev
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProduction, // Skip rate limiting entirely in development
});

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files (for uploaded documents)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===========================================
// ROUTES
// ===========================================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Naywa API'
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sme', smeRoutes);
app.use('/api/registry', registryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/verify', verifyRoutes); // Public - no auth required
app.use('/api/payments', paymentRoutes);

// Public Stats Endpoint (no auth required)
app.get('/api/public/stats', async (req, res) => {
  try {
    // Get certified SME count
    const certifiedCount = await prisma.sMEProfile.count({
      where: { certificationStatus: 'certified' }
    });

    // Get total submitted applications (for completion rate)
    const totalSubmitted = await prisma.sMEProfile.count({
      where: {
        certificationStatus: {
          in: ['submitted', 'under_review', 'certified', 'rejected']
        }
      }
    });

    // Get approved count for completion rate
    const approvedCount = await prisma.sMEProfile.count({
      where: { certificationStatus: 'certified' }
    });

    // Calculate completion rate (certified / total submitted * 100)
    const completionRate = totalSubmitted > 0
      ? Math.round((approvedCount / totalSubmitted) * 100)
      : 0;

    // Average review time - get from certificates with their SME profiles
    const recentCertificates = await prisma.certificate.findMany({
      where: {
        status: 'active',
        smeProfile: {
          submittedDate: { not: null }
        }
      },
      include: {
        smeProfile: {
          select: { submittedDate: true }
        }
      },
      take: 50,
      orderBy: { issuedAt: 'desc' }
    });

    let avgReviewHours = 24; // Default
    if (recentCertificates.length > 0) {
      const totalHours = recentCertificates.reduce((sum, cert) => {
        if (cert.smeProfile?.submittedDate && cert.issuedAt) {
          const hours = (cert.issuedAt.getTime() - cert.smeProfile.submittedDate.getTime()) / (1000 * 60 * 60);
          return sum + Math.max(0, hours); // Ensure non-negative
        }
        return sum;
      }, 0);
      avgReviewHours = Math.round(totalHours / recentCertificates.length) || 24;
    }

    res.json({
      success: true,
      data: {
        certifiedCount,
        completionRate,
        avgReviewHours
      }
    });
  } catch (error) {
    console.error('Failed to fetch public stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// ===========================================
// SERVER START
// ===========================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║       Naywa - Backend API                              ║
╠════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}              ║
║  Environment: ${process.env.NODE_ENV || 'development'}                          ║
║  Health check: http://localhost:${PORT}/health            ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;
