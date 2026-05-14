require('dotenv').config()

const express      = require('express')
const cors         = require('cors')

const animalsRoutes    = require('./routes/animalsRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const authRoutes       = require('./routes/authRoutes')
const bookingsRoutes   = require('./routes/bookingsRoutes')

const notFound     = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 4000

// ── Middleware ───────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mongolian Hunting Quest API is running',
    version: '1.0.0',
    env:     process.env.NODE_ENV,
  })
})

// ── Routes ───────────────────────────────────────────────────
app.use('/api/animals',    animalsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/auth',       authRoutes)
app.use('/api/bookings',   bookingsRoutes)

// ── Error handling (must be last) ────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🦌  Mongolian Hunting Quest API')
  console.log(`🚀  Server:  http://localhost:${PORT}`)
  console.log(`📋  Health:  http://localhost:${PORT}/api/health`)
  console.log(`🐾  Animals: http://localhost:${PORT}/api/animals\n`)
})
