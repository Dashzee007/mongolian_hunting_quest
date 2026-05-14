// Animal model — defines the shape of an animal document.
// Currently used for validation only.
// MongoDB migration: convert this to a Mongoose Schema.
//
// const mongoose = require('mongoose')
// const AnimalSchema = new mongoose.Schema({ ...fields })
// module.exports = mongoose.model('Animal', AnimalSchema)

const ANIMAL_TYPES = ['Хөхтөн', 'Шувуу', 'Холимог идэшт']
const STATUSES     = ['ACTIVE', 'PROTECTED', 'ENDANGERED']

function validate(data) {
  const errors = []
  if (!data.name)        errors.push('name is required')
  if (!data.region)      errors.push('region is required')
  if (!data.type)        errors.push('type is required')
  if (!ANIMAL_TYPES.includes(data.type)) errors.push(`type must be one of: ${ANIMAL_TYPES.join(', ')}`)
  if (data.status && !STATUSES.includes(data.status)) errors.push(`status must be one of: ${STATUSES.join(', ')}`)
  return errors
}

module.exports = { validate, ANIMAL_TYPES, STATUSES }
