const express = require('express');
const router = express.Router();
const { getAllFestivals } = require('../controllers/festivalController');

router.get('/', getAllFestivals);

module.exports = router;
