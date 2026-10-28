
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole }) {
    const token = localStorage.getItem('token');

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        user = null;
    }

    // Redirect to login if the user is not authenticated
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect users who do not have the required role
    if (allowedRole && user.role !== allowedRole) {
        if (user.role === 'recruiter') {
            return <Navigate to="/recruiter-dashboard" replace />;
        }

        if (user.role === 'student') {
            return <Navigate to="/student-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
