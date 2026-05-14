const router     = require('express').Router()
const ctrl       = require('../controllers/authController')
const { requireAuth } = require('../middleware/auth')

router.post('/register', ctrl.register)           // POST /api/auth/register
router.post('/login',    ctrl.login)              // POST /api/auth/login
router.get('/me',        requireAuth, ctrl.getMe) // GET  /api/auth/me

module.exports = router
