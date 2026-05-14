const jwt = require('jsonwebtoken')

// Protects routes that require a logged-in user.
// Usage: router.post('/bookings', requireAuth, controller)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // { id, email, role }
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

// Optional auth — attaches user if token present, but doesn't block
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    } catch {
      // token invalid — proceed as guest
    }
  }
  next()
}

module.exports = { requireAuth, optionalAuth }
