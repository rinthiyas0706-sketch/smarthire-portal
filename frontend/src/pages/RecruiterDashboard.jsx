
import { useEffect, useState } from 'react';

export default function RecruiterDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    const statuses = [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Rejected',
        'Hired',
    ];

    const fetchApplicants = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please log in as a recruiter.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:5000/api/applications/recruiter-applicants',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load applicants.');
            }

            setApplications(data.applications || []);
            setError('');
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const updateStatus = async (applicationId, status) => {
        const token = localStorage.getItem('token');
        setUpdatingId(applicationId);
        setError('');

        try {
            const response = await fetch(
                `http://localhost:5000/api/applications/${applicationId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to update status.');
            }

            setApplications((previous) =>
                previous.map((app) =>
                    app._id === applicationId ? { ...app, status } : app
                )
            );
        } catch (err) {
            setError(err.message || 'Unable to update status.');
        } finally {
            setUpdatingId('');
        }
    };

    return (
        <main className="student-dashboard">
            <div className="dashboard-heading">
                <p className="dashboard-eyebrow">RECRUITER PORTAL</p>
                <h1>Recruiter Dashboard</h1>
                <p>Review candidates and manage job applications.</p>
            </div>

            <section className="dashboard-summary">
                <div className="summary-card">
                    <span>Total Applicants</span>
                    <strong>{applications.length}</strong>
                </div>

                <div className="summary-card">
                    <span>Under Review</span>
                    <strong>
                        {applications.filter((app) => app.status === 'Under Review').length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Shortlisted</span>
                    <strong>
                        {applications.filter((app) => app.status === 'Shortlisted').length}
                    </strong>
                </div>
            </section>

            <section className="applications-section">
                <h2>Job Applicants</h2>

                {loading && <p>Loading applicants...</p>}

                {!loading && error && (
                    <p className="dashboard-message">{error}</p>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="empty-applications">
                        <h3>No applicants yet</h3>
                        <p>Applicants will appear here when students apply to your jobs.</p>
                    </div>
                )}

                {!loading && applications.length > 0 && (
                    <div className="application-list">
                        {applications.map((app) => (
                            <article className="application-card" key={app._id}>
                                <div>
                                    <h3>{app.student?.name || 'Student'}</h3>
                                    <p>{app.student?.email || 'Email unavailable'}</p>
                                    <p>
                                        <strong>Position:</strong>{' '}
                                        {app.job?.title || 'Job title unavailable'}
                                    </p>
                                    <p>
                                        <strong>Company:</strong>{' '}
                                        {app.job?.company || 'Company unavailable'}
                                    </p>
                                    <small>
                                        Applied on{' '}
                                        {app.createdAt
                                            ? new Date(app.createdAt).toLocaleDateString()
                                            : 'Date unavailable'}
                                    </small>
                                </div>

                                <div>
                                    <p>
                                        <strong>Status:</strong> {app.status || 'Applied'}
                                    </p>

                                    <select
                                        aria-label={`Update status for ${app.student?.name || 'student'}`}
                                        value={app.status || 'Applied'}
                                        disabled={updatingId === app._id}
                                        onChange={(event) =>
                                            updateStatus(app._id, event.target.value)
                                        }
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>

                                    {updatingId === app._id && <small>Updating...</small>}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
