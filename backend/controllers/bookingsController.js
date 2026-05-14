const db      = require('../services/jsonDb')
const paths   = require('../config/paths')
const Booking = require('../models/Booking')
const { ok, created, fail, notFound } = require('../utils/response')

function genCode() {
  return 'MHQ-' + Date.now().toString(36).toUpperCase()
}

// GET /api/bookings  — all bookings for the logged-in user
function getAll(req, res) {
  const bookings = db.findWhere(paths.BOOKINGS, b => b.userId === req.user.id)
  ok(res, bookings)
}

// GET /api/bookings/:id
function getOne(req, res) {
  const booking = db.findById(paths.BOOKINGS, req.params.id)
  if (!booking)               return notFound(res, 'Booking not found')
  if (booking.userId !== req.user.id && req.user.role !== 'admin')
    return fail(res, 'Not authorized', 403)

  ok(res, booking)
}

// POST /api/bookings
function create(req, res) {
  const errors = Booking.validate(req.body)
  if (errors.length) return fail(res, errors.join(', '))

  // Verify animal exists
  const animal = db.findById(paths.ANIMALS, req.body.animalId)
  if (!animal) return notFound(res, `Animal "${req.body.animalId}" not found`)

  if (animal.status === 'PROTECTED') {
    return fail(res, `${animal.name} is a protected species and cannot be booked`)
  }

  const newBooking = db.create(paths.BOOKINGS, {
    userId:      req.user.id,
    userName:    req.user.email,
    animalId:    req.body.animalId,
    animalName:  animal.name,
    region:      req.body.region   || animal.region,
    date:        req.body.date,
    people:      Number(req.body.people) || 1,
    guide:       req.body.guide    || false,
    notes:       req.body.notes    || '',
    total:       Number(req.body.total),
    status:      'PENDING',
    paymentCode: genCode(),
  })

  created(res, newBooking)
}

// PUT /api/bookings/:id  — update status (admin) or cancel (user)
function update(req, res) {
  const booking = db.findById(paths.BOOKINGS, req.params.id)
  if (!booking) return notFound(res, 'Booking not found')

  // Users can only cancel their own bookings
  if (req.user.role !== 'admin') {
    if (booking.userId !== req.user.id) return fail(res, 'Not authorized', 403)
    if (req.body.status && req.body.status !== 'CANCELLED')
      return fail(res, 'Users can only cancel bookings', 403)
  }

  const updated = db.updateById(paths.BOOKINGS, req.params.id, {
    status: req.body.status || booking.status,
    notes:  req.body.notes  || booking.notes,
  })

  ok(res, updated)
}

// DELETE /api/bookings/:id  — admin only
function remove(req, res) {
  if (req.user.role !== 'admin') return fail(res, 'Admin only', 403)

  const booking = db.findById(paths.BOOKINGS, req.params.id)
  if (!booking) return notFound(res, 'Booking not found')

  db.removeById(paths.BOOKINGS, req.params.id)
  ok(res, { message: 'Booking deleted' })
}

module.exports = { getAll, getOne, create, update, remove }
