import memberService from "../services/memberService.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const addMember = asyncHandler(async (req, res) => {
  const member = await memberService.addMember(
    req.params.projectId,
    req.body.email,
    req.body.role,
    req.user.id,
  );

  const io = req.app.get("io");
  io.to(`project_${req.params.projectId}`).emit("member_added", member);

  res
    .status(201)
    .json(new ApiResponse(201, member, "Member added successfully"));
});

export const getMembers = asyncHandler(async (req, res) => {
  const members = await memberService.getProjectMembers(req.params.projectId);

  res
    .status(200)
    .json(new ApiResponse(200, members, "Members fetched successfully"));
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const member = await memberService.updateMemberRole(
    req.params.projectId,
    req.params.memberId,
    req.body.role,
  );

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  const io = req.app.get("io");
  io.to(`project_${req.params.projectId}`).emit("member_updated", member);

  res
    .status(200)
    .json(new ApiResponse(200, member, "Member role updated successfully"));
});

export const removeMember = asyncHandler(async (req, res) => {
  const member = await memberService.removeMember(
    req.params.projectId,
    req.params.memberId,
  );

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  const io = req.app.get("io");
  io.to(`project_${req.params.projectId}`).emit("member_removed", member);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed successfully"));
});

export default {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
};
