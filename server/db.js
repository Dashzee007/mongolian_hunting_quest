const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           process.env.DB_NAME     || 'mongolian_hunting_quest',
    waitForConnections: true,
    connectionLimit:    10,
    charset:            'UTF8MB4_UNICODE_CI',
});

// Холболт бүрд SET NAMES utf8mb4 ажиллуулна
pool.on('connection', conn => conn.query("SET NAMES 'utf8mb4'"));

module.exports = pool;
