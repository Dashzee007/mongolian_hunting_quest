// Booking model — shape definition and validation.
// MongoDB migration: convert to Mongoose Schema with ref to User and Animal.

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

function validate(data) {
  const errors = []
  if (!data.animalId)   errors.push('animalId is required')
  if (!data.animalName) errors.push('animalName is required')
  if (!data.date)       errors.push('date is required')
  if (!data.total)      errors.push('total is required')
  if (isNaN(Number(data.total)) || Number(data.total) <= 0) errors.push('total must be a positive number')
  return errors
}

module.exports = { validate, STATUSES }
