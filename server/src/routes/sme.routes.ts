import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getSMEProfile,
  updateSMEProfile,
  submitCertification,
  getCertificationStatus,
  uploadDocument,
  deleteDocument,
  getDocuments,
  uploadCompanyLogo,
  deleteCompanyLogo,
  getIntroductionRequests,
  respondToIntroductionRequest,
  downloadCertificate,
} from '../controllers/sme.controller';

const router = Router();

// All SME routes require authentication
router.use(authenticate);
router.use(authorize('sme'));

// Profile endpoints
router.get('/profile', getSMEProfile);
router.put('/profile', updateSMEProfile);

// Certification endpoints
router.post('/submit-certification', submitCertification);
router.get('/certification-status', getCertificationStatus);
router.get('/certificate', downloadCertificate);

// Document endpoints
router.get('/documents', getDocuments);
router.post('/upload-document', upload.single('document'), uploadDocument);
router.delete('/document/:documentId', deleteDocument);

// Company logo endpoints
router.post('/upload-logo', upload.single('logo'), uploadCompanyLogo);
router.delete('/logo', deleteCompanyLogo);

// Introduction requests endpoints
router.get('/introduction-requests', getIntroductionRequests);
router.post('/introduction-requests/:requestId/respond', respondToIntroductionRequest);

export default router;
