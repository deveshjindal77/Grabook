import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

const GrabBookPage = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch books on component mount
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else if (response.status === 401) {
        // User not authenticated
        setBooks([]);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      // If search is empty, fetch all books
      fetchBooks();
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ keyword: searchKeyword }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else {
        const error = await response.json();
        console.error('Search error:', error);
        setBooks([]);
      }
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user}>
      <div className="container">
        <form className="grabook" onSubmit={handleSearch}>
          <div className="row">
            <div className="search-box">
              <input
                id="title"
                className="input"
                type="text"
                name="keyword"
                placeholder="Enter Book Title"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <input className="search-btn" type="submit" value="Search Book" />
            </div>
          </div>
        </form>
      </div>

      <br />
      <br />

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ 
              fontSize: '18px', 
              color: '#666',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Loading books...
            </div>
          </div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ 
              fontSize: '18px', 
              color: '#666',
              fontFamily: "'Poppins', sans-serif"
            }}>
              No books found.
            </div>
          </div>
        ) : (
          <div 
            className="books-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px',
              padding: '20px 0',
              margin: '0 auto',
              maxWidth: '1400px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {books.map((book) => (
              <Link
                key={book.book_id}
                className="book-card"
                to={`/book?id=${book.book_id}`}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative',
                  border: 'none',
                  float: 'none',
                  width: '100%',
                  margin: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                  const overlay = e.currentTarget.querySelector('.book-card-overlay');
                  const badge = e.currentTarget.querySelector('.book-card-price-badge');
                  if (overlay) overlay.style.opacity = '1';
                  if (badge) {
                    badge.style.opacity = '1';
                    badge.style.transform = 'translateY(0)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  const overlay = e.currentTarget.querySelector('.book-card-overlay');
                  const badge = e.currentTarget.querySelector('.book-card-price-badge');
                  if (overlay) overlay.style.opacity = '0';
                  if (badge) {
                    badge.style.opacity = '0';
                    badge.style.transform = 'translateY(-10px)';
                  }
                }}
              >
                <div 
                  className="book-card-image-wrapper"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '320px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                  }}
                >
                  <img
                    className="book-card-image"
                    src={book.image_1 || '/static/css/profile_pic.png'}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease'
                    }}
                    onError={(e) => {
                      e.target.src = '/static/css/profile_pic.png';
                      e.target.onerror = null;
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <div 
                    className="book-card-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none'
                    }}
                  >
                    <span 
                      className="book-card-price-badge"
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'linear-gradient(135deg, #29bccf 0%, #1fa8bb 100%)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(41, 188, 207, 0.4)',
                        zIndex: 2,
                        opacity: 0,
                        transform: 'translateY(-10px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {book.price} Rs.
                    </span>
                  </div>
                </div>
                <div 
                  className="book-card-content"
                  style={{
                    padding: '20px',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'white'
                  }}
                >
                  <h3 
                    className="book-card-title"
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#2c3e50',
                      margin: '0 0 12px 0',
                      lineHeight: 1.4,
                      fontFamily: "'Poppins', sans-serif",
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '50px'
                    }}
                  >
                    {book.title}
                  </h3>
                  <p 
                    className="book-card-author"
                    style={{
                      fontSize: '14px',
                      color: '#34495e',
                      margin: '6px 0',
                      fontFamily: "'Poppins', sans-serif",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600
                    }}
                  >
                    <i className="fas fa-user" style={{ color: '#29bccf', width: '16px', fontSize: '12px' }}></i> {book.author}
                  </p>
                  {book.year_of_publication && (
                    <p 
                      className="book-card-year"
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '6px 0',
                        fontFamily: "'Poppins', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fas fa-calendar" style={{ color: '#29bccf', width: '16px', fontSize: '12px' }}></i> {book.year_of_publication}
                    </p>
                  )}
                  {book.genre && (
                    <p 
                      className="book-card-genre"
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '6px 0',
                        fontFamily: "'Poppins', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fas fa-tag" style={{ color: '#29bccf', width: '16px', fontSize: '12px' }}></i> {book.genre}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GrabBookPage;

