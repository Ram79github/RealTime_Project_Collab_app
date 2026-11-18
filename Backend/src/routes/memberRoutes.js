import express from 'express';
import {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
} from '../controllers/memberController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validate.js';
import memberValidation from '../validator/memberValidation.js';

const router = express.Router({ mergeParams: true }); // important

router.use(protect); // all routes below need login

router.post('/', validateSchema(memberValidation.addMemberSchema), addMember);
router.get('/', getMembers);
router.patch(
  '/:memberId',
  validateSchema(memberValidation.updateMemberSchema),
  updateMemberRole,
);
router.delete('/:memberId', removeMember);

export default router;