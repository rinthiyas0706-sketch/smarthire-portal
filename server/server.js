// ──────────────────────────────────────────────────────────────
//  server.js — SmartHire Express application entry point
//
//  What this file does (in order):
//    1. Load environment variables from .env
//    2. Connect to MongoDB
//    3. Create an Express app
//    4. Register middleware (JSON parsing, CORS)
//    5. Register route handlers
//    6. Start listening on the configured port
// ──────────────────────────────────────────────────────────────

// Step 1: Load .env variables FIRST — other imports may need them
import 'dotenv/config';

import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Route files
import healthRoutes from './routes/healthRoutes.js';

// ── Step 2: Connect to MongoDB ─────────────────────────────────
// connectDB() is async — it will log success or exit on failure
dns.setServers(['8.8.8.8', '1.1.1.1']);
connectDB();

// ── Step 3: Create Express app ────────────────────────────────
const app = express();

// ── Step 4: Register middleware ───────────────────────────────

// cors() allows our React dev server (localhost:5173/5174) to
// call this API without browser "blocked by CORS policy" errors.
app.use(
  cors({
    // Allow requests from the Vite dev server on any port
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // needed later for cookie-based auth
  })
);

// express.json() lets Express read JSON bodies sent in POST/PUT requests
// e.g. { "email": "test@test.com", "password": "123456" }
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// ── Step 5: Register routes ───────────────────────────────────

// Health check — GET /api/health
// All API routes are prefixed with /api/ to keep them separate from
// any future static file serving.
app.use('/api/health', healthRoutes);

// 404 handler — catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler — catches errors thrown by controllers
// Express recognises this by the 4-parameter signature (err, req, res, next)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── Step 6: Start the server ──────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SmartHire server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
