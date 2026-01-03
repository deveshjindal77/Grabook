import Layout from '../../components/Layout';
import RequestOfferForm from './RequestOfferForm';

const RequestOfferPage = ({ user }) => {
  return (
    <Layout user={user}>
      <RequestOfferForm user={user} />
    </Layout>
  );
};

export default RequestOfferPage;

