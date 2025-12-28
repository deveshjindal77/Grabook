import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const Profile = ({ user, setUser }) => {
  const [profileData, setProfileData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to signin if not logged in
      navigate('/signin');
      return;
    }
    setProfileData(user);
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Layout user={user}>
      <div style={{ marginTop: '80px', padding: '20px' }}>
        <div className="profile" style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 0 40px rgba(8,7,16,0.6)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '30px',
            gap: '20px'
          }}>
            <img
              src={
                profileData.profile_pic 
                  ? (profileData.profile_pic.startsWith('http') 
                      ? profileData.profile_pic 
                      : profileData.profile_pic.startsWith('/') 
                        ? profileData.profile_pic 
                        : `/static/${profileData.profile_pic}`)
                  : '/static/css/profile_pic.png'
              }
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #29bccf',
                backgroundColor: '#ddd'
              }}
              onError={(e) => {
                e.target.src = '/static/css/profile_pic.png';
                e.target.onerror = null;
              }}
            />
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                margin: '0 0 10px 0',
                color: '#333',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {profileData.first_name} {profileData.last_name || ''}
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#666',
                margin: '5px 0',
                fontFamily: "'Poppins', sans-serif"
              }}>
                @{profileData.user_name}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              marginBottom: '20px',
              color: '#29bccf',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Profile Information
            </h2>
            
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
                  Email
                </label>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {profileData.email_id || 'Not provided'}
                </div>
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
                  Phone Number
                </label>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {profileData.phone_number || 'Not provided'}
                </div>
              </div>

              {profileData.occupation && (
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
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#333'
                  }}>
                    {profileData.occupation}
                  </div>
                </div>
              )}

              {profileData.university_name && (
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
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#333'
                  }}>
                    {profileData.university_name}
                  </div>
                </div>
              )}

              {profileData.age && (
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
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#333'
                  }}>
                    {profileData.age}
                  </div>
                </div>
              )}
            </div>

            {profileData.bio && (
              <div style={{ marginTop: '20px' }}>
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
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  minHeight: '80px'
                }}>
                  {profileData.bio}
                </div>
              </div>
            )}

            <div style={{ marginTop: '30px' }}>
              <button
                onClick={() => navigate('/edit_profile')}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#29bccf',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1fa8bb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#29bccf'}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

