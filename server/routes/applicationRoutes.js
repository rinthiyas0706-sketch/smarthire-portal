
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    applyForJob,
    getMyApplications,
    getApplicantsForMyJobs,
    updateApplicationStatus,
} from '../controllers/applicationController.js';

const router = express.Router();

// Student views their applications
router.get('/my-applications', protect, getMyApplications);

// Recruiter views applicants for their jobs
router.get('/recruiter-applicants', protect, getApplicantsForMyJobs);

// Student applies for a job
router.post('/:jobId', protect, applyForJob);

router.patch(
    '/:applicationId/status',
    protect,
    updateApplicationStatus
);

export default router;
