const express = require('express');
const router = express.Router();
const connection = require('../server');
const { isAuthAPI } = require('../middleware/auth');

// Get Wishlist API
router.get('/wishlist', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;

  connection.query(
    "SELECT * FROM book WHERE book_id IN (SELECT book_id FROM wishlist WHERE user_name = ?)",
    [user_name],
    (err, results) => {
      if (err) {
        console.error('Database error fetching wishlist:', err);
        return res.status(500).json({ error: 'Failed to fetch wishlist: ' + err.message });
      }
      res.json({ books: results });
    }
  );
});

// Add to Wishlist API
router.post('/add_to_wishlist/:id', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;
  const book_id = req.params.id;

  // Check if already in wishlist
  connection.query(
    "SELECT * FROM wishlist WHERE user_name = ? AND book_id = ?",
    [user_name, book_id],
    (err, results) => {
      if (err) {
        console.error('Database error checking wishlist:', err);
        return res.status(500).json({ error: 'Failed to check wishlist: ' + err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Book already in wishlist' });
      }

      // Add to wishlist
      connection.query(
        "INSERT INTO wishlist (user_name, book_id) VALUES (?, ?)",
        [user_name, book_id],
        (err, results) => {
          if (err) {
            console.error('Database error adding to wishlist:', err);
            return res.status(500).json({ error: 'Failed to add to wishlist: ' + err.message });
          }
          res.json({ success: true, message: 'Book added to wishlist' });
        }
      );
    }
  );
});

// Remove from Wishlist API
router.post('/remove_from_wishlist/:id', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;
  const book_id = req.params.id;

  connection.query(
    "DELETE FROM wishlist WHERE book_id = ? AND user_name = ?",
    [book_id, user_name],
    (err, results) => {
      if (err) {
        console.error('Database error removing from wishlist:', err);
        return res.status(500).json({ error: 'Failed to remove from wishlist: ' + err.message });
      }
      res.json({ success: true, message: 'Book removed from wishlist' });
    }
  );
});

module.exports = router;

