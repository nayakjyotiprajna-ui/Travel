import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';

import { connectDB } from './config/db';
import { Destination } from './models/Destination';
import { runSeed } from './seed';
import { configureRoomSockets } from './sockets/roomSocket';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import destinationRoutes from './routes/destinationRoutes';
import journeyRoutes from './routes/journeyRoutes';
import simulationRoutes from './routes/simulationRoutes';
import aiRoutes from './routes/aiRoutes';
import passportRoutes from './routes/passportRoutes';
import memoryRoutes from './routes/memoryRoutes';
import roomRoutes from './routes/roomRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new SocketIOServer(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Configure Real-time travel room sockets
configureRoomSockets(io);

// Security & utilities middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow 3D canvas and dynamic textures
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiter for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again shortly.' },
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'TravelTwin AI Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

// ── Production: Serve built React frontend from server ──────────────────────
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));

  // All non-API routes → return React's index.html (for client-side routing)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });

  console.log(`[Server] Production mode: Serving React frontend from ${clientBuildPath}`);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-seed if destinations collection is empty
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      console.log('[Startup] No destinations found in database. Automatically seeding standard destinations...');
      await runSeed();
    }
  } catch (err: any) {
    console.warn('[Startup] Auto-seed check error:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌍 TravelTwin Backend API Server Live on port ${PORT}`);
    console.log(`📡 WebSocket Gateway initialized for Travel Together`);
    console.log(`🤖 AI Travel Director & Destination Guide Ready`);
    console.log(`====================================================`);
  });
};

startServer();

export { app, server, io };
