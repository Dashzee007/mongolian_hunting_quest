const router     = require('express').Router()
const ctrl       = require('../controllers/bookingsController')
const { requireAuth } = require('../middleware/auth')

// All booking routes require a logged-in user
router.get('/',      requireAuth, ctrl.getAll)   // GET    /api/bookings
router.get('/:id',   requireAuth, ctrl.getOne)   // GET    /api/bookings/:id
router.post('/',     requireAuth, ctrl.create)   // POST   /api/bookings
router.put('/:id',   requireAuth, ctrl.update)   // PUT    /api/bookings/:id
router.delete('/:id',requireAuth, ctrl.remove)   // DELETE /api/bookings/:id

module.exports = router
