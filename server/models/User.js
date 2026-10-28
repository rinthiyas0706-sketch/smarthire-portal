
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },

        role: {
            type: String,
            enum: ['student', 'recruiter'],
            default: 'student',
        },

        // Student profile details
        phone: {
            type: String,
            default: '',
            trim: true,
        },

        college: {
            type: String,
            default: '',
            trim: true,
        },

        degree: {
            type: String,
            default: '',
            trim: true,
        },

        graduationYear: {
            type: Number,
            default: null,
        },

        skills: {
            type: [String],
            default: [],
        },

        // Existing resume information
        resume: {
            filename: {
                type: String,
                default: '',
            },
            path: {
                type: String,
                default: '',
            },
            uploadedAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
