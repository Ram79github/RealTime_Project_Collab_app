import { query } from "../db/dbConnection.js";

export const createNotification = async ({
  userId,
  actorId,
  taskId,
  projectId,
  type,
  message,
}, executeQuery = query) => {
  const result = await executeQuery(
    `INSERT INTO notifications
       (user_id, actor_id, task_id, project_id, type, message, is_read)
     VALUES ($1, $2, $3, $4, $5, $6, FALSE)
     RETURNING *`,
    [userId, actorId, taskId, projectId, type, message],
  );
  return result.rows[0];
};

export const getNotifications = async (userId, limit, offset, pendingOnly) => {
  const result = await query(
    `SELECT id, user_id, actor_id, task_id, project_id, type, message,
            is_read, created_at
     FROM notifications
     WHERE user_id = $1 AND ($4::boolean = FALSE OR is_read = FALSE)
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset, pendingOnly],
  );
  return result.rows;
};

export const getUnreadNotificationCount = async (userId) => {
  const result = await query(
    `SELECT COUNT(*)::integer AS count
     FROM notifications
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId],
  );
  return result.rows[0].count;
};

export const markNotificationRead = async (userId, notificationId) => {
  const result = await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, actor_id, task_id, project_id, type, message,
               is_read, created_at`,
    [notificationId, userId],
  );
  return result.rows[0];
};

export const markAllNotificationsRead = async (userId) => {
  const result = await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId],
  );
  return result.rowCount;
};
