import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validator/projectValidator.js';
import memberRoutes from './memberRoutes.js';

const router = express.Router();

router.use(protect); // All project routes now require login

router.post('/', validateSchema(createProjectSchema), createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', validateSchema(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

// Nested members route
router.use('/:projectId/members', memberRoutes);

export default router;