// Catches any request that didn't match a route
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  })
}

module.exports = notFound
