// Authentication middleware

// For API routes (returns JSON instead of redirecting)
const isAuthAPI = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// For regular routes (redirects to home)
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  isAuth,
  isAuthAPI
};

