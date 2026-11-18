import {query} from '../db/dbConnection.js'
const updateAvatar = async (userId, avatarUrl) => {
  const result = await query(
    `UPDATE user_profiles 
     SET avatar_url = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING user_id, full_name, avatar_url, bio`,
    [avatarUrl, userId]
  );

  return result.rows[0];
};
 const getMyProfile = async (userId) => {
  const result = await query(
    `SELECT u.id, u.email, u.created_at,
            p.full_name, p.avatar_url, p.bio
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0];
};

const updateMyProfile = async (userId, fullName) => {
  const result = await query(
    `UPDATE user_profiles
     SET full_name = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING user_id, full_name, avatar_url, bio`,
    [fullName, userId],
  );

  return result.rows[0];
};

export default {
    updateAvatar,
    getMyProfile,
    updateMyProfile,
}