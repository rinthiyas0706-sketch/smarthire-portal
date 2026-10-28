
import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';

const API_URL = 'http://localhost:5000/api/jobs';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(API_URL);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    throw new Error(data.message || 'Unable to load jobs.');
                }

                setJobs(Array.isArray(data.jobs) ? data.jobs : []);
            } catch (err) {
                setError(
                    err.message === 'Failed to fetch'
                        ? 'Unable to connect to the server. Please check whether the backend is running.'
                        : err.message || 'Unable to load jobs.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const keyword = search.trim().toLowerCase();

        const title = job.title || '';
        const company = job.company || '';
        const location = job.location || '';
        const skills = Array.isArray(job.skills)
            ? job.skills
            : typeof job.skills === 'string'
                ? job.skills.split(',')
                : [];

        const matchesSearch =
            title.toLowerCase().includes(keyword) ||
            company.toLowerCase().includes(keyword) ||
            location.toLowerCase().includes(keyword) ||
            skills.some((skill) =>
                String(skill).toLowerCase().includes(keyword)
            );

        const matchesType =
            jobType === 'All' ||
            (job.type || '').toLowerCase() === jobType.toLowerCase();

        return matchesSearch && matchesType;
    });

    return (
        <main
            style={{
                minHeight: '80vh',
                padding: '48px 6%',
                background: '#f8fafc',
                fontFamily: "'Inter', sans-serif",
                color: '#0f2137',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.3rem', fontWeight: 800 }}>
                    Find Your Next Opportunity
                </h1>

                <p style={{ color: '#64748b', marginTop: '10px' }}>
                    Explore jobs and internships that match your skills.
                </p>

                <input
                    type="text"
                    placeholder="Search job title, company, location or skill..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        margin: '28px 0 18px',
                        border: '1px solid #dbe3ef',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        background: 'white',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginBottom: '28px',
                    }}
                >
                    {['All', 'Full-time', 'Internship'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setJobType(type)}
                            style={{
                                padding: '10px 18px',
                                borderRadius: '8px',
                                border: '1px solid #dbe3ef',
                                background:
                                    jobType === type ? '#4338ca' : 'white',
                                color:
                                    jobType === type ? 'white' : '#334155',
                                cursor: 'pointer',
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                    {loading
                        ? 'Loading opportunities...'
                        : `${filteredJobs.length} opportunities found`}
                </p>

                {loading ? (
                    <p>Loading jobs from the database...</p>
                ) : error ? (
                    <div
                        role="alert"
                        style={{
                            padding: '16px',
                            background: '#fef2f2',
                            color: '#b91c1c',
                            borderRadius: '10px',
                        }}
                    >
                        {error}
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '22px',
                        }}
                    >
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                            />
                        ))}
                    </div>
                ) : (
                    <p>
                        {jobs.length === 0
                            ? 'No jobs have been posted yet. Recruiters can log in and post a job.'
                            : 'No matching jobs found. Try another search.'}
                    </p>
                )}
            </div>
        </main>
    );
}
