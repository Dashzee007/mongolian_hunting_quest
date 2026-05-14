const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const db      = require('../services/jsonDb')
const paths   = require('../config/paths')
const User    = require('../models/User')
const { ok, created, fail } = require('../utils/response')

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// POST /api/auth/register
async function register(req, res) {
  const errors = User.validate(req.body)
  if (errors.length) return fail(res, errors.join(', '))

  const { name, email, password } = req.body

  const existing = db.findOne(paths.USERS, u => u.email === email)
  if (existing) return fail(res, 'Email already registered')

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = db.create(paths.USERS, {
    name,
    email,
    passwordHash,
    role: 'user',
  })

  const token = signToken(newUser)

  created(res, {
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  })
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return fail(res, 'Email and password are required')

  const user = db.findOne(paths.USERS, u => u.email === email)
  if (!user) return fail(res, 'Invalid credentials', 401)

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return fail(res, 'Invalid credentials', 401)

  const token = signToken(user)

  ok(res, {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}

// GET /api/auth/me  (requires token)
function getMe(req, res) {
  const user = db.findById(paths.USERS, req.user.id)
  if (!user) return fail(res, 'User not found', 404)

  ok(res, { id: user.id, name: user.name, email: user.email, role: user.role })
}

module.exports = { register, login, getMe }
