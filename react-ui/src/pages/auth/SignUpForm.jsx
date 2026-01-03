import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignInPage.css'; // Reuse the same styles

const SignUpForm = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email_id: '',
    user_name: '',
    password: '',
    cpassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.cpassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Call the callback to update user state
        if (onSignUp) {
          onSignUp(data.user);
        }
        // Redirect to home page
        navigate('/');
      } else {
        setError(data.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-form-container">
      <div className="signin-banner">
        <h1>Join Grabook</h1>
      </div>
      
      <form className="signin-form" onSubmit={handleSubmit}>
        {error && (
          <div className="signin-error">
            ⚠️ {error}
          </div>
        )}

        <div className="signin-form-item">
          <label htmlFor="first_name">👤 First Name *</label>
          <div className="signin-input-wrapper">
            <input
              id="first_name"
              className="signin-input"
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="last_name">👤 Last Name</label>
          <div className="signin-input-wrapper">
            <input
              id="last_name"
              className="signin-input"
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="phone_number">📱 Contact Number *</label>
          <div className="signin-input-wrapper">
            <input
              id="phone_number"
              className="signin-input"
              type="tel"
              name="phone_number"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="email_id">📧 Email Address *</label>
          <div className="signin-input-wrapper">
            <input
              id="email_id"
              className="signin-input"
              type="email"
              name="email_id"
              placeholder="Enter your email"
              value={formData.email_id}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="user_name">🆔 Username *</label>
          <div className="signin-input-wrapper">
            <input
              id="user_name"
              className="signin-input"
              type="text"
              name="user_name"
              placeholder="Choose a username"
              value={formData.user_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="password">🔒 Password *</label>
          <div className="signin-input-wrapper">
            <input
              id="password"
              className="signin-input"
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="signin-form-item">
          <label htmlFor="cpassword">🔒 Confirm Password *</label>
          <div className="signin-input-wrapper">
            <input
              id="cpassword"
              className="signin-input"
              type="password"
              name="cpassword"
              placeholder="Confirm your password"
              value={formData.cpassword}
              onChange={handleChange}
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
              Creating Account...
            </>
          ) : (
            '✨ Create Account'
          )}
        </button>

        <Link className="signin-link" to="/signin">
          Already have an account? Sign in here
        </Link>
      </form>
    </div>
  );
};

export default SignUpForm;
