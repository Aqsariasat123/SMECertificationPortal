import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getDashboardStats,
  getUsers,
  getApplications,
  getApplicationDetail,
  reviewApplication,
  getAuditLogs,
  updateVisibility,
  getIntroductionRequests,
  exportAuditLogs,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users management
router.get('/users', getUsers);

// Applications/Certifications management
router.get('/applications', getApplications);
router.get('/applications/:id', getApplicationDetail);
router.post('/applications/:id/review', reviewApplication);

// Registry visibility management
router.put('/registry/:profileId/visibility', updateVisibility);

// Introduction requests management
router.get('/introduction-requests', getIntroductionRequests);

// Audit logs
router.get('/audit-logs', getAuditLogs);
router.get('/audit-logs/export', exportAuditLogs);

export default router;
