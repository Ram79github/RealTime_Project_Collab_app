// ====================
//Database connection (Pool)
// ====================
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
// ======================
// query function to execute SQL queries
// ======================
export const query = (text, params) => pool.query(text, params);
export default pool;