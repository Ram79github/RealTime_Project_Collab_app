import pool, { query } from "../db/dbConnection.js";

export const createTaskAttachments = async (taskId, uploadedBy, files) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const attachments = [];
    for (const file of files) {
      const result = await client.query(
        `INSERT INTO task_attachments
           (task_id, uploaded_by, original_name, file_url, public_id, mime_type, file_size, resource_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          taskId,
          uploadedBy,
          file.originalname,
          file.path,
          file.filename,
          file.mimetype,
          file.size,
          file.mimetype.startsWith("image/") ? "image" : "raw",
        ],
      );
      attachments.push(result.rows[0]);
    }

    await client.query("COMMIT");
    return attachments;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to roll back task attachment transaction:", rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
};

export const getTaskAttachments = async (taskId) => {
  const result = await query(
    `SELECT id, task_id, uploaded_by, original_name, file_url, mime_type,
            file_size, created_at
     FROM task_attachments
     WHERE task_id = $1
     ORDER BY created_at ASC`,
    [taskId],
  );
  return result.rows;
};

export const getTaskAttachment = async (taskId, attachmentId, uploadedBy) => {
  const result = await query(
    `SELECT *
     FROM task_attachments
     WHERE task_id = $1 AND id = $2 AND uploaded_by = $3`,
    [taskId, attachmentId, uploadedBy],
  );
  return result.rows[0];
};

export const deleteTaskAttachment = async (taskId, attachmentId, uploadedBy) => {
  const result = await query(
    `DELETE FROM task_attachments
     WHERE task_id = $1 AND id = $2 AND uploaded_by = $3
     RETURNING id, task_id, uploaded_by, original_name, file_url, mime_type,
               file_size, created_at`,
    [taskId, attachmentId, uploadedBy],
  );
  return result.rows[0];
};
