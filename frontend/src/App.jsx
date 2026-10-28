// ──────────────────────────────────────────────────────────────
//  App.jsx — Root component
//  Sets up React Router and renders the correct page per URL.
// ──────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import JobsPage from './pages/JobsPage';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobDetailsPage from './pages/JobDetailsPage';
import PostJobPage from './pages/PostJobPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


// Placeholder pages — replace with real pages in future stages
function PlaceholderPage({ title }) {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", color: '#0f2137',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: '#6b7280' }}>This page is coming in the next stage. Stay tuned!</p>
    </div>
  );
}

export default function App() {
  return (
    // BrowserRouter enables URL-based navigation throughout the app
    <BrowserRouter>
      {/* Navbar is outside <Routes> so it shows on every page */}
      <Navbar />

      <Routes>
        {/* Stage 1: Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Placeholder routes — to be built in later stages */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/internships" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* Stage 2: Real auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />


        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route
            path="/student-dashboard"
            element={<StudentDashboard />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
          <Route
            path="/recruiter-dashboard"
            element={<RecruiterDashboard />}
          />
        </Route>

        <Route path="/post-job" element={<PostJobPage />} />


        {/* 404 fallback */}
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
