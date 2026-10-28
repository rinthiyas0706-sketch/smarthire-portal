
import fs from 'node:fs';
import path from 'node:path';
import User from '../models/User.js';

export const uploadResume = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(403).json({
                success: false,
                message: 'Only students can upload resumes',
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please select a PDF resume',
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                success: false,
                message: 'Student account not found',
            });
        }

        // Remove the previous resume file, if one exists.
        if (user.resume?.path && fs.existsSync(user.resume.path)) {
            fs.unlinkSync(user.resume.path);
        }

        user.resume = {
            filename: req.file.originalname,
            path: req.file.path,
            uploadedAt: new Date(),
        };

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resume: {
                filename: user.resume.filename,
                uploadedAt: user.resume.uploadedAt,
            },
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Resume upload error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to upload resume',
        });
    }
};

export const downloadMyResume = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can access their resumes',
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user?.resume?.path || !fs.existsSync(user.resume.path)) {
            return res.status(404).json({
                success: false,
                message: 'No uploaded resume found',
            });
        }

        return res.download(
            path.resolve(user.resume.path),
            user.resume.filename
        );
    } catch (error) {
        console.error('Resume download error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to download resume',
        });
    }
};
