// ──────────────────────────────────────────────────────────────
//  routes/healthRoutes.js
//
//  A "router" groups related routes together.
//  We import the controller function and map it to an HTTP method + path.
//
//  This router handles:
//    GET /api/health   → getHealth controller
// ──────────────────────────────────────────────────────────────

import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

// Create a mini Express router (think of it as a mini-app)
const router = Router();

// Map GET requests at "/" (which becomes "/api/health" in server.js)
// to the getHealth controller function
router.get('/', getHealth);

export default router;
