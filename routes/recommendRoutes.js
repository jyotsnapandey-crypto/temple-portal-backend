const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const response = await fetch('https://temple-recommender.onrender.com/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;