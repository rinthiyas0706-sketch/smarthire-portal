import Job from '../models/Job.js';

export const getJobs = async (req, res) => {
    try {
        const { search, type, location } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } },
            ];
        }

        if (type) {
            filter.type = type;
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('postedBy', 'name');

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error('Get jobs error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch jobs',
        });
    }
};

export const createJob = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Only recruiters can post jobs',
            });
        }

        const {
            title,
            company,
            location,
            type,
            description,
            skills,
            salary,
        } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            type,
            description,
            skills,
            salary,
            postedBy: req.user.userId,
        });

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job,
        });
    } catch (error) {
        console.error('Create job error:', error.message);

        return res.status(400).json({
            success: false,
            message: 'Unable to create job. Check the required fields.',
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        return res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        console.error('Get job details error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch job details',
        });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Only recruiters can view their posted jobs',
            });
        }

        const jobs = await Job.find({
            postedBy: req.user.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error('Get my jobs error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch your jobs',
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Only recruiters can edit jobs',
            });
        }

        const job = await Job.findOne({
            _id: req.params.id,
            postedBy: req.user.userId,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or you are not authorized',
            });
        }

        const allowedFields = [
            'title',
            'company',
            'location',
            'type',
            'description',
            'skills',
            'salary',
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        await job.save();

        return res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job,
        });
    } catch (error) {
        console.error('Update job error:', error.message);

        return res.status(400).json({
            success: false,
            message: 'Unable to update job',
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Only recruiters can delete jobs',
            });
        }

        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            postedBy: req.user.userId,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or you are not authorized',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
        });
    } catch (error) {
        console.error('Delete job error:', error.message);

        return res.status(400).json({
            success: false,
            message: 'Unable to delete job',
        });
    }
};
