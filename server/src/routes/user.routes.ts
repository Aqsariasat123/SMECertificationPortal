import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getUserProfile,
  updateUserProfile,
  getUserRequests,
  changePassword,
  uploadProfilePicture,
  removeProfilePicture,
} from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Change password - available to all authenticated users
router.post('/change-password', changePassword);

// Profile picture routes - available to all authenticated users
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/profile-picture', removeProfilePicture);

// User role specific routes
router.use(authorize('user'));

// GET /api/user/profile
router.get('/profile', getUserProfile);

// PUT /api/user/profile
router.put('/profile', updateUserProfile);

// GET /api/user/requests - Get user's introduction requests
router.get('/requests', getUserRequests);

export default router;
