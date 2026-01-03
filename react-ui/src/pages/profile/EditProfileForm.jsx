import { useState, useEffect } from 'react';

const EditProfileForm = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    occupation: '',
    university_name: '',
    email_id: '',
    bio: '',
    phone_number: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        occupation: user.occupation || '',
        university_name: user.university_name || '',
        email_id: user.email_id || '',
        bio: user.bio || '',
        phone_number: user.phone_number || '',
        age: user.age || ''
      });
      setProfilePicPreview(
        user.profile_pic 
          ? (user.profile_pic.startsWith('http') 
              ? user.profile_pic 
              : user.profile_pic.startsWith('/') 
                ? user.profile_pic 
                : `/static/${user.profile_pic}`)
          : '/static/css/profile_pic.png'
      );
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, upload profile picture if selected
      if (profilePic) {
        const formDataPic = new FormData();
        formDataPic.append('myfile', profilePic);

        const picResponse = await fetch('/api/profile_upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataPic
        });

        if (!picResponse.ok) {
          const picError = await picResponse.json();
          throw new Error(picError.error || 'Failed to upload profile picture');
        }
      }

      // Then update profile data
      const response = await fetch('/api/edit_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (onSuccess) {
          onSuccess(data.user);
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Edit profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <img
            src={profilePicPreview || '/static/css/profile_pic.png'}
            alt="Profile Preview"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #29bccf',
              backgroundColor: '#ddd',
              display: 'block',
              margin: '0 auto'
            }}
            onError={(e) => {
              e.target.src = '/static/css/profile_pic.png';
              e.target.onerror = null;
            }}
          />
        </div>
        <label style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#29bccf',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1fa8bb'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#29bccf'}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: 'none' }}
          />
          Change Profile Picture
        </label>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="input"
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="input"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Email *
          </label>
          <input
            type="email"
            name="email_id"
            value={formData.email_id}
            onChange={handleInputChange}
            className="input"
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Phone Number *
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="input"
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="input"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            University
          </label>
          <input
            type="text"
            name="university_name"
            value={formData.university_name}
            onChange={handleInputChange}
            className="input"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="input"
            min="1"
            max="120"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#555',
          marginBottom: '8px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows="4"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #e0e0e0',
            fontSize: '16px',
            fontFamily: "'Poppins', sans-serif",
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#29bccf'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            padding: '12px 30px',
            backgroundColor: '#ccc',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#bbb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ccc'}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{
            padding: '12px 30px',
            backgroundColor: '#29bccf',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Poppins', sans-serif",
            transition: 'background-color 0.3s',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#1fa8bb')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#29bccf')}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;

