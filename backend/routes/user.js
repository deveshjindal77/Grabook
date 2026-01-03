const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../server');
const { isAuthAPI } = require('../middleware/auth');

// Edit Profile API
router.post('/edit_profile', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_name = req.session.user_info.user_name;
  const { first_name, last_name, occupation, university_name, email_id, bio, phone_number, age } = req.body;

  // Validate required fields
  if (!first_name || !email_id || !phone_number) {
    return res.status(400).json({ error: 'First name, email, and phone number are required' });
  }

  connection.query(
    "UPDATE user SET first_name = ?, last_name = ?, occupation = ?, university_name = ?, email_id = ?, bio = ?, phone_number = ?, age = ? WHERE user_name = ?",
    [first_name, last_name || null, occupation || null, university_name || null, email_id, bio || null, phone_number, age || null, user_name],
    (err, results) => {
      if (err) {
        console.error('Database error during profile update:', err);
        return res.status(500).json({ error: 'Failed to update profile: ' + err.message });
      }

      // Fetch updated user data
      connection.query(
        "SELECT * FROM user WHERE user_name = ?",
        [user_name],
        (err, userResults) => {
          if (err || userResults.length === 0) {
            return res.status(500).json({ error: 'Profile updated but failed to fetch updated data' });
          }

          // Update session with new user info
          req.session.user_info = userResults[0];
          res.json({ user: userResults[0], success: true, message: 'Profile updated successfully' });
        }
      );
    }
  );
});

// Profile Picture Upload API
router.post('/profile_upload', isAuthAPI, (req, res) => {
  if (!req.session.user_info) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.files || !req.files.myfile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const user = req.session.user_info;
  const file = req.files.myfile;
  const fs = require('fs');
  const profilepicsDir = path.join(__dirname, '..', 'static', 'profilepics');

  // Ensure profilepics directory exists
  if (!fs.existsSync(profilepicsDir)) {
    fs.mkdirSync(profilepicsDir, { recursive: true });
  }

  // Use original naming convention: /static/profilepics/{user_name}.jpeg
  const fileName = `${user.user_name}.jpeg`;
  const filePath = path.join(profilepicsDir, fileName);
  const dbPath = `/static/profilepics/${fileName}`;

  file.mv(filePath, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload profile picture: ' + err.message });
    }

    // Update database
    connection.query(
      "UPDATE user SET profile_pic = ? WHERE user_name = ?",
      [dbPath, user.user_name],
      (err, results) => {
        if (err) {
          console.error('Database error during profile picture update:', err);
          return res.status(500).json({ error: 'Failed to update profile picture in database: ' + err.message });
        }

        // Update session
        connection.query(
          "SELECT * FROM user WHERE user_name = ?",
          [user.user_name],
          (err, userResults) => {
            if (err || userResults.length === 0) {
              return res.status(500).json({ error: 'Profile picture uploaded but failed to fetch updated data' });
            }

            req.session.user_info = userResults[0];
            res.json({ user: userResults[0], success: true, message: 'Profile picture uploaded successfully' });
          }
        );
      }
    );
  });
});

module.exports = router;

