const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../db');

const SECRET = process.env.JWT_SECRET || 'mhq_jwt_secret_2026';

function makeToken(user) {
    return jwt.sign(
        { id: user.user_id, username: user.name, email: user.email, role: 'user' },
        SECRET,
        { expiresIn: '7d' }
    );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ error: 'Бүх талбарыг бөглөнө үү' });

    try {
        const [existing] = await pool.query(
            'SELECT user_id FROM users WHERE email = ? OR name = ?', [email, username]
        );
        if (existing.length)
            return res.status(409).json({ error: 'Энэ имэйл эсвэл нэр аль хэдийн бүртгэгдсэн' });

        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hash]
        );

        const user = { user_id: result.insertId, name: username, email };
        res.json({ token: makeToken(user), user: { id: user.user_id, username, email, role: 'user' } });
    } catch (err) {
        res.status(500).json({ error: 'Серверийн алдаа: ' + err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password)
        return res.status(400).json({ error: 'Талбарыг бөглөнө үү' });

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR name = ?', [identifier, identifier]
        );
        if (!rows.length)
            return res.status(401).json({ error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна' });

        const user  = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match)
            return res.status(401).json({ error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна' });

        res.json({
            token: makeToken(user),
            user:  { id: user.user_id, username: user.name, email: user.email, role: 'user' }
        });
    } catch (err) {
        res.status(500).json({ error: 'Серверийн алдаа: ' + err.message });
    }
});

module.exports = router;
