import userService from '../services/userService.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image');
  }

  const updatedProfile = await userService.updateAvatar(
    req.user.id,
    req.file.path,
  );

  if (!updatedProfile) {
    throw new ApiError(404, 'Profile not found');
  }

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully',
    data: updatedProfile,
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getMyProfile(req.user.id);

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, profile, 'Profile fetched successfully'));
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateMyProfile(
    req.user.id,
    req.body.full_name.trim(),
  );

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, profile, 'Profile updated successfully'));
});

export default {
  uploadAvatar,
  getMyProfile,
  updateMyProfile,
};
