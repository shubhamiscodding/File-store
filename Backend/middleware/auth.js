const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Middleware to protect routes
const requireAuth = ClerkExpressRequireAuth();

module.exports = requireAuth;
