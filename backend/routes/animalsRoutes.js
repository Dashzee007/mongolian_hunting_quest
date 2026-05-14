const router     = require('express').Router()
const ctrl       = require('../controllers/animalsController')
const { requireAuth } = require('../middleware/auth')

// Public — anyone can browse animals
router.get('/',    ctrl.getAll)   // GET  /api/animals?type=Хөхтөн&region=Алтай
router.get('/:id', ctrl.getOne)   // GET  /api/animals/a01

// Protected — requires login
router.post('/',    requireAuth, ctrl.create)    // POST   /api/animals
router.put('/:id',  requireAuth, ctrl.update)    // PUT    /api/animals/a01
router.delete('/:id', requireAuth, ctrl.remove)  // DELETE /api/animals/a01

module.exports = router
