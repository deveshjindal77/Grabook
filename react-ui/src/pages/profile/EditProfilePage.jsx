import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import EditProfileForm from './EditProfileForm';

const EditProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleSuccess = (updatedUser) => {
    if (setUser) {
      setUser(updatedUser);
    }
    navigate('/profile');
  };

  if (!user) {
    navigate('/signin');
    return null;
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
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '30px',
            color: '#29bccf',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Edit Profile
          </h1>
          <EditProfileForm user={user} onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default EditProfilePage;

