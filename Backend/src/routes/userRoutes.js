import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadPro.js';
import { validateSchema } from '../middlewares/validate.js';
import { updateProfileSchema } from '../validator/userValidator.js';

const router = express.Router();

// Get my profile
router.get('/me', protect, userController.getMyProfile);
router.put('/me', protect, validateSchema(updateProfileSchema), userController.updateMyProfile);

// Upload / Update avatar
router.post('/avatar', protect, upload.single('avatar'), userController.uploadAvatar);

export default router;