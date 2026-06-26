const pool = require('../config/db');

// GET /api/temples
const getAllTemples = async (req, res, next) => {
  try {
    const { state_id, city_id, deity_id, search } = req.query;

    let query = `
      SELECT t.id, t.name, t.description, t.image_url, t.is_featured,
             c.name AS city, s.name AS state, d.name AS deity
      FROM temples t
      JOIN cities c ON t.city_id = c.id
      JOIN states s ON c.state_id = s.id
      JOIN deities d ON t.deity_id = d.id
      WHERE t.status = 'approved'
    `;
    const params = [];

    if (state_id) { params.push(state_id); query += ` AND s.id = ?`; }
    if (city_id)  { params.push(city_id);  query += ` AND c.id = ?`; }
    if (deity_id) { params.push(deity_id); query += ` AND d.id = ?`; }
    if (search)   { params.push(`%${search}%`); query += ` AND t.name LIKE ?`; }

    query += ' ORDER BY t.is_featured DESC, t.name ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/temples/featured
const getFeaturedTemples = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.name, t.description, t.image_url,
             c.name AS city, s.name AS state, d.name AS deity
      FROM temples t
      JOIN cities c ON t.city_id = c.id
      JOIN states s ON c.state_id = s.id
      JOIN deities d ON t.deity_id = d.id
      WHERE t.is_featured = true AND t.status = 'approved'
      LIMIT 6
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/temples/:id
const getTempleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [temple] = await pool.query(`
      SELECT t.*, c.name AS city, s.name AS state, d.name AS deity, d.significance AS deity_significance
      FROM temples t
      JOIN cities c ON t.city_id = c.id
      JOIN states s ON c.state_id = s.id
      JOIN deities d ON t.deity_id = d.id
      WHERE t.id = ? AND t.status = 'approved'
    `, [id]);

    if (temple.length === 0) {
      return res.status(404).json({ message: 'Temple not found' });
    }

    const [timings] = await pool.query(
      'SELECT * FROM darshan_timings WHERE temple_id = ? ORDER BY day_type', [id]
    );
    const [festivals] = await pool.query(
      'SELECT * FROM festivals WHERE temple_id = ? ORDER BY festival_date', [id]
    );
    const [visitorInfo] = await pool.query(
      'SELECT * FROM visitor_info WHERE temple_id = ?', [id]
    );

    res.json({
      ...temple[0],
      darshan_timings: timings,
      festivals: festivals,
      visitor_info: visitorInfo[0] || null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTemples, getTempleById, getFeaturedTemples };