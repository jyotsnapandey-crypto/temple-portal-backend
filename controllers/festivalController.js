const pool = require('../config/db');

// GET /api/festivals
const getAllFestivals = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, t.name AS temple_name, c.name AS city, s.name AS state
      FROM festivals f
      JOIN temples t ON f.temple_id = t.id
      JOIN cities c ON t.city_id = c.id
      JOIN states s ON c.state_id = s.id
      ORDER BY f.festival_date ASC
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllFestivals };