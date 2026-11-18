import authService from '../services/authService.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    throw new ApiError(400, 'Email, password, and full name are required');
  }

  const data = await authService.registerUser({ email, password, full_name });

  res
    .status(201)
    .json(new ApiResponse(201, data, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const data = await authService.loginUser({ email, password });

  res
    .status(200)
    .json(new ApiResponse(200, data, 'Login successful'));
});

export default {
  registerUser,
  loginUser,
};