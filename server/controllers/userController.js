
import User from '../models/User.js';

// Get the logged-in user's profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                college: user.college || '',
                degree: user.degree || '',
                graduationYear: user.graduationYear ?? '',
                skills: user.skills || [],
                resume: {
                    filename: user.resume?.filename || '',
                    uploadedAt: user.resume?.uploadedAt || null,
                },
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Profile error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch profile',
        });
    }
};

// Update the logged-in user's profile
export const updateMyProfile = async (req, res) => {
    try {
        const { name, phone, college, degree, graduationYear, skills } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Name cannot be empty',
                });
            }
            user.name = name.trim();
        }

        if (phone !== undefined) {
            if (typeof phone !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number',
                });
            }
            user.phone = phone.trim();
        }

        if (college !== undefined) {
            if (typeof college !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid college name',
                });
            }
            user.college = college.trim();
        }

        if (degree !== undefined) {
            if (typeof degree !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid degree',
                });
            }
            user.degree = degree.trim();
        }

        if (graduationYear !== undefined) {
            if (
                graduationYear === '' ||
                graduationYear === null
            ) {
                user.graduationYear = null;
            } else {
                const year = Number(graduationYear);
                if (
                    !Number.isInteger(year) ||
                    year < 2000 ||
                    year > 2100
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Enter a valid graduation year',
                    });
                }
                user.graduationYear = year;
            }
        }

        if (skills !== undefined) {
            if (
                !Array.isArray(skills) ||
                !skills.every(
                    (skill) =>
                        typeof skill === 'string' &&
                        skill.trim().length > 0
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Skills must be a list of non-empty strings',
                });
            }

            user.skills = [
                ...new Set(skills.map((skill) => skill.trim())),
            ];
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                college: user.college,
                degree: user.degree,
                graduationYear: user.graduationYear,
                skills: user.skills,
                resume: {
                    filename: user.resume?.filename || '',
                    uploadedAt: user.resume?.uploadedAt || null,
                },
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Profile update error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to update profile',
        });
    }
};
