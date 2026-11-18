import {query} from '../db/dbConnection.js';
import { ApiError } from '../utils/api-error.js';

const addMember = async (projectId, email, role, addedBy) => {
    // 1. Find user by email
  const userResult = await query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (userResult.rows.length === 0) {
    throw new ApiError(404, 'User not found with this email');
  }
  const userId = userResult.rows[0].id;
  // 2. Check if already a member
  const existing = await query(
    `SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );
  if (existing.rows.length > 0) {
    throw new ApiError(409, 'User is already a member of this project');
  };
  // 3. Add member
  const result = await query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [projectId, userId, role]
  );

  return result.rows[0];
}


const getProjectMembers = async (projectId) => {
  const result = await query(
    `SELECT pm.id, pm.role, pm.joined_at,
            u.id as user_id, u.email,
            p.full_name, p.avatar_url
     FROM project_members pm
     JOIN users u ON pm.user_id = u.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE pm.project_id = $1
     ORDER BY pm.joined_at`,
    [projectId]
  );
  return result.rows;
};
const updateMemberRole = async (projectId, memberId, role) => {
  const result = await query(
    `UPDATE project_members
     SET role = $1
     WHERE id = $2 AND project_id = $3
     RETURNING *`,
    [role, memberId, projectId]
  );
  return result.rows[0];
};
const removeMember = async (projectId, memberId) => {
  const result = await query(
    `DELETE FROM project_members
     WHERE id = $1 AND project_id = $2
     RETURNING *`,
    [memberId, projectId]
  );
  return result.rows[0];
};
// Check if user is member of project
const isProjectMember = async (projectId, userId) => {
  const result = await query(
    `SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );
  return result.rows[0] || null;
};

export default {
    addMember,
    getProjectMembers,
    updateMemberRole,
    removeMember ,
    isProjectMember
}