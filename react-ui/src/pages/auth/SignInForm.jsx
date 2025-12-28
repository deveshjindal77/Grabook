import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignInPage.css';

const SignInForm = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email_id: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Call the callback to update user state
        if (onSignIn) {
          onSignIn(data.user);
        }
        // Redirect to home page
        navigate('/');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-form-container">
      <div className="signin-banner">
        <h1>Welcome Back</h1>
      </div>
      
      <form className="signin-form" onSubmit={handleSubmit}>
        {error && (
          <div className="signin-error">
            ⚠️ {error}
          </div>
        )}

        <div className="signin-form-item">
          <label htmlFor="email_id">📧 Email Address</label>
          <div className="signin-input-wrapper">
            <input
              id="email_id"
              className="signin-input"
              type="email"
              name="email_id"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="password">🔒 Password</label>
          <div className="signin-input-wrapper">
            <input
              id="password"
              className="signin-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          className="signin-submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Signing In...
            </>
          ) : (
            '🚀 Sign In'
          )}
        </button>

        <Link className="signin-link" to="/signup">
          Don't have an account? Sign up here
        </Link>
      </form>
    </div>
  );
};

export default SignInForm;

