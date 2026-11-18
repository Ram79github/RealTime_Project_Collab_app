import cloudinary from "../utils/claudinaryService.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import taskService from "../services/taskService.js";
import * as taskAttachmentService from "../services/taskAttachmentService.js";
import {
  getTaskAttachmentResourceType,
} from "../middlewares/taskAttachmentUpload.js";

export const loadTaskForAttachments = asyncHandler(async (req, _res, next) => {
  const task = await taskService.getTaskById(req.params.taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  req.task = task;
  next();
});

export const addTaskAttachments = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    throw new ApiError(400, "Please upload at least one attachment");
  }

  let attachments;
  try {
    attachments = await taskAttachmentService.createTaskAttachments(
      req.task.id,
      req.user.id,
      req.files,
    );
  } catch (error) {
    const cleanupResults = await Promise.allSettled(
      req.files.map((file) =>
        cloudinary.uploader.destroy(file.filename, {
          resource_type: getTaskAttachmentResourceType(file.mimetype),
          invalidate: true,
        }),
      ),
    );
    cleanupResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Failed to clean up uploaded task attachment:", result.reason);
      }
    });
    throw error;
  }

  const io = req.app.get("io");
  attachments.forEach((attachment) => {
    io.to(`project_${req.task.project_id}`).emit("attachment_added", attachment);
  });

  res
    .status(201)
    .json(new ApiResponse(201, attachments, "Task attachments uploaded successfully"));
});

export const getTaskAttachments = asyncHandler(async (req, res) => {
  const attachments = await taskAttachmentService.getTaskAttachments(req.task.id);

  res
    .status(200)
    .json(new ApiResponse(200, attachments, "Task attachments fetched successfully"));
});

export const removeTaskAttachment = asyncHandler(async (req, res) => {
  const attachment = await taskAttachmentService.getTaskAttachment(
    req.task.id,
    req.params.attachmentId,
    req.user.id,
  );

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  const cloudinaryResult = await cloudinary.uploader.destroy(attachment.public_id, {
    resource_type: attachment.resource_type,
    invalidate: true,
  });
  if (!["ok", "not found"].includes(cloudinaryResult.result)) {
    throw new ApiError(502, "Failed to delete attachment from storage");
  }

  const deletedAttachment = await taskAttachmentService.deleteTaskAttachment(
    req.task.id,
    req.params.attachmentId,
    req.user.id,
  );

  if (!deletedAttachment) {
    throw new ApiError(404, "Attachment not found");
  }

  const io = req.app.get("io");
  io.to(`project_${req.task.project_id}`).emit("attachment_deleted", deletedAttachment);

  res
    .status(200)
    .json(new ApiResponse(200, deletedAttachment, "Task attachment deleted successfully"));
});

export default {
  loadTaskForAttachments,
  addTaskAttachments,
  getTaskAttachments,
  removeTaskAttachment,
};
