import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/common/Home";
import BookUpload from "./pages/book/BookUpload";
import GrabBookPage from "./pages/book/GrabBookPage";
import Book from "./pages/book/Book";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import Profile from "./pages/profile/Profile";
import EditProfilePage from "./pages/profile/EditProfilePage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import RequestOfferPage from "./pages/requests/RequestOfferPage";
import BooksSoldPage from "./pages/book/BooksSoldPage";
import BooksBoughtPage from "./pages/book/BooksBoughtPage";
import BooksInAdPage from "./pages/book/BooksInAdPage";
import RequestsPage from "./pages/requests/RequestsPage";
// Import other pages as needed

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user session from backend
    fetch('/api/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/grab_book" element={<GrabBookPage user={user} />} />
      <Route path="/book" element={<Book user={user} />} />
      <Route path="/book_upload" element={<BookUpload user={user} />} />
      <Route path="/signin" element={<SignInPage user={user} setUser={setUser} />} />
      <Route path="/signup" element={<SignUpPage user={user} setUser={setUser} />} />
      <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
      <Route path="/edit_profile" element={<EditProfilePage user={user} setUser={setUser} />} />
      <Route path="/wishlist" element={<WishlistPage user={user} />} />
      <Route path="/request_offer/:id" element={<RequestOfferPage user={user} />} />
      <Route path="/books_sold" element={<BooksSoldPage user={user} />} />
      <Route path="/books_bought" element={<BooksBoughtPage user={user} />} />
      <Route path="/books_in_ad" element={<BooksInAdPage user={user} />} />
      <Route path="/requests" element={<RequestsPage user={user} />} />
      {/* Add more routes as you complete the pages */}
    </Routes>
  );
}
