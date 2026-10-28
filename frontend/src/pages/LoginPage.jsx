import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPwd ? 'text' : type;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.4rem',
        }}
      >
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={isPassword ? 'current-password' : 'email'}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: isPassword
              ? '0.8rem 3rem 0.8rem 1rem'
              : '0.8rem 1rem',
            borderRadius: '10px',
            border: error
              ? '1.5px solid #ef4444'
              : '1.5px solid #d1d5db',
            fontSize: '0.92rem',
            color: '#0f2137',
            background: '#ffffff',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((value) => !value)}
            style={{
              position: 'absolute',
              right: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#7c3aed',
            }}
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && (
        <p style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function validateLoginForm(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLoginForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      const token =
        data.token || data.data?.token || data.accessToken;

      const user =
        data.user || data.data?.user;

      if (!token || !user) {
        throw new Error('Login response is missing user or token information.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccess(true);

      // Return students to the page they originally wanted to visit.
      const previousPage =
        location.state?.from ||
        sessionStorage.getItem('smarthireReturnTo');
      console.log('Login redirect state:', location.state);
      console.log('Previous page:', previousPage);
      if (
        user.role === 'student' &&
        typeof previousPage === 'string' &&
        previousPage.startsWith('/') &&
        !previousPage.startsWith('//')
      ) {
        sessionStorage.removeItem('smarthireReturnTo');
        navigate(previousPage, { replace: true });
      } else if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard', { replace: true });
      } else if (user.role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    } catch (error) {
      setErrors({
        form: error.message || 'Unable to connect to the server.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#0f2137',
          marginBottom: '0.4rem',
        }}>
          Welcome back 👋
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          Sign in to continue to SmartHire.{' '}
          <Link
            to="/signup"
            state={{ from: location.state?.from }}
            style={{
              color: '#7c3aed',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create an account →
          </Link>
        </p>
      </div>

      {success && (
        <div role="status" style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          color: '#15803d',
        }}>
          Login successful! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" style={{ color: '#dc2626', marginBottom: '1rem' }}>
            {errors.form}
          </p>
        )}

        <InputField
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={errors.email}
        />

        <InputField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={errors.password}
        />

        <div style={{
          textAlign: 'right',
          marginTop: '-0.5rem',
          marginBottom: '1.5rem',
        }}>
          <Link
            to="/login"
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: '0.82rem',
              color: '#7c3aed',
              textDecoration: 'none',
            }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: '10px',
            fontSize: '1rem',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '1.75rem 0',
      }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        <span style={{
          fontSize: '0.78rem',
          color: '#9ca3af',
          whiteSpace: 'nowrap',
        }}>
          or continue with
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {['Google', 'LinkedIn'].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => alert(`${name} login is not connected yet.`)}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: '#ffffff',
              border: '1.5px solid #e5e7eb',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#374151',
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <p style={{
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '0.85rem',
        color: '#6b7280',
      }}>
        Don't have an account?{' '}

        <Link
          to="/signup"
          state={{
            from:
              location.state?.from ||
              sessionStorage.getItem('smarthireReturnTo')
          }}
          style={{
            color: '#7c3aed',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Sign up for free →
        </Link>

      </p>
    </AuthLayout>
  );
}
