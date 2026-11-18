import * as projectService from "../services/projectService.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
// =============================================
export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await projectService.createProject(
    name,
    description,
    req.user.id,
  );

  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});
// =============================================
export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});
// =============================================
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});
// =============================================
export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.user.id,
    req.body,
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});
// =============================================
export const deleteProject = asyncHandler(async (req, res) => {
  const deleted = await projectService.deleteProject(req.params.id, req.user.id);

  if (!deleted) {
    throw new ApiError(404, "Project not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export default {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
