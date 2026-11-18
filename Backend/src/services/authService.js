import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../db/dbConnection.js";
import { ApiError } from "../utils/api-error.js";

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;
const JWT_EXPIRES_IN = "3d";

const registerUser = async ({ email, password, full_name }) => {
  //check email is already exist or not
  const existing = await query(`SELECT id FROM users WHERE email =$1 `, [
    email,
  ]);

  if (existing.rows.length > 0) {
    throw new ApiError(409, "Email already exists");
  }

  // Hash password before saving into db
  const hashPassword = await bcrypt.hash(password, 10);

  // create user
  const userResult = await query(
    `INSERT INTO users (email,password_hash)
    VALUES ($1,$2)
    RETURNING id,email,created_at`,
    [email, hashPassword],
  );
  // getting user from result
  const user = userResult.rows[0];

  // create user Profile
  await query(
    `INSERT INTO user_profiles  (user_id,full_name)
    VALUES ($1,$2)`,
    [user.id, full_name],
  );

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
// return user data and token as response to the client
  return {
    user: {
      id: user.id,
      email: user.email,
      full_name,
    },
    token,
  };
};

// login user 

const loginUser = async ({email,password}) => {
    const result = await query(`SELECT u.id,u.email,u.password_hash,p.full_name,p.avatar_url 
        FROM users u 
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.email = $1`,
    [email]);

    if(result.rows.length === 0 ){
        throw new ApiError(401, 'Invalid email or password');

    };

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password,user.password_hash);
    if(!isMatch){
        throw new ApiError(401, 'Invalid email or password');

    };
 // assigning new jwt token on every login to make sure user is logged in from one device at a time
    const token = jwt.sign({
        id: user.id,
        email: user.email,
    },
    JWT_SECRET,
    {
        expiresIn:JWT_EXPIRES_IN,
    }
);
// return user data and token as response to the client
return {
    user:{
        id:user.id,
        email:user.email,
        full_name:user.full_name,
        avatar_url:user.avatar_url,
    },
    token,
};
};




export default {
    registerUser,
    loginUser
}