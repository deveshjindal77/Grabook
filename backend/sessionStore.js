const mysql = require('mysql2/promise');
const EventEmitter = require('events');
require('dotenv').config();

class MySQL2SessionStore extends EventEmitter {
  constructor() {
    super();
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'ecommerce',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '07022003',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Create sessions table if it doesn't exist
    this.init();
  }

  async init() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL PRIMARY KEY,
          expires BIGINT UNSIGNED NOT NULL,
          data MEDIUMTEXT COLLATE utf8mb4_bin,
          INDEX expires (expires)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
      `);
      console.log('✅ Sessions table ready');
    } catch (err) {
      console.error('Error creating sessions table:', err);
    }
  }

  get(sessionId, callback) {
    if (!callback || typeof callback !== 'function') {
      return;
    }
    
    const now = Math.floor(Date.now() / 1000); // Convert to seconds
    this.pool.query(
      'SELECT data FROM sessions WHERE session_id = ? AND expires > ?',
      [sessionId, now]
    )
    .then(([rows]) => {
      if (!rows || rows.length === 0 || !rows[0] || !rows[0].data) {
        return callback(null, null);
      }
      
      try {
        const data = JSON.parse(rows[0].data);
        
        // Validate and fix session data structure
        if (!data || typeof data !== 'object') {
          return callback(null, null);
        }
        
        // Ensure cookie property exists with proper structure
        if (!data.cookie || typeof data.cookie !== 'object') {
          data.cookie = {
            originalMaxAge: null,
            expires: null,
            httpOnly: true,
            path: '/',
            sameSite: null
          };
        }
        
        // Ensure other required properties
        if (data.cookie && !data.cookie.path) {
          data.cookie.path = '/';
        }
        if (data.cookie && data.cookie.httpOnly === undefined) {
          data.cookie.httpOnly = true;
        }
        
        callback(null, data);
      } catch (parseErr) {
        console.error('Error parsing session data:', parseErr);
        // Delete corrupted session
        this.destroy(sessionId, () => {});
        callback(null, null);
      }
    })
    .catch(err => {
      console.error('Error getting session:', err);
      callback(err);
    });
  }

  set(sessionId, sessionData, callback) {
    // Convert expires to seconds (Unix timestamp)
    let expires;
    if (sessionData.cookie?.expires) {
      expires = Math.floor(new Date(sessionData.cookie.expires).getTime() / 1000);
    } else {
      // Default 24 hours in seconds
      expires = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    }
    
    const data = JSON.stringify(sessionData);
    
    this.pool.query(
      'INSERT INTO sessions (session_id, expires, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE expires = ?, data = ?',
      [sessionId, expires, data, expires, data]
    )
    .then(() => {
      callback(null);
    })
    .catch(err => {
      callback(err);
    });
  }

  destroy(sessionId, callback) {
    this.pool.query('DELETE FROM sessions WHERE session_id = ?', [sessionId])
      .then(() => {
        callback(null);
      })
      .catch(err => {
        callback(err);
      });
  }

  all(callback) {
    const now = Math.floor(Date.now() / 1000); // Convert to seconds
    this.pool.query('SELECT session_id FROM sessions WHERE expires > ?', [now])
      .then(([rows]) => {
        const sessionIds = rows.map(row => row.session_id);
        callback(null, sessionIds);
      })
      .catch(err => {
        callback(err);
      });
  }

  length(callback) {
    const now = Math.floor(Date.now() / 1000); // Convert to seconds
    this.pool.query('SELECT COUNT(*) as count FROM sessions WHERE expires > ?', [now])
      .then(([rows]) => {
        callback(null, rows[0].count);
      })
      .catch(err => {
        callback(err);
      });
  }

  clear(callback) {
    this.pool.query('DELETE FROM sessions')
      .then(() => {
        callback(null);
      })
      .catch(err => {
        callback(err);
      });
  }

  touch(sessionId, sessionData, callback) {
    // Convert expires to seconds (Unix timestamp)
    let expires;
    if (sessionData.cookie?.expires) {
      expires = Math.floor(new Date(sessionData.cookie.expires).getTime() / 1000);
    } else {
      // Default 24 hours in seconds
      expires = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    }
    
    this.pool.query('UPDATE sessions SET expires = ? WHERE session_id = ?', [expires, sessionId])
      .then(() => {
        callback(null);
      })
      .catch(err => {
        callback(err);
      });
  }

  // Required by newer versions of express-session
  createSession(req, session) {
    // This is called when creating a new session
    // We don't need to do anything special, just return the session
    return session;
  }
}

module.exports = MySQL2SessionStore;

