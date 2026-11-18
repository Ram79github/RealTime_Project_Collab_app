import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
const app = express();
// ======================
// Middleware
// ======================
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true
}));
app.use(express.json());

// ======================
// Routes
// ======================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
// ======================
// Test Route
// ======================
app.get('/', (_req, res) => {
  res.send('Real-time Project Collaboration API is running');
});

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = error.statuscode || 500;
  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message,
  });
});

export default app;