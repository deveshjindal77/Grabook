const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const session = require('express-session');

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

// CORS configuration for React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser
app.use(express.json());

// Static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// In production, serve React app static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../react-ui/dist')));
}

// Session configuration
// Temporarily use memory store - sessions will be lost on server restart
// TODO: Fix MySQL2 session store to work properly
const sessionStore = new session.MemoryStore();

app.use(
  session({
    secret: 'cookie_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// File upload middleware
app.use(fileUpload());

// URL encoded body parser
app.use(express.urlencoded({
  extended: true
}));

const port = process.env.PORT || 3000;

// ==================== ROUTES ====================

// Serve React app for root route
// In development, redirect to React dev server
// In production, serve the built React app
app.get('/', function (req, res) {
  if (process.env.NODE_ENV !== 'production') {
    return res.redirect('http://localhost:5173');
  }
  res.sendFile(path.join(__dirname, '../react-ui/dist/index.html'));
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', wishlistRoutes);

// Catch-all route for React Router - must be LAST, after all other routes
// This handles client-side routing and redirects non-API routes to React
app.get('*', function (req, res) {
  // Skip API routes and static files - these are handled above
  if (req.path.startsWith('/api') || req.path.startsWith('/static')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // In development, redirect to React dev server
  if (process.env.NODE_ENV !== 'production') {
    return res.redirect(`http://localhost:5173${req.path}`);
  }
  
  // In production, serve the built React app (React Router will handle routing)
  res.sendFile(path.join(__dirname, '../react-ui/dist/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
