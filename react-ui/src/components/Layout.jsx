import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Layout = ({ user, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <div 
        className="menu-bar"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: '60px',
          backgroundColor: 'rgb(182, 176, 174)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 20
        }}
      >
        <Link 
          className="logo" 
          to="/"
          style={{
            width: '20%',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img src="/static/images/logo.png" alt="Grabook logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Link>

        <span 
          className="menu"
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0'
          }}
        >
          <span 
            className="home-title"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}
          >
            <Link 
              to="/"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'black'
              }}
            >
              <div className="text">Home</div>
            </Link>
          </span>

          <span 
            className="buy-title"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}
          >
            <Link 
              to="/grab_book"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'black'
              }}
            >
              <div className="text">Grab A Book</div>
            </Link>
          </span>

          <span 
            className="sell-title"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}
          >
            <Link 
              to="/book_upload"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'black'
              }}
            >
              <div className="text">Sell</div>
            </Link>
          </span>
        </span>

        <div 
          className="login"
          style={{
            width: '20%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
          }}
        >
          {user ? (
            <div 
              ref={dropdownRef}
              className="dropdown" 
              style={{ 
                position: 'relative',
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button 
                className="dropbtn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ 
                  width: '100%', 
                  height: '60px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '10px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '0 10px'
                }}
              >
                <img
                  className="rounded-circle"
                  src={
                    user.profile_pic 
                      ? (user.profile_pic.startsWith('http') 
                          ? user.profile_pic 
                          : user.profile_pic.startsWith('/') 
                            ? user.profile_pic 
                            : `/static/${user.profile_pic}`)
                      : '/static/css/profile_pic.png'
                  }
                  alt="Profile"
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #fff',
                    display: 'block',
                    backgroundColor: '#ddd',
                    flexShrink: 0
                  }}
                  onError={(e) => {
                    if (e.target.src !== '/static/css/profile_pic.png') {
                      e.target.src = '/static/css/profile_pic.png';
                    }
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
                <i
                  className="fa fa-caret-down"
                  style={{ 
                    fontSize: '16px',
                    color: 'black',
                    transition: 'transform 0.3s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              <div 
                className="dropdown-content"
                style={{
                  display: dropdownOpen ? 'block' : 'none',
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'white',
                  minWidth: '200px',
                  boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                  zIndex: 1000,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginTop: '5px',
                  animation: dropdownOpen ? 'fadeIn 0.2s ease-in' : 'none'
                }}
              >
                <Link 
                  to="/profile"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontFamily: "'Chakra Petch', sans-serif",
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Profile
                </Link>
                <Link 
                  to="/books_in_ad"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontFamily: "'Chakra Petch', sans-serif",
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Books Posted
                </Link>
                <Link 
                  to="/books_sold"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontFamily: "'Chakra Petch', sans-serif",
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Books Sold
                </Link>
                <Link 
                  to="/books_bought"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontFamily: "'Chakra Petch', sans-serif",
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Books Bought
                </Link>
                <Link 
                  to="/wishlist"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontFamily: "'Chakra Petch', sans-serif",
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Wishlist
                </Link>
                <a 
                  href="/api/logout"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                      window.location.href = '/';
                    } catch (err) {
                      console.error('Logout error:', err);
                      window.location.href = '/';
                    }
                  }}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontFamily: "'Chakra Petch', sans-serif",
                    transition: 'background-color 0.3s',
                    borderTop: '1px solid #eee'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Logout
                </a>
              </div>
            </div>
          ) : (
            <div 
              className="login-button"
              style={{
                width: '70%',
                backgroundColor: 'rgb(0, 163, 232)',
                height: '60px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Link 
                to="/signin"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: 'black'
                }}
              >
                <div className="text">Get Started</div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {children}
    </>
  );
};

export default Layout;

