import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByProject,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validate.js";
import { createTaskSchema, updateTaskSchema } from "../validator/taskValidator.js";
import commentRoutes from "./commentRoutes.js";
import taskAttachmentRoutes from "./taskAttachmentRoutes.js";

const router = express.Router();

router.use(protect);
router.post("/", validateSchema(createTaskSchema), createTask);
router.get("/project/:projectId", getTasksByProject);
router.get("/:id", getTaskById);
router.put("/:id", validateSchema(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);
router.use("/:taskId/comments", commentRoutes);
router.use("/:taskId/attachments", taskAttachmentRoutes);

export default router;
