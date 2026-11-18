import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import * as notificationService from "../services/notificationService.js";

const getPagination = (query) => {
  const limit = query.limit === undefined ? 20 : Number(query.limit);
  const offset = query.offset === undefined ? 0 : Number(query.offset);

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    throw new ApiError(400, "Limit must be 1-100 and offset must be non-negative");
  }

  return { limit, offset };
};

const listNotifications = (pendingOnly) =>
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query);
    const notifications = await notificationService.getNotifications(
      req.user.id,
      limit,
      offset,
      pendingOnly,
    );

    res
      .status(200)
      .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
  });

export const getNotifications = listNotifications(false);
export const getPendingNotifications = listNotifications(true);

export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadNotificationCount(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, { count }, "Unread notification count fetched"));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationRead(
    req.user.id,
    req.params.id,
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  req.app
    .get("io")
    .to(`user_${req.user.id}`)
    .emit("notification_read", notification);

  res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const updatedCount = await notificationService.markAllNotificationsRead(req.user.id);

  req.app
    .get("io")
    .to(`user_${req.user.id}`)
    .emit("notifications_read_all", { updatedCount });

  res
    .status(200)
    .json(new ApiResponse(200, { updatedCount }, "Notifications marked as read"));
});

export default {
  getNotifications,
  getPendingNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
};
