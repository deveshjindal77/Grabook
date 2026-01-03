import { Link } from 'react-router-dom';

const BookRequestHeader = ({ book }) => {
  if (!book) {
    return null;
  }

  return (
    <div style={{
      marginTop: '80px',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px'
    }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <img
          src={book.image_1 || '/static/css/profile_pic.png'}
          alt={book.title}
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '2px solid #e0e0e0'
          }}
          onError={(e) => {
            e.target.src = '/static/css/profile_pic.png';
            e.target.onerror = null;
          }}
        />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#2c3e50',
            margin: '0 0 10px 0',
            fontFamily: "'Poppins', sans-serif"
          }}>
            {book.title}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: '5px 0',
            fontFamily: "'Poppins', sans-serif"
          }}>
            <strong>Author:</strong> {book.author}
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#29bccf',
            margin: '5px 0',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Price: ₹{book.price}
          </p>
          <Link
            to={`/book?id=${book.book_id}`}
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#29bccf',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1fa8bb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#29bccf'}
          >
            View Book Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookRequestHeader;

