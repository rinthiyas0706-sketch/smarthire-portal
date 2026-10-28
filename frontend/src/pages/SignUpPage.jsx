
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
  autoComplete,
}) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPwd ? 'text' : type;

  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '0.83rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.35rem',
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
          autoComplete={
            autoComplete || (isPassword ? 'new-password' : 'off')
          }
          required
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: isPassword
              ? '0.75rem 3rem 0.75rem 1rem'
              : '0.75rem 1rem',
            borderRadius: '10px',
            border: error
              ? '1.5px solid #ef4444'
              : '1.5px solid #d1d5db',
            fontSize: '0.9rem',
            color: '#0f2137',
            background: '#ffffff',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            onClick={() => setShowPwd((value) => !value)}
            style={{
              position: 'absolute',
              right: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.2rem',
            }}
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && (
        <p
          style={{
            marginTop: '0.3rem',
            fontSize: '0.76rem',
            color: '#ef4444',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function validateSignupForm({
  fullName,
  email,
  password,
  confirmPassword,
  role,
}) {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!['student', 'recruiter'].includes(role)) {
    errors.role = 'Please select a role.';
  }

  return errors;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('Signup redirect state:', location.state);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    if (!agreed) {
      setErrors({
        agreed: 'You must accept the terms to continue.',
      });
      return;
    }

    const validationErrors = validateSignupForm({
      fullName,
      email,
      password,
      confirmPassword,
      role,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || 'Unable to create your account.'
        );
      }

      setSuccess(true);

      setTimeout(() => {
        const previousPage = location.state?.from;

        navigate('/login', {
          state: {
            from:
              typeof previousPage === 'string' &&
                previousPage.startsWith('/') &&
                !previousPage.startsWith('//')
                ? previousPage
                : null,
          },
          replace: true,
        });
      }, 1200);
    } catch (error) {
      setErrors({
        submit:
          error.message === 'Failed to fetch'
            ? 'Cannot connect to the server. Make sure the backend is running on port 5000.'
            : error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#0f2137',
            letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
          }}
        >
          Create your account 🚀
        </h1>

        <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#7c3aed',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign in →
          </Link>
        </p>
      </div>

      <div
        style={{
          background: '#f5f3ff',
          border: '1px solid #ddd6fe',
          borderRadius: '10px',
          padding: '0.7rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          color: '#5b21b6',
          lineHeight: 1.5,
        }}
      >
        Create your SmartHire account to continue.
        Your registration will be sent to the server.
      </div>

      {success && (
        <div
          role="status"
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            color: '#15803d',
            fontSize: '0.85rem',
          }}
        >
          Account created successfully! Redirecting to login…
        </div>
      )}

      {errors.submit && (
        <div
          role="alert"
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            color: '#b91c1c',
            fontSize: '0.85rem',
          }}
        >
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="signup-fullname"
          label="Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setErrors((prev) => ({
              ...prev,
              fullName: undefined,
              submit: undefined,
            }));
          }}
          placeholder="Your full name"
          error={errors.fullName}
          autoComplete="name"
        />

        <InputField
          id="signup-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({
              ...prev,
              email: undefined,
              submit: undefined,
            }));
          }}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />

        <InputField
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({
              ...prev,
              password: undefined,
              confirmPassword: undefined,
              submit: undefined,
            }));
          }}
          placeholder="At least 6 characters"
          error={errors.password}
          autoComplete="new-password"
        />

        <InputField
          id="signup-confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) => ({
              ...prev,
              confirmPassword: undefined,
            }));
          }}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div style={{ marginBottom: '1.1rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.83rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
            }}
          >
            I am a…
          </label>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              {
                value: 'student',
                label: '🎓 Student',
                desc: 'Looking for jobs',
              },
              {
                value: 'recruiter',
                label: '🏢 Recruiter',
                desc: 'Hiring talent',
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setRole(option.value);
                  setErrors((prev) => ({
                    ...prev,
                    role: undefined,
                  }));
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  borderRadius: '10px',
                  border:
                    role === option.value
                      ? '2px solid #7c3aed'
                      : '2px solid #e5e7eb',
                  background:
                    role === option.value ? '#f5f3ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color:
                      role === option.value ? '#7c3aed' : '#374151',
                  }}
                >
                  {option.label}
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#6b7280',
                    marginTop: '0.15rem',
                  }}
                >
                  {option.desc}
                </div>
              </button>
            ))}
          </div>

          {errors.role && (
            <p
              style={{
                marginTop: '0.3rem',
                fontSize: '0.76rem',
                color: '#ef4444',
              }}
            >
              {errors.role}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="signup-terms"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              cursor: 'pointer',
            }}
          >
            <input
              id="signup-terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setErrors((prev) => ({
                  ...prev,
                  agreed: undefined,
                }));
              }}
              style={{
                marginTop: '2px',
                accentColor: '#7c3aed',
                width: '15px',
                height: '15px',
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              I agree to the{' '}
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>
                Terms of Service
              </span>{' '}
              and{' '}
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>
                Privacy Policy
              </span>
              .
            </span>
          </label>

          {errors.agreed && (
            <p
              style={{
                marginTop: '0.3rem',
                fontSize: '0.76rem',
                color: '#ef4444',
              }}
            >
              {errors.agreed}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: '10px',
            fontSize: '1rem',
            opacity: loading || success ? 0.7 : 1,
            cursor: loading || success ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? 'Creating account…'
            : success
              ? 'Account Created'
              : 'Create Account'}
        </button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.85rem',
          color: '#6b7280',
        }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          style={{
            color: '#7c3aed',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Sign in →
        </Link>
      </p>
    </AuthLayout>
  );
}
