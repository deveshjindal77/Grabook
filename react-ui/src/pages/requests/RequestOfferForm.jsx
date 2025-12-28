import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RequestOfferForm = ({ user }) => {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    offer_price: '',
    offer_description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!formData.offer_price || !formData.offer_description) {
      setError('Please fill in all fields');
      return;
    }

    const offerPrice = parseFloat(formData.offer_price);
    if (isNaN(offerPrice) || offerPrice <= 0) {
      setError('Please enter a valid offer price');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/request_offer/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          offer_price: offerPrice,
          offer_description: formData.offer_description
        })
      });

      if (response.ok) {
        alert('Request sent successfully!');
        navigate('/grab_book');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      setError('An error occurred while sending the request');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ marginTop: '80px', padding: '40px', textAlign: 'center' }}>
        <p>Please sign in to make an offer.</p>
        <button
          onClick={() => navigate('/signin')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#29bccf',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="offer" style={{
      marginTop: '80px',
      maxWidth: '800px',
      margin: '80px auto 40px',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#2c3e50',
        marginBottom: '30px',
        fontFamily: "'Poppins', sans-serif",
        textAlign: 'center'
      }}>
        Make an Offer
      </h2>

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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label className="heading2" style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#34495e',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Offer Price (₹)
          </label>
          <input
            type="number"
            name="offer_price"
            className="input"
            value={formData.offer_price}
            onChange={handleChange}
            placeholder="Enter your offer price"
            min="1"
            step="0.01"
            required
            style={{
              display: 'block',
              height: '50px',
              width: '100%',
              borderRadius: '10px',
              outline: 'none',
              padding: '0 15px',
              marginTop: '8px',
              fontSize: '16px',
              fontWeight: 400,
              border: '2px solid #e0e0e0',
              boxShadow: '0 0 5px rgba(93, 91, 104, 0.1)',
              transition: 'border-color 0.3s',
              fontFamily: "'Poppins', sans-serif"
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label className="heading2" style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#34495e',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Offer Description
          </label>
          <textarea
            name="offer_description"
            className="box1"
            value={formData.offer_description}
            onChange={handleChange}
            placeholder="Describe your offer, any conditions, or additional information..."
            rows="6"
            required
            style={{
              display: 'block',
              width: '100%',
              borderRadius: '10px',
              outline: 'none',
              padding: '15px',
              marginTop: '8px',
              fontSize: '16px',
              fontWeight: 400,
              border: '2px solid #e0e0e0',
              boxShadow: '0 0 5px rgba(93, 91, 104, 0.1)',
              transition: 'border-color 0.3s',
              fontFamily: "'Poppins', sans-serif",
              resize: 'vertical',
              minHeight: '120px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29bccf'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            type="submit"
            className="btn2"
            disabled={loading}
            style={{
              padding: '15px 40px',
              backgroundColor: loading ? '#ccc' : '#29bccf',
              color: '#060413',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#1fa8bb';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#29bccf';
            }}
          >
            {loading ? 'Sending...' : 'Submit Offer'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '15px 40px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestOfferForm;

