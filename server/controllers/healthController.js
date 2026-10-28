// ──────────────────────────────────────────────────────────────
//  controllers/healthController.js
//
//  GET /api/health — confirms the server is alive and reports
//  the current database connection status.
// ──────────────────────────────────────────────────────────────

import { dbStatus } from '../config/db.js';

// GET /api/health
const getHealth = (req, res) => {
  res.status(200).json({
    success:     true,
    message:     'SmartHire API is up and running 🚀',
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database:    dbStatus,   // 'connected' | 'disconnected' | 'error' | 'not configured'
  });
};

export { getHealth };
