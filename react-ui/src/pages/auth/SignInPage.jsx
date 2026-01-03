import Layout from '../../components/Layout';
import SignInForm from './SignInForm';
import './SignInPage.css';

const SignInPage = ({ user, setUser }) => {
  const handleSignIn = (userData) => {
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
          <SignInForm onSignIn={handleSignIn} />
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage;

