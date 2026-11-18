import express from 'express';
import authController from '../controllers/authController.js';
import { validateSchema } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validator/AuthValidator.js';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), authController.registerUser);
router.post('/login', validateSchema(loginSchema), authController.loginUser);

export default router;