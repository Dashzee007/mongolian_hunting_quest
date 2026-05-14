// User model — shape definition and validation.
// MongoDB migration: convert to Mongoose Schema with bcrypt pre-save hook.

const ROLES = ['user', 'admin']

function validate(data) {
  const errors = []
  if (!data.name)     errors.push('name is required')
  if (!data.email)    errors.push('email is required')
  if (!data.password) errors.push('password is required')
  if (data.password && data.password.length < 6) errors.push('password must be at least 6 characters')
  if (!/\S+@\S+\.\S+/.test(data.email)) errors.push('email is invalid')
  return errors
}

module.exports = { validate, ROLES }
