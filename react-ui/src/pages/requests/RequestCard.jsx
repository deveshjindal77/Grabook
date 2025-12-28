import { Link } from 'react-router-dom';
import RequestActions from "./RequestActions";

const RequestCard = ({ request, onAccept, onReject }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      gap: '20px',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#666',
          margin: '0 0 10px 0',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Buyer:
        </p>
        <Link
          to={`/ratings_reviews?id=${request.buyer_user_name}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit',
            marginBottom: '15px'
          }}
        >
          <img
            className="rounded-circle"
            src="/static/css/profile_pic.png"
            alt={request.buyer_user_name}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e0e0e0'
            }}
            onError={(e) => {
              e.target.src = '/static/css/profile_pic.png';
              e.target.onerror = null;
            }}
          />
          <p style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#29bccf',
            margin: 0,
            fontFamily: "'Poppins', sans-serif"
          }}>
            {request.buyer_user_name}
          </p>
        </Link>

        <p style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#28a745',
          margin: '10px 0',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Offer Price: <i className="fa fa-inr" /> {request.offer_price}
        </p>

        <p style={{
          fontSize: '15px',
          color: '#555',
          margin: '10px 0',
          lineHeight: 1.6,
          fontFamily: "'Poppins', sans-serif"
        }}>
          <strong>Offer Description:</strong> {request.offer_description}
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '150px'
      }}>
        <RequestActions request={request} onAccept={onAccept} onReject={onReject} />
      </div>
    </div>
  );
};

export default RequestCard;
