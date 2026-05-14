const router      = require('express').Router();
const pool        = require('../db');
const requireAuth = require('../middleware/auth');

function genCode() {
    return 'MHQ-' + Date.now().toString(36).toUpperCase();
}

// POST /api/bookings — захиалга үүсгэх
router.post('/', requireAuth, async (req, res) => {
    const { animalName, region, date, people, guide, notes, total } = req.body;
    if (!animalName || !date || !total)
        return res.status(400).json({ error: 'Шаардлагатай талбарууд дутуу байна' });

    try {
        // Амьтан олох эсвэл үүсгэх
        let [animals] = await pool.query(
            'SELECT animal_id FROM animal WHERE name = ?', [animalName]
        );
        let animal_id;
        if (animals.length) {
            animal_id = animals[0].animal_id;
        } else {
            const [ins] = await pool.query(
                'INSERT INTO animal (name, base_price) VALUES (?, ?)', [animalName, total]
            );
            animal_id = ins.insertId;
        }

        // Бүс нутаг олох
        let range_id = null;
        if (region) {
            const [ranges] = await pool.query(
                'SELECT range_id FROM RangeArea WHERE name = ?', [region]
            );
            if (ranges.length) range_id = ranges[0].range_id;
        }

        // Permit үүсгэх
        const pricePerPerson = total / (people || 1);
        const [permit] = await pool.query(
            `INSERT INTO Permit (user_id, animal_id, range_id, from_date, to_date, price, status, expires_at)
             VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', DATE_ADD(NOW(), INTERVAL 1 YEAR))`,
            [req.user.id, animal_id, range_id, date, date, total]
        );

        // Payment үүсгэх
        const code = genCode();
        await pool.query(
            `INSERT INTO Payment (permit_id, amount, payment_code, created_at)
             VALUES (?, ?, ?, NOW())`,
            [permit.insertId, total, code]
        );

        res.json({ permit_id: permit.insertId, payment_code: code, status: 'ACTIVE' });
    } catch (err) {
        res.status(500).json({ error: 'Серверийн алдаа: ' + err.message });
    }
});

// GET /api/bookings — хэрэглэгчийн захиалгуудыг авах
router.get('/', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.permit_id, p.from_date, p.to_date, p.price, p.status,
                    a.name  AS animal_name,
                    r.name  AS range_name,
                    py.payment_code,
                    py.created_at
             FROM   Permit p
             LEFT JOIN animal     a  ON a.animal_id  = p.animal_id
             LEFT JOIN RangeArea  r  ON r.range_id   = p.range_id
             LEFT JOIN Payment    py ON py.permit_id  = p.permit_id
             WHERE  p.user_id = ?
             ORDER BY py.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
