// Global error handler — catches any error passed via next(err)
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.url} —`, err.message)

  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
  })
}

module.exports = errorHandler
