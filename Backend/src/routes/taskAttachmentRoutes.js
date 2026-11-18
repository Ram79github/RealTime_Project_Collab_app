import express from "express";
import {
  addTaskAttachments,
  getTaskAttachments,
  loadTaskForAttachments,
  removeTaskAttachment,
} from "../controllers/taskAttachmentController.js";
import { uploadTaskAttachments } from "../middlewares/taskAttachmentUpload.js";

const router = express.Router({ mergeParams: true });

router.use(loadTaskForAttachments);
router
  .route("/")
  .get(getTaskAttachments)
  .post(uploadTaskAttachments, addTaskAttachments);
router.delete("/:attachmentId", removeTaskAttachment);

export default router;
