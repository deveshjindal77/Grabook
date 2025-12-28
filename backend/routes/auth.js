const express = require('express');
const router = express.Router();
const connection = require('../server');
const { isAuthAPI } = require('../middleware/auth');

// Get current user session
router.get('/user', (req, res) => {
  if (req.session.isAuth && req.session.user_info) {
    res.json({ user: req.session.user_info });
  } else {
    res.json({ user: null });
  }
});

// Login API
router.post('/signin', (req, res) => {
  let user_data = req.body;
  connection.query(
    "SELECT * FROM user WHERE email_id = ? AND password = MD5(?)",
    [user_data.email_id, user_data.password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      req.session.isAuth = true;
      req.session.user_info = results[0];
      res.json({ user: results[0], success: true });
    }
  );
});

// Signup API
router.post('/signup', (req, res) => {
  let user_data = req.body;
  
  // Validate required fields
  if (!user_data.user_name || !user_data.first_name || !user_data.email_id || 
      !user_data.phone_number || !user_data.password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if passwords match
  if (user_data.password !== user_data.cpassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Check if username already exists
  connection.query(
    "SELECT * FROM user WHERE user_name = ?",
    [user_data.user_name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Please try a different username' });
      }

      // Insert new user
      connection.query(
        "INSERT INTO user (user_name, first_name, last_name, email_id, phone_number, password) VALUES (?, ?, ?, ?, ?, MD5(?))",
        [
          user_data.user_name,
          user_data.first_name,
          user_data.last_name || null,
          user_data.email_id,
          user_data.phone_number,
          user_data.password
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Auto-login after signup
          connection.query(
            "SELECT * FROM user WHERE user_name = ?",
            [user_data.user_name],
            (err, userResults) => {
              if (err || userResults.length === 0) {
                return res.status(500).json({ error: 'User created but failed to login' });
              }
              
              req.session.isAuth = true;
              req.session.user_info = userResults[0];
              res.json({ user: userResults[0], success: true, message: 'Registered successfully' });
            }
          );
        }
      );
    }
  );
});

// Logout API
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true });
  });
});

module.exports = router;

