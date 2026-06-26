const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const protect = require('../middleware/authMiddleware');

router.use(protect);

// GET all temples
router.get('/temples', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.name, t.status, t.is_featured, t.created_at,
             c.name AS city, s.name AS state
      FROM temples t
      JOIN cities c ON t.city_id = c.id
      JOIN states s ON c.state_id = s.id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

// POST create temple
router.post('/temples', async (req, res, next) => {
  try {
    const { name, description, history, city_id, deity_id, image_url, is_featured } = req.body;
    const [result] = await pool.query(`
      INSERT INTO temples (name, description, history, city_id, deity_id, image_url, is_featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'approved')
    `, [name, description, history, city_id, deity_id, image_url, is_featured || false]);
    res.status(201).json({ id: result.insertId, message: 'Temple created' });
  } catch (err) { next(err); }
});

// PUT update temple
router.put('/temples/:id', async (req, res, next) => {
  try {
    const { name, description, history, city_id, deity_id, image_url, is_featured, status } = req.body;
    await pool.query(`
      UPDATE temples SET name=?, description=?, history=?, city_id=?,
        deity_id=?, image_url=?, is_featured=?, status=?
      WHERE id=?
    `, [name, description, history, city_id, deity_id, image_url, is_featured, status, req.params.id]);
    res.json({ message: 'Temple updated' });
  } catch (err) { next(err); }
});

// DELETE temple
router.delete('/temples/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM temples WHERE id = ?', [req.params.id]);
    res.json({ message: 'Temple deleted successfully' });
  } catch (err) { next(err); }
});

// POST darshan timings
router.post('/temples/:id/timings', async (req, res, next) => {
  try {
    const { timings } = req.body;
    const templeId = req.params.id;
    await pool.query('DELETE FROM darshan_timings WHERE temple_id = ?', [templeId]);
    for (const t of timings) {
      if (t.open_time && t.close_time) {
        await pool.query(
          'INSERT INTO darshan_timings (temple_id, day_type, open_time, close_time, notes) VALUES (?, ?, ?, ?, ?)',
          [templeId, t.day_type, t.open_time, t.close_time, t.notes || '']
        );
      }
    }
    res.json({ message: 'Timings saved' });
  } catch (err) { next(err); }
});

// POST festivals
router.post('/temples/:id/festivals', async (req, res, next) => {
  try {
    const { festivals } = req.body;
    const templeId = req.params.id;
    await pool.query('DELETE FROM festivals WHERE temple_id = ?', [templeId]);
    for (const f of festivals) {
      if (f.name) {
        await pool.query(
          'INSERT INTO festivals (temple_id, name, festival_date, description) VALUES (?, ?, ?, ?)',
          [templeId, f.name, f.festival_date || null, f.description || '']
        );
      }
    }
    res.json({ message: 'Festivals saved' });
  } catch (err) { next(err); }
});

// POST visitor info
router.post('/temples/:id/visitor-info', async (req, res, next) => {
  try {
    const { dress_code, rules, nearby_accommodation, transport_options, official_website, places_to_visit } = req.body;
    const templeId = req.params.id;
    await pool.query('DELETE FROM visitor_info WHERE temple_id = ?', [templeId]);
    if (dress_code || rules || nearby_accommodation || transport_options || official_website || places_to_visit) {
      await pool.query(
        'INSERT INTO visitor_info (temple_id, dress_code, rules, nearby_accommodation, transport_options, official_website, places_to_visit) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [templeId, dress_code, rules, nearby_accommodation, transport_options, official_website, places_to_visit]
      );
    }
    res.json({ message: 'Visitor info saved' });
  } catch (err) { next(err); }
});

module.exports = router;