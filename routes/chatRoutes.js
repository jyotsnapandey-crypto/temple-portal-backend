const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res, next) => {
  try {
    const { messages } = req.body;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable and friendly Indian temple heritage guide for the Temple Heritage Portal.
You help users learn about Indian temples, their history, significance, rituals, darshan timings, festivals, pilgrimage routes, and travel tips.
You have deep knowledge about temples across all Indian states including famous ones like Kashi Vishwanath, Tirupati, Meenakshi Amman, Jagannath, Somnath, Dwarkadheesh, Shirdi Sai Baba, and many more.
You can suggest pilgrimage itineraries, explain Hindu deities and their significance, and provide visitor guidelines.
Keep responses concise, warm, and helpful. Use occasional Hindu greetings like Namaste, Jai Shri Ram where appropriate.`
        },
        ...messages
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    next(err);
  }
});

module.exports = router;