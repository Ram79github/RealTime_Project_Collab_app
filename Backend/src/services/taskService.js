import pool, { query } from '../db/dbConnection.js';
import { createNotification } from './notificationService.js';
// ======================================
// Bussiness logic to create Task
// ======================================

const insertTask = async (data, executeQuery = query) => {
    // taking the data from the request body and destructuring it to get the required fields
    const {
        project_id,
        title,
        description,
        status = 'todo',
        priority = 'medium',
        assignee_id = null,
        created_by,
        due_date=null,
        position=0,
    }=data; 
    // inserting the data into the database and returning the newly created task
    const result = await executeQuery(
        `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, created_by, due_date, position)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
     [project_id,
      title,
      description || null,
      status,
      priority,
      assignee_id,
      created_by,
      due_date,
      position,]
    )
    // returning the newly created task
    return result.rows[0];
}

const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback((text, params) => client.query(text, params));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back task transaction:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
};

const shouldNotifyAssignee = (assigneeId, actorId) =>
  assigneeId && String(assigneeId) !== String(actorId);

const createTask = async (data) => insertTask(data);

const createTaskWithNotification = async (data, actorId) =>
  withTransaction(async (executeQuery) => {
    const task = await insertTask(data, executeQuery);
    let notification = null;

    if (shouldNotifyAssignee(task.assignee_id, actorId)) {
      notification = await createNotification(
        {
          userId: task.assignee_id,
          actorId,
          taskId: task.id,
          projectId: task.project_id,
          type: 'task_assigned',
          message: `You were assigned to task "${task.title}"`,
        },
        executeQuery,
      );
    }

    return { task, notification };
  });
// ====================================================
// get All task by projectid 
// ====================================================
const getTasksByProject = async (projectId) => {
  const result = await query(
    `SELECT t.*, 
            u.full_name as assignee_name
     FROM tasks t
     LEFT JOIN user_profiles u ON t.assignee_id = u.user_id
     WHERE t.project_id = $1
     ORDER BY t.position ASC, t.created_at DESC`,
    [projectId]
  );
  return result.rows;
};

// ====================================================
// get single/particular task by id
// ====================================================
 const getTaskById = async (id) => {
  const result = await query(
    `SELECT t.*, 
            u.full_name as assignee_name
     FROM tasks t
     LEFT JOIN user_profiles u ON t.assignee_id = u.user_id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0];
};
// ====================================================
// take id,prev data as it is and update ,and store as newly one with existing id update only fields,values data
// ====================================================
const updateTaskRecord = async (id, data, executeQuery = query) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) return null;

  values.push(id);

  const result = await executeQuery(
    `UPDATE tasks 
     SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${index}
     RETURNING *`,
    values
  );
  return result.rows[0];
};

const updateTask = async (id, data) => updateTaskRecord(id, data);

const updateTaskWithNotification = async (id, data, actorId) =>
  withTransaction(async (executeQuery) => {
    const existingResult = await executeQuery(
      'SELECT * FROM tasks WHERE id = $1 FOR UPDATE',
      [id],
    );
    const existingTask = existingResult.rows[0];
    if (!existingTask) {
      return { task: null, notification: null };
    }

    const task = await updateTaskRecord(id, data, executeQuery);
    let notification = null;
    if (
      task &&
      String(existingTask.assignee_id || '') !== String(task.assignee_id || '') &&
      shouldNotifyAssignee(task.assignee_id, actorId)
    ) {
      notification = await createNotification(
        {
          userId: task.assignee_id,
          actorId,
          taskId: task.id,
          projectId: task.project_id,
          type: 'task_assigned',
          message: `You were assigned to task "${task.title}"`,
        },
        executeQuery,
      );
    }

    return { task, notification };
  });
// ====================================================
// delete task by id  fetch from params 
// ====================================================
const deleteTask = async (id) => {
  const result = await query(
    `DELETE FROM tasks 
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// ====================================================
export default {
    createTask,
    createTaskWithNotification,
    getTasksByProject,
    getTaskById,
    updateTask,
    updateTaskWithNotification,
    deleteTask
}