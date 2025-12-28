const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../server');
const { isAuthAPI } = require('../middleware/auth');

// Get all books for sale (excluding user's own books)
router.get('/books', isAuthAPI, (req, res) => {
  let user = req.session.user_info;
  connection.query(
    "SELECT * FROM book WHERE seller_user_name != ? AND book_status = 'sale'",
    [user.user_name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ books: results });
    }
  );
});

// Search books
router.post('/search', (req, res) => {
  let key = req.body.keyword;
  if (!key) {
    return res.status(400).json({ error: 'Keyword is required' });
  }
  
  connection.query(
    "SELECT * FROM book WHERE (title REGEXP ? OR author REGEXP ? OR publication_name REGEXP ?) AND book_status = 'sale'",
    [key, key, key],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ books: results });
    }
  );
});

// Get single book by ID (public endpoint - no auth required)
router.get('/book/:id', (req, res) => {
  let book_id = req.params.id;
  connection.query(
    "SELECT * FROM book WHERE book_id = ?",
    [book_id],
    (err, results) => {
      if (err) {
        console.error('Database error fetching book:', err);
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ book: results[0] });
    }
  );
});

// Book Upload API
router.post('/book_upload', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = req.session.user_info;
  const book_data = req.body;
  
  // Validate required fields
  if (!book_data.title || !book_data.author || !book_data.genre || !book_data.price) {
    return res.status(400).json({ error: 'Title, author, genre, and price are required' });
  }

  const fs = require('fs');
  const bookpicsDir = path.join(__dirname, '..', 'static', 'bookpics');
  
  // Ensure bookpics directory exists
  if (!fs.existsSync(bookpicsDir)) {
    fs.mkdirSync(bookpicsDir, { recursive: true });
  }

  // Get next book_id using books_count table
  connection.query("SELECT * FROM books_count", (err, results) => {
    if (err) {
      console.error('Error getting book count:', err);
      return res.status(500).json({ error: 'Failed to get book ID' });
    }
    
    let book_id = results.length;
    book_id = book_id + 1;

    // Handle image uploads
    const image1 = req.files && req.files.myimage1;
    const image2 = req.files && req.files.myimage2;
    const image3 = req.files && req.files.myimage3;
    const image4 = req.files && req.files.myimage4;

    // Use original path structure: /static/bookpics/{book_id}_{number}.jpeg
    let path1 = "/static/bookpics/" + book_id + "_" + 1 + ".jpeg";
    let path2 = "/static/bookpics/" + book_id + "_" + 2 + ".jpeg";
    let path3 = "/static/bookpics/" + book_id + "_" + 3 + ".jpeg";
    let path4 = "/static/bookpics/" + book_id + "_" + 4 + ".jpeg";

    // Move uploaded images (only if they exist)
    let uploadPromises = [];

    if (image1) {
      uploadPromises.push(
        new Promise((resolve, reject) => {
          image1.mv(path.join(__dirname, '..', 'static', 'bookpics', `${book_id}_1.jpeg`), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    }

    if (image2) {
      uploadPromises.push(
        new Promise((resolve, reject) => {
          image2.mv(path.join(__dirname, '..', 'static', 'bookpics', `${book_id}_2.jpeg`), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    }

    if (image3) {
      uploadPromises.push(
        new Promise((resolve, reject) => {
          image3.mv(path.join(__dirname, '..', 'static', 'bookpics', `${book_id}_3.jpeg`), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    }

    if (image4) {
      uploadPromises.push(
        new Promise((resolve, reject) => {
          image4.mv(path.join(__dirname, '..', 'static', 'bookpics', `${book_id}_4.jpeg`), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    }

    // Wait for all uploads to complete, then insert into database
    Promise.all(uploadPromises)
      .then(() => {
        // Insert book into database
        connection.query(
          "INSERT INTO book(title, author, description, age_of_book, genre, ISBN, price, year_of_publication, image_1, image_2, image_3, image_4, seller_user_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            book_data.title,
            book_data.author,
            book_data.description || null,
            book_data.age || null,
            book_data.genre,
            book_data.ISBN || null,
            book_data.price,
            book_data.year_of_publication || null,
            image1 ? path1 : null,
            image2 ? path2 : null,
            image3 ? path3 : null,
            image4 ? path4 : null,
            user.user_name
          ],
          (err, results) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to upload book: ' + err.message });
            }
            
            // Insert into books_count table
            connection.query("INSERT INTO books_count VALUES ()", (err) => {
              if (err) {
                console.error('Error updating books_count:', err);
                // Don't fail the request if this fails
              }
            });

            console.log("book added!");
            res.json({ 
              success: true, 
              message: 'Book uploaded successfully',
              book_id: results.insertId 
            });
          }
        );
      })
      .catch((uploadErr) => {
        console.error('File upload error:', uploadErr);
        return res.status(500).json({ error: 'Failed to upload images: ' + uploadErr.message });
      });
  });
});

// Request Offer API
router.post('/request_offer/:id', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = req.session.user_info;
  const book_id = req.params.id;
  const { offer_price, offer_description } = req.body;

  // Validate required fields
  if (!offer_price || !offer_description) {
    return res.status(400).json({ error: 'Offer price and description are required' });
  }

  // Check if offer_price is a valid number
  const price = parseFloat(offer_price);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Please enter a valid offer price' });
  }

  // Insert offer into buy table
  connection.query(
    "INSERT INTO buy (book_id, offer_price, offer_description, buyer_user_name) VALUES (?, ?, ?, ?)",
    [book_id, price, offer_description, user.user_name],
    (err, results) => {
      if (err) {
        console.error('Database error inserting offer:', err);
        return res.status(500).json({ error: 'Failed to submit offer: ' + err.message });
      }
      res.json({ success: true, message: 'Request sent successfully' });
    }
  );
});

// Get Books Sold API
router.get('/books_sold', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;

  connection.query(
    "SELECT * FROM book WHERE seller_user_name = ? AND book_status = 'sold'",
    [user_name],
    (err, results) => {
      if (err) {
        console.error('Database error fetching books sold:', err);
        return res.status(500).json({ error: 'Failed to fetch books sold: ' + err.message });
      }
      res.json({ books: results });
    }
  );
});

// Get Books Bought API
router.get('/books_bought', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;

  connection.query(
    "SELECT * FROM book WHERE book_id IN (SELECT book_id FROM buy WHERE buyer_user_name = ?)",
    [user_name],
    (err, results) => {
      if (err) {
        console.error('Database error fetching books bought:', err);
        return res.status(500).json({ error: 'Failed to fetch books bought: ' + err.message });
      }
      res.json({ books: results });
    }
  );
});

// Get Books In Ad API (books posted for sale by the user)
router.get('/books_in_ad', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;

  connection.query(
    "SELECT * FROM book WHERE seller_user_name = ? AND book_status = 'sale'",
    [user_name],
    (err, results) => {
      if (err) {
        console.error('Database error fetching books in ad:', err);
        return res.status(500).json({ error: 'Failed to fetch books in ad: ' + err.message });
      }
      res.json({ books: results });
    }
  );
});

// Remove from Ad API
router.get('/remove_from_ad', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = req.session.user_info;
  const book_id = req.query.id;

  if (!book_id) {
    return res.status(400).json({ error: 'Book ID is required' });
  }

  // Delete the book (only if user is the seller)
  connection.query(
    "DELETE FROM book WHERE book_id = ? AND seller_user_name = ?",
    [book_id, user.user_name],
    (err, results) => {
      if (err) {
        console.error('Database error removing from ad:', err);
        return res.status(500).json({ error: 'Failed to remove book from ad: ' + err.message });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found or you are not the seller' });
      }

      res.json({ success: true, message: 'Book removed from sale successfully' });
    }
  );
});

// Get Requests API (purchase requests for a book)
router.get('/requests', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const book_id = req.query.id;
  if (!book_id) {
    return res.status(400).json({ error: 'Book ID is required' });
  }

  // Get requests for this book that are not yet accepted
  connection.query(
    "SELECT * FROM buy WHERE book_id = ? AND acceptance_status = 'not accepted'",
    [book_id],
    (err, results) => {
      if (err) {
        console.error('Database error fetching requests:', err);
        return res.status(500).json({ error: 'Failed to fetch requests: ' + err.message });
      }
      res.json({ requests: results });
    }
  );
});

// Accept Request API
router.post('/accept_request/:id/:buyer', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = req.session.user_info;
  const book_id = req.params.id;
  const buyer = req.params.buyer;

  // First, update the book status to 'sold'
  connection.query(
    "UPDATE book SET book_status = 'sold' WHERE book_id = ? AND seller_user_name = ?",
    [book_id, user.user_name],
    (err, results) => {
      if (err) {
        console.error('Database error updating book status:', err);
        return res.status(500).json({ error: 'Failed to update book status: ' + err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found or you are not the seller' });
      }

      // Then, update the buy record to accepted
      connection.query(
        "UPDATE buy SET acceptance_status = 'accepted' WHERE book_id = ? AND buyer_user_name = ?",
        [book_id, buyer],
        (err, results) => {
          if (err) {
            console.error('Database error accepting request:', err);
            return res.status(500).json({ error: 'Failed to accept request: ' + err.message });
          }

          res.json({ success: true, message: 'Request accepted successfully' });
        }
      );
    }
  );
});

// Reject Request API
router.post('/reject_request/:id/:buyer', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = req.session.user_info;
  const book_id = req.params.id;
  const buyer = req.params.buyer;

  // Delete the buy record (rejecting the request)
  connection.query(
    "DELETE FROM buy WHERE book_id = ? AND buyer_user_name = ?",
    [book_id, buyer],
    (err, results) => {
      if (err) {
        console.error('Database error rejecting request:', err);
        return res.status(500).json({ error: 'Failed to reject request: ' + err.message });
      }

      res.json({ success: true, message: 'Request rejected successfully' });
    }
  );
});

module.exports = router;

