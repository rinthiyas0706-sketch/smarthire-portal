import express from 'express';
import {
    getJobs,
    createJob,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// View all jobs
router.get('/', getJobs);

// View jobs posted by the logged-in recruiter
router.get('/my-jobs', protect, getMyJobs);

// View one job
router.get('/:id', getJobById);

// Create a job
router.post('/', protect, createJob);

// Edit a job
router.put('/:id', protect, updateJob);

// Delete a job
router.delete('/:id', protect, deleteJob);

export default router;
