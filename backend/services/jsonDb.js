// jsonDb.js — the entire database abstraction layer.
//
// This is the ONLY place that reads/writes JSON files.
// Controllers never touch fs directly — they call this service.
//
// MongoDB migration: replace findAll/findById/create/update/remove
// with Mongoose equivalents. Controllers stay UNCHANGED.

const fs   = require('fs')
const { v4: uuidv4 } = require('uuid')

function readFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Read operations ──────────────────────────────────────────

function findAll(filePath) {
  return readFile(filePath)
}

function findById(filePath, id) {
  const items = readFile(filePath)
  return items.find(item => item.id === id) || null
}

function findOne(filePath, predicate) {
  const items = readFile(filePath)
  return items.find(predicate) || null
}

function findWhere(filePath, predicate) {
  const items = readFile(filePath)
  return items.filter(predicate)
}

// ── Write operations ─────────────────────────────────────────

function create(filePath, data) {
  const items = readFile(filePath)
  const newItem = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  items.push(newItem)
  writeFile(filePath, items)
  return newItem
}

function updateById(filePath, id, updates) {
  const items = readFile(filePath)
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return null

  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
  writeFile(filePath, items)
  return items[index]
}

function removeById(filePath, id) {
  const items = readFile(filePath)
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  writeFile(filePath, items)
  return true
}

module.exports = {
  findAll, findById, findOne, findWhere,
  create, updateById, removeById,
}
