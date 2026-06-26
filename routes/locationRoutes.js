const express = require('express');
const router = express.Router();
const { getAllStates, getCities, getAllDeities } = require('../controllers/locationController');

router.get('/states', getAllStates);
router.get('/cities', getCities);
router.get('/deities', getAllDeities);

module.exports = router;
