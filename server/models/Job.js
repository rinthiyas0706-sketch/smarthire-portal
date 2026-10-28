import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Remote'],
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        skills: {
            type: [String],
            default: [],
        },
        salary: {
            type: String,
            default: 'Not specified',
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
