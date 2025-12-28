import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import './Book.css';

const Book = ({ user }) => {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('id');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial mobile state
    const checkMobile = () => setIsMobile(window.innerWidth <= 968);
    checkMobile();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!bookId) {
      navigate('/grab_book');
      return;
    }
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  useEffect(() => {
    if (user && book && bookId) {
      checkWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, book, bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/book/${bookId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error fetching book:', response.status, errorData);
        if (response.status === 404) {
          alert('Book not found');
        } else {
          alert('Failed to load book details. Please try again.');
        }
        setLoading(false);
        navigate('/grab_book');
        return;
      }

      const data = await response.json();
      console.log('Book data received:', data);
      
      if (data && data.book) {
        console.log('Setting book state:', data.book);
        setBook(data.book);
        // Set initial selected image
        if (data.book.image_1) {
          setSelectedImage(0);
        }
      } else {
        console.error('Invalid book data structure:', data);
        alert('Invalid book data received');
        navigate('/grab_book');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      alert('Failed to load book details. Please try again.');
      navigate('/grab_book');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user || !bookId) return;
    
    try {
      const response = await fetch('/api/wishlist', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const isInWishlist = data.books && data.books.some(b => b.book_id === parseInt(bookId));
        setInWishlist(isInWishlist);
      } else if (response.status === 401) {
        // User not authenticated, that's okay
        setInWishlist(false);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
      // Don't set wishlist state on error
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch(`/api/add_to_wishlist/${bookId}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setInWishlist(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('An error occurred');
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const response = await fetch(`/api/remove_from_wishlist/${bookId}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setInWishlist(false);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div style={{ marginTop: '80px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading book details...</div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout user={user}>
        <div style={{ marginTop: '80px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Book not found or failed to load.</div>
          <button
            onClick={() => navigate('/grab_book')}
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
            Back to Books
          </button>
        </div>
      </Layout>
    );
  }

  // Get all available images
  const images = [
    book.image_1,
    book.image_2,
    book.image_3,
    book.image_4
  ].filter(img => img);

  const mainImage = images[selectedImage] || '/static/css/profile_pic.png';

  return (
    <Layout user={user}>
      <div style={{ marginTop: '80px', padding: '40px 20px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '30px' : '40px',
            padding: isMobile ? '20px' : '40px'
          }}>
            {/* Left Side - Images */}
            <div className="book-images-section">
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#f5f7fa',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <img
                  src={mainImage}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.src = '/static/css/profile_pic.png';
                    e.target.onerror = null;
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
                  gap: '12px'
                }}>
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedImage === index ? '3px solid #29bccf' : '2px solid #e0e0e0',
                        padding: 0,
                        cursor: 'pointer',
                        background: 'transparent',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== index) {
                          e.currentTarget.style.borderColor = '#29bccf';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedImage !== index) {
                          e.currentTarget.style.borderColor = '#e0e0e0';
                        }
                      }}
                    >
                      <img
                        src={img || '/static/css/profile_pic.png'}
                        alt={`${book.title} view ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.src = '/static/css/profile_pic.png';
                          e.target.onerror = null;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="book-details-section">
              <h1 style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#2c3e50',
                margin: '0 0 20px 0',
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.3
              }}>
                {book.title}
              </h1>

              <div style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#29bccf',
                marginBottom: '30px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                ₹{book.price}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fas fa-user" style={{ color: '#29bccf', width: '20px' }}></i>
                  <span style={{ fontSize: '16px', color: '#34495e', fontWeight: 500 }}>
                    <strong>Author:</strong> {book.author}
                  </span>
                </div>

                {book.genre && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-tag" style={{ color: '#29bccf', width: '20px' }}></i>
                    <span style={{ fontSize: '16px', color: '#34495e', fontWeight: 500 }}>
                      <strong>Genre:</strong> {book.genre}
                    </span>
                  </div>
                )}

                {book.year_of_publication && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-calendar" style={{ color: '#29bccf', width: '20px' }}></i>
                    <span style={{ fontSize: '16px', color: '#34495e', fontWeight: 500 }}>
                      <strong>Year:</strong> {book.year_of_publication}
                    </span>
                  </div>
                )}

                {book.ISBN && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-barcode" style={{ color: '#29bccf', width: '20px' }}></i>
                    <span style={{ fontSize: '16px', color: '#34495e', fontWeight: 500 }}>
                      <strong>ISBN:</strong> {book.ISBN}
                    </span>
                  </div>
                )}

                {book.age_of_book && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-clock" style={{ color: '#29bccf', width: '20px' }}></i>
                    <span style={{ fontSize: '16px', color: '#34495e', fontWeight: 500 }}>
                      <strong>Age:</strong> {book.age_of_book} years
                    </span>
                  </div>
                )}

                {book.date_of_post && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#29bccf', width: '20px' }}></i>
                    <span style={{ fontSize: '16px', color: '#34495e', fontWeight: 500 }}>
                      <strong>Posted:</strong> {new Date(book.date_of_post).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {book.description && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#2c3e50',
                    marginBottom: '12px',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    Description
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#666',
                    lineHeight: 1.6,
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {book.description}
                  </p>
                </div>
              )}

              {/* Seller Info */}
              {book.seller_user_name && user && user.user_name !== book.seller_user_name && (
                <div style={{
                  marginBottom: '30px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#2c3e50',
                    marginBottom: '12px',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    Seller
                  </h3>
                  <Link
                    to={`/ratings_reviews?id=${book.seller_user_name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <img
                      src="/static/css/profile_pic.png"
                      alt="Seller"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #29bccf'
                      }}
                      onError={(e) => {
                        e.target.src = '/static/css/profile_pic.png';
                        e.target.onerror = null;
                      }}
                    />
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#29bccf',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {book.seller_user_name}
                    </span>
                  </Link>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {user && user.user_name !== book.seller_user_name && (
                  <>
                    {inWishlist ? (
                      <button
                        onClick={handleRemoveFromWishlist}
                        style={{
                          flex: 1,
                          minWidth: '200px',
                          padding: '14px 28px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif",
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                      >
                        <i className="fas fa-heart"></i>
                        Remove from Wishlist
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToWishlist}
                        style={{
                          flex: 1,
                          minWidth: '200px',
                          padding: '14px 28px',
                          backgroundColor: '#29bccf',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif",
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1fa8bb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#29bccf'}
                      >
                        <i className="far fa-heart"></i>
                        Add to Wishlist
                      </button>
                    )}
                    <Link
                      to={`/request_offer/${bookId}`}
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '14px 28px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                      <i className="fas fa-hand-holding-usd"></i>
                      Make an Offer
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Book;

