import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;

export const protect = (req, res, next) => {
  try {
    if (!JWT_SECRET) {
      throw new Error('SECRET_KEY is not configured');
    }

    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== 'object' || !decoded.id) {
      throw new Error('Token is missing the user ID');
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed or expired',
    });
  }
};