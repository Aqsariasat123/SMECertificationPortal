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
  exportApplications,
  getKycApplications,
  getKycApplicationDetail,
  reviewKycApplication,
  getAnalytics,
  revokeCertificate,
  reissueCertificate,
  updateInternalReview,
  getInternalReview,
  getApplicationDocuments,
  viewDocument,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Analytics (server-side computed)
router.get('/analytics', getAnalytics);

// Users management
router.get('/users', getUsers);

// Applications/Certifications management
router.get('/applications', getApplications);
router.get('/applications/export', exportApplications);
router.get('/applications/:id', getApplicationDetail);
router.post('/applications/:id/review', reviewApplication);
router.get('/applications/:id/internal-review', getInternalReview);
router.put('/applications/:id/internal-review', updateInternalReview);
router.get('/applications/:id/documents', getApplicationDocuments);
router.get('/applications/:id/documents/:documentId/view', viewDocument);

// Registry visibility management
router.put('/registry/:profileId/visibility', updateVisibility);

// Introduction requests management
router.get('/introduction-requests', getIntroductionRequests);

// Audit logs
router.get('/audit-logs', getAuditLogs);
router.get('/audit-logs/export', exportAuditLogs);

// Investor KYC management
router.get('/kyc-applications', getKycApplications);
router.get('/kyc-applications/:id', getKycApplicationDetail);
router.post('/kyc-applications/:id/review', reviewKycApplication);

// Certificate management
router.post('/certificates/:certificateId/revoke', revokeCertificate);
router.post('/certificates/:certificateId/reissue', reissueCertificate);

export default router;
