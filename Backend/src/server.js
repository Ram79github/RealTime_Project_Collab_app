import app from './app.js';
import pool from './db/dbConnection.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
dotenv.config();

// ======================
// Database Connection
// ======================


// Test database connection when server starts
pool.connect()
  .then(client => {
    console.log('Successfully connected to Supabase PostgreSQL database 🎉');
    client.release();
  })
  .catch(err => {
    console.error('Database connection failed 🥲:', err.message);
    process.exit(1); // Stop the server if DB is not connected
  });

// Make pool available in routes (optional)
app.locals.db = pool;


// ======================
// Start Server
// ======================
//upgrade current api into socket.io for realtime http connnection
const server = http.createServer(app);

const io= new Server(server,{
  cors:{
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    next();
    return;
  }

  if (!process.env.SECRET_KEY) {
    next(new Error('SECRET_KEY is not configured'));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (typeof decoded !== 'object' || !decoded.id) {
      next(new Error('Socket token is missing the user ID'));
      return;
    }

    socket.data.userId = decoded.id;
    next();
  } catch {
    next(new Error('Not authorized: socket token is invalid or expired'));
  }
});

// Make io available in routes/controllers
app.set('io', io);

// ======================
// Socket.io Logic
// ======================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  if (socket.data.userId) {
    socket.join(`user_${socket.data.userId}`);
  }

  // Join a project room
  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`User joined project room: project_${projectId}`);
  });

  // Leave project room
  socket.on('leave_project', (projectId) => {
    socket.leave(`project_${projectId}`);
    console.log(`User left project room: project_${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});