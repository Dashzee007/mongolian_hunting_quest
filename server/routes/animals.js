const router = require('express').Router();
const pool   = require('../db');

// GET /api/animals  — frontend-д шаардлагатай бүх талбарыг буцаана
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT animal_id, name, region, type,
                    gen_info  AS description,
                    wiki_title AS wikiTitle,
                    status, base_price, picture_path
             FROM   animal
             ORDER  BY animal_id`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
