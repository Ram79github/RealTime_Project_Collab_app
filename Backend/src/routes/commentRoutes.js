import express from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validate.js';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../validator/commentValidate.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// Get all comments of a task + Create comment
router
  .route('/')
  .get(getComments)
  .post(validateSchema(createCommentSchema), createComment);

// Update & Delete comment
router
  .route('/:id')
  .put(validateSchema(updateCommentSchema), updateComment)
  .delete(deleteComment);

export default router;