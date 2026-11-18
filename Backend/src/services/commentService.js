import { query } from '../db/dbConnection.js';

export const createComment = async (taskId, userId, content) => {
  const result = await query(
    `INSERT INTO comments (task_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [taskId, userId, content]
  );
  return result.rows[0];
};
// get all comments for a specific task, including user profile information by joining with the user_profiles table 
export const getCommentsByTask = async (taskId) => {
  const result = await query(
    `SELECT c.*, 
            p.full_name, p.avatar_url
     FROM comments c
     LEFT JOIN user_profiles p ON c.user_id = p.user_id
     WHERE c.task_id = $1
     ORDER BY c.created_at ASC`,
    [taskId]
  );
  return result.rows;
};

export const getCommentById = async (id) => {
  const result = await query(`SELECT * FROM comments WHERE id = $1`, [id]);
  return result.rows[0];
};

export const updateComment = async (id, content, userId) => {
  const result = await query(
    `UPDATE comments 
     SET content = $1
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [content, id, userId]
  );
  return result.rows[0];
};

export const deleteComment = async (id, userId) => {
  const result = await query(
    `DELETE FROM comments 
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
};