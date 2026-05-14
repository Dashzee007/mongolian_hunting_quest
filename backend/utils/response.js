// Standard API response helpers.
// Every endpoint uses these so the response shape is always consistent.

const ok = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data })

const created = (res, data) =>
  res.status(201).json({ success: true, data })

const fail = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message })

const notFound = (res, message = 'Not found') =>
  res.status(404).json({ success: false, message })

const serverError = (res, message = 'Internal server error') =>
  res.status(500).json({ success: false, message })

module.exports = { ok, created, fail, notFound, serverError }
