import * as commentService from "../services/commentService.js";
import taskService from "../services/taskService.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const emitCommentEvent = async (req, comment, eventName) => {
  const task = await taskService.getTaskById(comment.task_id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const io = req.app.get("io");
  io.to(`project_${task.project_id}`).emit(eventName, comment);
};

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.taskId,
    req.user.id,
    req.body.content,
  );

  await emitCommentEvent(req, comment, "comment_added");

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getCommentsByTask(req.params.taskId);

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.id,
    req.body.content,
    req.user.id,
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found or you are not authorized");
  }

  await emitCommentEvent(req, comment, "comment_updated");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await commentService.deleteComment(req.params.id, req.user.id);

  if (!comment) {
    throw new ApiError(404, "Comment not found or you are not authorized");
  }

  await emitCommentEvent(req, comment, "comment_deleted");

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export default {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
