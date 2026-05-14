const path = require('path')

// All JSON data file paths live here.
// When migrating to MongoDB, delete this file and add config/db.js instead.
const DATA_DIR = path.join(__dirname, '..', 'data')

module.exports = {
  ANIMALS:    path.join(DATA_DIR, 'animals.json'),
  USERS:      path.join(DATA_DIR, 'users.json'),
  BOOKINGS:   path.join(DATA_DIR, 'bookings.json'),
  CATEGORIES: path.join(DATA_DIR, 'categories.json'),
  LAWS:       path.join(DATA_DIR, 'laws.json'),
}
