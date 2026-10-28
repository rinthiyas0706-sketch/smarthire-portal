
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostJobPage.css';

const API_URL = 'http://localhost:5000/api/jobs';

const initialForm = {
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    skills: '',
};

export default function PostJobPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (
            !form.title.trim() ||
            !form.company.trim() ||
            !form.location.trim() ||
            !form.description.trim()
        ) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    title: form.title.trim(),
                    company: form.company.trim(),
                    location: form.location.trim(),
                    description: form.description.trim(),
                    salary: form.salary.trim(),
                    skills: form.skills
                        .split(',')
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Unable to post this job.');
            }

            setSuccess('Job posted successfully!');
            setForm(initialForm);
        } catch (err) {
            setError(
                err.message === 'Failed to fetch'
                    ? 'Cannot connect to the server. Please check whether the backend is running.'
                    : err.message || 'Something went wrong.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="post-job-page">
            <div className="post-job-container">
                <header className="post-job-header">
                    <span className="post-job-eyebrow">
                        <span className="post-job-eyebrow-dot" />
                        RECRUITER PORTAL
                    </span>

                    <h1>Post a New Job</h1>

                    <p>
                        Find the right talent for your team with SmartHire.
                        Share the opportunity and connect with great candidates.
                    </p>
                </header>

                <form className="post-job-form" onSubmit={handleSubmit}>
                    <div className="post-job-form-heading">
                        <div>
                            <h2>Job Information</h2>
                            <p>Enter the details of your job opening below.</p>
                        </div>
                        <span className="post-job-required">* Required fields</span>
                    </div>

                    <div className="post-job-grid">
                        <div className="post-job-field">
                            <label htmlFor="title">Job Title <span>*</span></label>
                            <input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Developer"
                                required
                            />
                        </div>

                        <div className="post-job-field">
                            <label htmlFor="company">Company Name <span>*</span></label>
                            <input
                                id="company"
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                placeholder="e.g. Tech Solutions"
                                required
                            />
                        </div>

                        <div className="post-job-field">
                            <label htmlFor="location">Location <span>*</span></label>
                            <input
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Chennai / Remote"
                                required
                            />
                        </div>

                        <div className="post-job-field">
                            <label htmlFor="type">Job Type <span>*</span></label>
                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        <div className="post-job-field">
                            <label htmlFor="salary">Salary / Stipend</label>
                            <input
                                id="salary"
                                name="salary"
                                value={form.salary}
                                onChange={handleChange}
                                placeholder="e.g. ₹20,000/month or Negotiable"
                            />
                        </div>

                        <div className="post-job-field">
                            <label htmlFor="skills">Required Skills</label>
                            <input
                                id="skills"
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, HTML, CSS"
                            />
                            <small>Separate skills with commas.</small>
                        </div>

                        <div className="post-job-field post-job-full-width">
                            <label htmlFor="description">
                                Job Description <span>*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the role, responsibilities, qualifications and what your team is looking for..."
                                rows={6}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="post-job-error" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="post-job-success" role="status">
                            <div>
                                <strong>{success}</strong>
                                <p>Your opportunity has been published.</p>
                            </div>
                            <button
                                type="button"
                                className="post-job-view-button"
                                onClick={() => navigate('/jobs')}
                            >
                                View Jobs →
                            </button>
                        </div>
                    )}

                    <div className="post-job-actions">
                        <button
                            type="button"
                            className="post-job-cancel"
                            onClick={() => navigate('/recruiter-dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            className="post-job-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Publishing...' : 'Publish Job →'}
                        </button>
                    </div>
                </form>

                <p className="post-job-footer">
                    <span>✦</span> Powered by SmartHire — Connecting talent with opportunity
                </p>
            </div>
        </main>
    );
}
