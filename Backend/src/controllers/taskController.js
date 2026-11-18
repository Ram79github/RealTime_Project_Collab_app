import taskService from "../services/taskService.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// ======================================
// Controller for Task CRUD operations
// ======================================
export const createTask = asyncHandler(async (req, res) => {
  const { task, notification } = await taskService.createTaskWithNotification(
    { ...req.body, created_by: req.user.id },
    req.user.id,
  );
  if (notification) {
    req.app
      .get("io")
      .to(`user_${notification.user_id}`)
      .emit("notification_created", notification);
  }

  //Emit Events
  const io = req.app.get("io");
  io.to(`project_${task.project_id}`).emit("task_created", task);

  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});
// ======================================
//
// ======================================
export const getTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByProject(req.params.projectId);

  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});
// ======================================
//
// ======================================
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
});
// ======================================
//
// ======================================

export const updateTask = asyncHandler(async (req, res) => {
  const { task, notification } = await taskService.updateTaskWithNotification(
    req.params.id,
    req.body,
    req.user.id,
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (notification) {
    req.app
      .get("io")
      .to(`user_${notification.user_id}`)
      .emit("notification_created", notification);
  }
  // Emit Events
  //When a Task is Created / Updated
  const io = req.app.get("io");
  io.to(`project_${task.project_id}`).emit("task_updated", task);

  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});
// ======================================
//
// ======================================
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await taskService.deleteTask(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const io = req.app.get("io");
  io.to(`project_${task.project_id}`).emit("task_deleted", task);

  res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

export default {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};
