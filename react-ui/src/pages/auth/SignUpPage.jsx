import Layout from '../../components/Layout';
import SignUpForm from './SignUpForm';
import './SignInPage.css'; // Reuse the same styles

const SignUpPage = ({ user, setUser }) => {
  const handleSignUp = (userData) => {
    if (setUser) {
      setUser(userData);
    }
    // Force a page reload to update the app state
    window.location.href = '/';
  };

  return (
    <Layout user={user}>
      <div className="signin-page-container">
        <div className="signin-form-wrapper">
          <SignUpForm onSignUp={handleSignUp} />
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;

