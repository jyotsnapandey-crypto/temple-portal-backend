const pool = require('../config/db');

// GET /api/locations/states
const getAllStates = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM states ORDER BY name');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/cities?state_id=1
const getCities = async (req, res, next) => {
  try {
    const { state_id } = req.query;
    let query = 'SELECT * FROM cities';
    const params = [];
    if (state_id) { params.push(state_id); query += ' WHERE state_id = ?'; }
    query += ' ORDER BY name';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/deities
const getAllDeities = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM deities ORDER BY name');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStates, getCities, getAllDeities };