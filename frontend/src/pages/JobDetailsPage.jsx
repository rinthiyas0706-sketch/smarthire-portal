
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function fetchJob() {
            setLoading(true);
            setMessage('');
            setMessageType('');

            try {
                const response = await fetch(
                    `http://localhost:5000/api/jobs/${id}`
                );

                const data = await response.json();

                if (!response.ok || data.success === false) {
                    throw new Error(data.message || 'Job not found.');
                }

                const fetchedJob = data.job || data.data?.job || data.data;

                if (!fetchedJob || !fetchedJob._id) {
                    throw new Error('Job details could not be loaded.');
                }

                if (!cancelled) {
                    setJob(fetchedJob);
                }
            } catch (error) {
                if (!cancelled) {
                    setJob(null);
                    setMessage(error.message || 'Unable to load job details.');
                    setMessageType('error');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchJob();

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleApply() {
        setMessage('');
        setMessageType('');

        const token = localStorage.getItem('token');

        let user = null;

        try {
            user = JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            user = null;
        }

        if (!token) {
            sessionStorage.setItem('smarthireReturnTo', `/jobs/${id}`);

            navigate('/login', {
                state: { from: `/jobs/${id}` }
            });
            return;
        }

        if (user.role !== 'student') {
            setMessage(
                'Only student accounts can apply for jobs. Please sign in with a student account.'
            );
            setMessageType('error');
            return;
        }

        if (!job?._id) {
            setMessage('Job details are not available. Please try again.');
            setMessageType('error');
            return;
        }

        try {
            setApplying(true);

            const response = await fetch(
                `http://localhost:5000/api/applications/${job._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ coverLetter: '' }),
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                navigate('/login', {
                    state: {
                        from: `/jobs/${id}`,
                    },
                });
                return;
            }

            if (!response.ok || data.success === false) {
                throw new Error(
                    data.message || 'Unable to submit your application.'
                );
            }

            setMessage(
                data.message || 'Application submitted successfully!'
            );
            setMessageType('success');
        } catch (error) {
            setMessage(
                error.message || 'Unable to submit your application.'
            );
            setMessageType('error');
        } finally {
            setApplying(false);
        }
    }

    if (loading) {
        return (
            <main style={{ padding: 60, textAlign: 'center' }}>
                Loading job details...
            </main>
        );
    }

    if (!job) {
        return (
            <main style={{ padding: 60, textAlign: 'center' }}>
                <h1>Job Not Found</h1>
                <p>{message || 'This job may no longer be available.'}</p>
                <button onClick={() => navigate('/jobs')}>
                    Back to Jobs
                </button>
            </main>
        );
    }

    const isInternship =
        job.type?.toLowerCase() === 'internship';

    const skills = Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === 'string'
            ? job.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
            : [];

    const companyName =
        job.company ||
        job.companyName ||
        job.postedBy?.companyName ||
        job.postedBy?.name ||
        'Company';

    return (
        <main
            style={{
                minHeight: '80vh',
                background: '#f8fafc',
                padding: '48px 6%',
                fontFamily: "'Inter', sans-serif",
                color: '#0f2137',
            }}
        >
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/jobs')}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#4338ca',
                        cursor: 'pointer',
                        marginBottom: 24,
                        fontSize: 15,
                    }}
                >
                    ← Back to Jobs
                </button>

                <section
                    style={{
                        background: '#ffffff',
                        padding: 32,
                        borderRadius: 18,
                        border: '1px solid #e2e8f0',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            background: isInternship ? '#ede9fe' : '#dbeafe',
                            color: isInternship ? '#6d28d9' : '#1d4ed8',
                            padding: '7px 12px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        {job.type || 'Job'}
                    </span>

                    <h1
                        style={{
                            fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
                            margin: '22px 0 8px',
                        }}
                    >
                        {job.title}
                    </h1>

                    <h2
                        style={{
                            fontSize: '1.15rem',
                            color: '#64748b',
                            fontWeight: 500,
                        }}
                    >
                        {companyName}
                    </h2>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 20,
                            margin: '24px 0',
                            color: '#475569',
                        }}
                    >
                        <span>📍 {job.location || 'Location not specified'}</span>
                        <span>💰 {job.salary || 'Salary not specified'}</span>
                        <span>🕒 {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : 'Recently posted'}
                        </span>
                    </div>

                    <hr
                        style={{
                            border: 0,
                            borderTop: '1px solid #e2e8f0',
                        }}
                    />

                    <h3 style={{ marginTop: 28, fontSize: 20 }}>
                        Job Description
                    </h3>

                    <p
                        style={{
                            color: '#475569',
                            lineHeight: 1.8,
                            marginTop: 12,
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {job.description || 'No description provided.'}
                    </p>

                    <h3 style={{ marginTop: 28, fontSize: 20 }}>
                        Required Skills
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 10,
                            marginTop: 14,
                        }}
                    >
                        {skills.length > 0 ? (
                            skills.map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    style={{
                                        background: '#f5f3ff',
                                        color: '#6d28d9',
                                        padding: '8px 12px',
                                        borderRadius: 8,
                                        fontSize: 14,
                                    }}
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p style={{ color: '#64748b' }}>
                                No specific skills listed.
                            </p>
                        )}
                    </div>

                    {message && (
                        <p
                            role="status"
                            style={{
                                marginTop: 24,
                                padding: 12,
                                borderRadius: 8,
                                background:
                                    messageType === 'success' ? '#dcfce7' : '#fee2e2',
                                color:
                                    messageType === 'success' ? '#166534' : '#991b1b',
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        onClick={handleApply}
                        disabled={applying || messageType === 'success'}
                        style={{
                            width: '100%',
                            marginTop: 32,
                            padding: 15,
                            background:
                                applying || messageType === 'success'
                                    ? '#818cf8'
                                    : '#4338ca',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: 16,
                            cursor:
                                applying || messageType === 'success'
                                    ? 'not-allowed'
                                    : 'pointer',
                        }}
                    >
                        {applying
                            ? 'Submitting...'
                            : messageType === 'success'
                                ? 'Application Submitted'
                                : 'Apply Now'}
                    </button>

                    <p
                        style={{
                            color: '#94a3b8',
                            fontSize: 12,
                            marginTop: 12,
                            textAlign: 'center',
                        }}
                    >
                        Sign in with a student account to apply.
                    </p>

                    {messageType === 'success' && (
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            style={{
                                width: '100%',
                                marginTop: 12,
                                padding: 12,
                                border: '1px solid #4338ca',
                                borderRadius: 10,
                                background: '#ffffff',
                                color: '#4338ca',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            View My Applications
                        </button>
                    )}
                </section>
            </div>
        </main>
    );
}
