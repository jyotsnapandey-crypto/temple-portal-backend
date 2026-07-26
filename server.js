const express = require('express');
const cors = require('cors');
require('dotenv').config();

const templeRoutes = require('./routes/templeRoutes');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const recommendRoutes = require('./routes/recommendRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/recommend', recommendRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🛕 Temple Portal API is running!' });
});

// Routes
app.use('/api/temples', templeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Error handler (always last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
