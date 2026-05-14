const db    = require('../services/jsonDb')
const paths = require('../config/paths')
const { ok } = require('../utils/response')

// GET /api/categories
function getAll(req, res) {
  const categories = db.findAll(paths.CATEGORIES)
  ok(res, categories)
}

// GET /api/categories/:id/animals  — animals that belong to this category
function getAnimals(req, res) {
  const category = db.findById(paths.CATEGORIES, req.params.id)
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' })
  }

  const animals = db.findWhere(paths.ANIMALS, a => a.type === category.name)
  ok(res, { category, animals })
}

module.exports = { getAll, getAnimals }
