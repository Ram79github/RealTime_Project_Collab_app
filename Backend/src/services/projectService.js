import { query } from '../db/dbConnection.js';

// ======================================
// Bussiness logic to create project
// ======================================
export const createProject = async (name , description,owner_id) => {
    const result = await query(
        `INSERT INTO projects (name,description,owner_id) VALUES ($1,$2,$3) RETURNING *`,
        [name ,description || null,owner_id]
    );
    //Also add the owner as a project member
    await query(
        `INSERT INTO project_members (project_id,user_id,role) VALUES ($1,$2,'owner')`,
        [result.rows[0].id,owner_id]
    );
    return result.rows[0];

}
// ======================================
// to getAllProjects
// ======================================
export const getAllProjects = async (userId) => {
    const result = await query(
        `SELECT p.*
         FROM projects p
         INNER JOIN project_members pm ON pm.project_id = p.id
         WHERE pm.user_id = $1
         ORDER BY p.created_at DESC`,
        [userId],
    );
    // it will return all createdproject row in decscending ordre on the bases of created_at
    return result.rows;
}

export const getProjectById = async (id, userId) => {
    const result = await query(
        `SELECT p.*
         FROM projects p
         INNER JOIN project_members pm ON pm.project_id = p.id
         WHERE p.id = $1 AND pm.user_id = $2`,
        [id, userId],
    );
    return result.rows[0];
};
// ======================================
// updateProject by id and data
// ======================================
export const updateProject = async (id, userId, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    if (fields.length === 0) {
        return getProjectById(id, userId);
    }

    values.push(id, userId);
    const result = await query(
        `UPDATE projects
         SET ${fields.join(", ")}, updated_at = NOW()
         WHERE id = $${index} AND owner_id = $${index + 1}
         RETURNING *`,
        values,
    );
    return result.rows[0];
}
// ======================================
// deleteProject by id
// ======================================
export const deleteProject = async (id, userId) => {
    const result = await query(
        `DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id`,
        [id, userId],
    );
    return result.rowCount > 0;
}
