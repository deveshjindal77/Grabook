import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const BooksBoughtPage = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchBooksBought();
  }, [user, navigate]);

  const fetchBooksBought = async () => {
    try {
      const response = await fetch('/api/books_bought', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else if (response.status === 401) {
        navigate('/signin');
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books bought:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <Layout user={user}>
        <div style={{ marginTop: '80px', padding: '20px', textAlign: 'center' }}>
          <p>Loading books bought...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div style={{ marginTop: '80px', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '30px',
            color: '#333',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Books Bought
          </h1>

          {books.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 0 40px rgba(8,7,16,0.6)'
            }}>
              <p style={{
                fontSize: '18px',
                color: '#666',
                fontFamily: "'Poppins', sans-serif"
              }}>
                You haven't bought any books yet.
              </p>
              <Link
                to="/grab_book"
                style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  padding: '12px 30px',
                  backgroundColor: '#29bccf',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1fa8bb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#29bccf'}
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="row" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {books.map((book) => (
                <div
                  key={book.book_id}
                  className="card"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 0 20px rgba(8,7,16,0.2)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid #17a2b8'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 5px 25px rgba(8,7,16,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(8,7,16,0.2)';
                  }}
                >
                  <Link
                    to={`/book?id=${book.book_id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <img
                      className="book_img"
                      src={book.image_1 || '/static/css/profile_pic.png'}
                      alt={book.title}
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.src = '/static/css/profile_pic.png';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="details" style={{
                      padding: '15px'
                    }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '10px',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        BOUGHT
                      </div>
                      <p className="details_price" style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#29bccf',
                        margin: '0 0 10px 0',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {book.price} Rs.
                      </p>
                      <p className="details_title" style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333',
                        margin: '0 0 8px 0',
                        fontFamily: "'Poppins', sans-serif",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {book.title}
                      </p>
                      {book.year_of_publication && (
                        <p className="details_year_of_publication" style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: '0 0 5px 0',
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          Year: {book.year_of_publication}
                        </p>
                      )}
                      <p className="details_author" style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0',
                        fontFamily: "'Poppins', sans-serif",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        Author: {book.author}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BooksBoughtPage;

