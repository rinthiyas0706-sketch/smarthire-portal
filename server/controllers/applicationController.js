import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyForJob = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can apply for jobs',
            });
        }

        const { coverLetter = '' } = req.body;
        const jobId = req.params.jobId;

        if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        const application = await Application.create({
            job: jobId,
            student: req.user.userId,
            coverLetter,
        });

        return res.status(201).json({
            success: true,
            message: 'Job application submitted successfully',
            application,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied for this job',
            });
        }

        console.error('Apply for job error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to submit application',
        });
    }
};
export const getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can view their applications',
            });
        }

        const applications = await Application.find({
            student: req.user.userId,
        })
            .populate('job')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error('Get applications error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch applications',
        });
    }
};

export const getApplicantsForMyJobs = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Only recruiters can view applicants',
            });
        }

        const myJobs = await Job.find({
            postedBy: req.user.userId,
        }).select('_id');

        const jobIds = myJobs.map((job) => job._id);

        const applications = await Application.find({
            job: { $in: jobIds },
        })
            .populate('job', 'title company')
            .populate('student', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error('Get applicants error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch applicants',
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Only recruiters can update application status',
            });
        }

        const { status } = req.body;

        const allowedStatuses = [
            'Applied',
            'Under Review',
            'Shortlisted',
            'Rejected',
            'Hired',
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application status',
            });
        }

        const application = await Application.findById(req.params.applicationId)
            .populate('job', 'postedBy');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (
            !application.job ||
            application.job.postedBy.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: 'You can only update applications for your own jobs',
            });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            application,
        });
    } catch (error) {
        console.error('Update application status error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to update application status',
        });
    }
};

