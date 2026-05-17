require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const quizRoutes = require('./routes/quiz');
const adminRoutes = require('./routes/admin');
const trackRoutes = require('./routes/track');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/track', trackRoutes);

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// DB init
const db = require('./utils/db');
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`LaptopLens backend running on port ${PORT}`);
    console.log(`Admin URL: ${process.env.ADMIN_SECRET_PATH || '/aetherix-admin-2026'}`);
  });
}).catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});

module.exports = app;
