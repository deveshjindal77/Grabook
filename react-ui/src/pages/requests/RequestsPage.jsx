import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from "../../components/Layout";
import BookRequestHeader from "./BookRequestHeader";
import RequestsList from "./RequestsList";

const RequestsPage = ({ user }) => {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('id');
  const [book, setBook] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!bookId) {
      navigate('/books_in_ad');
      return;
    }
    fetchData();
  }, [user, bookId, navigate]);

  const fetchData = async () => {
    try {
      // Fetch book details
      const bookResponse = await fetch(`/api/book/${bookId}`, {
        credentials: 'include'
      });
      
      if (!bookResponse.ok) {
        throw new Error('Failed to fetch book');
      }
      
      const bookData = await bookResponse.json();
      setBook(bookData.book);

      // Fetch requests
      const requestsResponse = await fetch(`/api/requests?id=${bookId}`, {
        credentials: 'include'
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData.requests || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load requests. Please try again.');
      navigate('/books_in_ad');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request) => {
    if (!window.confirm(`Accept offer of ₹${request.offer_price} from ${request.buyer_user_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/accept_request/${request.book_id}/${request.buyer_user_name}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Request accepted! The book has been marked as sold.');
        // Remove the accepted request from the list
        setRequests(requests.filter(r => 
          !(r.book_id === request.book_id && r.buyer_user_name === request.buyer_user_name)
        ));
        // Refresh the page to update book status
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to accept request');
      }
    } catch (error) {
        console.error('Error accepting request:', error);
        alert('An error occurred while accepting the request');
    }
  };

  const handleReject = async (request) => {
    if (!window.confirm(`Reject offer from ${request.buyer_user_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/reject_request/${request.book_id}/${request.buyer_user_name}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Remove the rejected request from the list
        setRequests(requests.filter(r => 
          !(r.book_id === request.book_id && r.buyer_user_name === request.buyer_user_name)
        ));
        alert('Request rejected');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('An error occurred while rejecting the request');
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <Layout user={user}>
        <div style={{ marginTop: '80px', padding: '20px', textAlign: 'center' }}>
          <p>Loading requests...</p>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout user={user}>
        <div style={{ marginTop: '80px', padding: '20px', textAlign: 'center' }}>
          <p>Book not found</p>
          <button
            onClick={() => navigate('/books_in_ad')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#29bccf',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Books Posted
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <BookRequestHeader book={book} />
        
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#2c3e50',
          marginBottom: '30px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Purchase Requests
        </h2>

        <RequestsList 
          requests={requests} 
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>
    </Layout>
  );
};

export default RequestsPage;
