
import { useEffect, useState } from 'react';
import './StudentDashboard.css';

const emptyProfile = {
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    graduationYear: '',
    skills: '',
};

export default function StudentDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [resume, setResume] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeMessage, setResumeMessage] = useState('');
    const [resumeError, setResumeError] = useState('');

    // Student profile state
    const [profile, setProfile] = useState(emptyProfile);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [editProfile, setEditProfile] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchApplications = async () => {
            if (!token) {
                setError('Please log in to view your applications.');
                setLoading(false);
                setResumeLoading(false);
                setProfileLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    'http://localhost:5000/api/applications/my-applications',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load applications.'
                    );
                }

                setApplications(data.applications || []);
            } catch (err) {
                setError(err.message || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        };

        const fetchProfile = async () => {
            if (!token) {
                setResumeLoading(false);
                setProfileLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    'http://localhost:5000/api/users/me',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load profile.'
                    );
                }

                const user = data.user || {};

                setProfile({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    college: user.college || '',
                    degree: user.degree || '',
                    graduationYear: user.graduationYear ?? '',
                    skills: Array.isArray(user.skills)
                        ? user.skills.join(', ')
                        : '',
                });

                setResume(user.resume || null);
            } catch (err) {
                setProfileError(err.message || 'Unable to load profile.');
                setResumeError(err.message || 'Unable to load resume details.');
            } finally {
                setResumeLoading(false);
                setProfileLoading(false);
            }
        };

        fetchApplications();
        fetchProfile();
    }, []);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

        setProfileMessage('');
        setProfileError('');
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        if (!token) {
            setProfileError('Please log in to update your profile.');
            return;
        }

        if (!profile.name.trim()) {
            setProfileError('Name cannot be empty.');
            return;
        }

        const skills = profile.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);

        const profileData = {
            name: profile.name.trim(),
            phone: profile.phone.trim(),
            college: profile.college.trim(),
            degree: profile.degree.trim(),
            graduationYear: profile.graduationYear,
            skills,
        };

        setProfileSaving(true);
        setProfileMessage('');
        setProfileError('');

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/me',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(profileData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to update profile.');
            }

            const user = data.user || {};

            setProfile({
                name: user.name ?? profileData.name,
                email: user.email ?? profile.email,
                phone: user.phone ?? profileData.phone,
                college: user.college ?? profileData.college,
                degree: user.degree ?? profileData.degree,
                graduationYear: user.graduationYear ?? '',
                skills: Array.isArray(user.skills)
                    ? user.skills.join(', ')
                    : skills.join(', '),
            });

            // Keep the saved name in localStorage if user data is stored there.
            try {
                const savedUser = JSON.parse(
                    localStorage.getItem('user') || 'null'
                );

                if (savedUser) {
                    localStorage.setItem(
                        'user',
                        JSON.stringify({
                            ...savedUser,
                            name: user.name ?? profileData.name,
                        })
                    );
                }
            } catch {
                // Profile saving should still succeed if local user data is invalid.
            }

            setProfileMessage('Profile updated successfully!');
            setEditProfile(false);
        } catch (err) {
            setProfileError(err.message || 'Unable to update profile.');
        } finally {
            setProfileSaving(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        setSelectedFile(null);
        setResumeMessage('');
        setResumeError('');

        if (!file) return;

        if (
            file.type !== 'application/pdf' ||
            !file.name.toLowerCase().endsWith('.pdf')
        ) {
            setResumeError('Please select a PDF file.');
            event.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResumeError('Resume must be 5 MB or smaller.');
            event.target.value = '';
            return;
        }

        setSelectedFile(file);
    };

    const handleResumeUpload = async (event) => {
        event.preventDefault();

        if (!token) {
            setResumeError('Please log in before uploading your resume.');
            return;
        }

        if (!selectedFile) {
            setResumeError('Please choose a PDF resume first.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', selectedFile);

        setUploading(true);
        setResumeMessage('');
        setResumeError('');

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/resume',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Resume upload failed.');
            }

            setResume(data.resume);
            setSelectedFile(null);
            setResumeMessage('Resume uploaded successfully!');

            event.target.reset();
        } catch (err) {
            setResumeError(err.message || 'Unable to upload resume.');
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadResume = async () => {
        if (!token) {
            setResumeError('Please log in to download your resume.');
            return;
        }

        setResumeError('');
        setResumeMessage('');

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/resume/download',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Unable to download resume.');
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = downloadUrl;
            link.download = resume?.filename || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(downloadUrl);
            setResumeMessage('Resume download started.');
        } catch (err) {
            setResumeError(err.message || 'Unable to download resume.');
        }
    };

    const statusColors = {
        Applied: '#2563eb',
        'Under Review': '#d97706',
        Shortlisted: '#059669',
        Rejected: '#dc2626',
        Hired: '#7c3aed',
    };

    return (
        <main className="student-dashboard">
            <div className="dashboard-heading">
                <p className="dashboard-eyebrow">STUDENT PORTAL</p>
                <h1>My Dashboard</h1>
                <p>
                    Track your job and internship applications in one place.
                </p>
            </div>

            <section className="dashboard-summary">
                <div className="summary-card">
                    <span>Total Applications</span>
                    <strong>{applications.length}</strong>
                </div>

                <div className="summary-card">
                    <span>Under Review</span>
                    <strong>
                        {applications.filter(
                            (app) => app.status === 'Under Review'
                        ).length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Shortlisted</span>
                    <strong>
                        {applications.filter(
                            (app) => app.status === 'Shortlisted'
                        ).length}
                    </strong>
                </div>
            </section>

            {/* Student Profile */}
            <section className="applications-section profile-section">
                <div className="profile-heading">
                    <div>
                        <h2>My Profile</h2>
                        <p>Manage your personal and education details.</p>
                    </div>

                    {!profileLoading && !editProfile && (
                        <button
                            type="button"
                            onClick={() => {
                                setProfileMessage('');
                                setProfileError('');
                                setEditProfile(true);
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {profileLoading && <p>Loading your profile...</p>}

                {!profileLoading && !editProfile && (
                    <div className="profile-details">
                        <div className="profile-detail">
                            <span>Full Name</span>
                            <strong>{profile.name || 'Not added'}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Email Address</span>
                            <strong>{profile.email || 'Not available'}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Phone Number</span>
                            <strong>{profile.phone || 'Not added'}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>College</span>
                            <strong>{profile.college || 'Not added'}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Degree</span>
                            <strong>{profile.degree || 'Not added'}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Graduation Year</span>
                            <strong>
                                {profile.graduationYear || 'Not added'}
                            </strong>
                        </div>

                        <div className="profile-detail profile-skills">
                            <span>Skills</span>
                            <div className="profile-skill-list">
                                {profile.skills
                                    .split(',')
                                    .map((skill) => skill.trim())
                                    .filter(Boolean)
                                    .map((skill, index) => (
                                        <span key={`${skill}-${index}`}>
                                            {skill}
                                        </span>
                                    ))}

                                {!profile.skills.trim() && (
                                    <strong>Not added</strong>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!profileLoading && editProfile && (
                    <form
                        className="profile-form"
                        onSubmit={handleProfileSubmit}
                    >
                        <div className="profile-form-grid">
                            <label>
                                Full Name *
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </label>

                            <label>
                                Email Address
                                <input
                                    type="email"
                                    value={profile.email}
                                    readOnly
                                    disabled
                                />
                            </label>

                            <label>
                                Phone Number
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your phone number"
                                />
                            </label>

                            <label>
                                College
                                <input
                                    type="text"
                                    name="college"
                                    value={profile.college}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your college name"
                                />
                            </label>

                            <label>
                                Degree
                                <input
                                    type="text"
                                    name="degree"
                                    value={profile.degree}
                                    onChange={handleProfileChange}
                                    placeholder="e.g. B.Tech Computer Science"
                                />
                            </label>

                            <label>
                                Graduation Year
                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={profile.graduationYear}
                                    onChange={handleProfileChange}
                                    min="2000"
                                    max="2100"
                                    placeholder="e.g. 2027"
                                />
                            </label>

                            <label className="profile-full-width">
                                Skills
                                <textarea
                                    name="skills"
                                    value={profile.skills}
                                    onChange={handleProfileChange}
                                    placeholder="Enter skills separated by commas, e.g. JavaScript, React, Node.js"
                                    rows="3"
                                />
                                <small>
                                    Separate each skill with a comma.
                                </small>
                            </label>
                        </div>

                        <div className="profile-form-actions">
                            <button
                                type="submit"
                                disabled={profileSaving}
                            >
                                {profileSaving
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </button>

                            <button
                                type="button"
                                className="profile-cancel-button"
                                disabled={profileSaving}
                                onClick={() => {
                                    setEditProfile(false);
                                    setProfileMessage('');
                                    setProfileError('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {profileMessage && (
                    <p role="status" className="dashboard-message">
                        {profileMessage}
                    </p>
                )}

                {profileError && (
                    <p role="alert" className="dashboard-message">
                        {profileError}
                    </p>
                )}
            </section>

            {/* Resume */}
            <section className="applications-section resume-section">
                <h2>My Resume</h2>
                <p>Upload your resume as a PDF (maximum 5 MB).</p>

                {resumeLoading && <p>Checking your resume...</p>}

                {!resumeLoading && resume?.filename && (
                    <div className="resume-current">
                        <p>
                            <strong>Uploaded file:</strong> {resume.filename}
                        </p>

                        {resume.uploadedAt && (
                            <small>
                                Uploaded on{' '}
                                {new Date(
                                    resume.uploadedAt
                                ).toLocaleDateString()}
                            </small>
                        )}

                        <div>
                            <button
                                type="button"
                                onClick={handleDownloadResume}
                            >
                                Download Resume
                            </button>
                        </div>
                    </div>
                )}

                {!resumeLoading && !resume?.filename && (
                    <p>No resume uploaded yet.</p>
                )}

                <form onSubmit={handleResumeUpload}>
                    <label htmlFor="resume-file">Choose PDF Resume</label>

                    <input
                        id="resume-file"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                    />

                    {selectedFile && <p>Selected: {selectedFile.name}</p>}

                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                </form>

                {resumeMessage && (
                    <p role="status" className="dashboard-message">
                        {resumeMessage}
                    </p>
                )}

                {resumeError && (
                    <p role="alert" className="dashboard-message">
                        {resumeError}
                    </p>
                )}
            </section>

            {/* Applications */}
            <section className="applications-section">
                <h2>My Applications</h2>

                {loading && <p>Loading your applications...</p>}

                {!loading && error && (
                    <p className="dashboard-message">{error}</p>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="empty-applications">
                        <h3>No applications yet</h3>
                        <p>Explore jobs and internships to get started.</p>
                        <a href="/jobs">Browse Jobs</a>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="application-list">
                        {applications.map((app) => (
                            <article
                                className="application-card"
                                key={app._id}
                            >
                                <div>
                                    <h3>
                                        {app.job?.title ||
                                            'Job title unavailable'}
                                    </h3>
                                    <p>
                                        {app.job?.company ||
                                            'Company unavailable'}
                                    </p>
                                    <small>
                                        Applied on{' '}
                                        {app.createdAt
                                            ? new Date(
                                                app.createdAt
                                            ).toLocaleDateString()
                                            : 'Date unavailable'}
                                    </small>
                                </div>

                                <span
                                    className="application-status"
                                    style={{
                                        color:
                                            statusColors[app.status] ||
                                            '#374151',
                                        backgroundColor: '#f3f4f6',
                                    }}
                                >
                                    {app.status || 'Applied'}
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
