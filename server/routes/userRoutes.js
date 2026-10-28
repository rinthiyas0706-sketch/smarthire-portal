
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/resumeUpload.js';

import {
    getMyProfile,
    updateMyProfile,
} from '../controllers/userController.js';

import {
    uploadResume,
    downloadMyResume,
} from '../controllers/resumeController.js';

const router = express.Router();

// Get the logged-in user's profile
router.get('/me', protect, getMyProfile);

// Update the logged-in user's profile
router.put('/me', protect, updateMyProfile);

// Upload a student's PDF resume
router.post(
    '/resume',
    protect,
    upload.single('resume'),
    uploadResume
);

// Download the logged-in student's resume
router.get('/resume/download', protect, downloadMyResume);

export default router;
