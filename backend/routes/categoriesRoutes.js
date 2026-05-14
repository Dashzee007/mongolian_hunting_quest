const router = require('express').Router()
const ctrl   = require('../controllers/categoriesController')

router.get('/',             ctrl.getAll)      // GET /api/categories
router.get('/:id/animals',  ctrl.getAnimals)  // GET /api/categories/cat_1/animals

module.exports = router
