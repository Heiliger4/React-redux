const { verifyToken } = require('@clerk/backend');

// Middleware to verify Clerk JWT token
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const payload = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
      issuer: process.env.CLERK_ISSUER_URL,
    });

    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.public_metadata?.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user has required role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check song ownership (owner or admin can access)
const checkSongOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Song = require('../models/songs');
    
    const song = await Song.findOne({ id });
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Admin can access any song
    if (req.auth.role === 'admin') {
      req.song = song;
      return next();
    }

    // User can only access their own songs
    if (song.ownerId === req.auth.userId) {
      req.song = song;
      return next();
    }

    return res.status(403).json({ error: 'Access denied: You can only modify your own songs' });
  } catch (error) {
    console.error('Ownership check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  requireAuth,
  authorizeRoles,
  checkSongOwnership
}; 