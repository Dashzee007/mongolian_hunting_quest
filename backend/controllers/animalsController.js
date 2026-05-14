const db      = require('../services/jsonDb')
const paths   = require('../config/paths')
const Animal  = require('../models/Animal')
const { ok, created, fail, notFound } = require('../utils/response')

// GET /api/animals
function getAll(req, res) {
  const { type, region, status, search } = req.query
  let animals = db.findAll(paths.ANIMALS)

  if (type)   animals = animals.filter(a => a.type === type)
  if (region) animals = animals.filter(a => a.region === region)
  if (status) animals = animals.filter(a => a.status === status)
  if (search) animals = animals.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  ok(res, animals)
}

// GET /api/animals/:id
function getOne(req, res) {
  const animal = db.findById(paths.ANIMALS, req.params.id)
  if (!animal) return notFound(res, `Animal with id "${req.params.id}" not found`)
  ok(res, animal)
}

// POST /api/animals
function create(req, res) {
  const errors = Animal.validate(req.body)
  if (errors.length) return fail(res, errors.join(', '))

  const newAnimal = db.create(paths.ANIMALS, {
    name:        req.body.name,
    region:      req.body.region,
    type:        req.body.type,
    description: req.body.description || '',
    wikiTitle:   req.body.wikiTitle   || '',
    status:      req.body.status      || 'ACTIVE',
    basePrice:   Number(req.body.basePrice) || 0,
  })

  created(res, newAnimal)
}

// PUT /api/animals/:id
function update(req, res) {
  const existing = db.findById(paths.ANIMALS, req.params.id)
  if (!existing) return notFound(res, `Animal with id "${req.params.id}" not found`)

  const updated = db.updateById(paths.ANIMALS, req.params.id, req.body)
  ok(res, updated)
}

// DELETE /api/animals/:id
function remove(req, res) {
  const existing = db.findById(paths.ANIMALS, req.params.id)
  if (!existing) return notFound(res, `Animal with id "${req.params.id}" not found`)

  db.removeById(paths.ANIMALS, req.params.id)
  ok(res, { message: `Animal "${existing.name}" deleted` })
}

module.exports = { getAll, getOne, create, update, remove }
