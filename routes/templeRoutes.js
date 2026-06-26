const express = require('express');
const router = express.Router();
const { getAllTemples, getTempleById, getFeaturedTemples } = require('../controllers/templeController');

router.get('/', getAllTemples);
router.get('/featured', getFeaturedTemples);
router.get('/:id', getTempleById);

module.exports = router;
