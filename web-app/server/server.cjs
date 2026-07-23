/**
 * PrepWiseAI — Backend Server Entry Point
 */

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.cjs');
const userRoutes = require('./routes/user.cjs');
const interviewRoutes = require('./routes/interviews.cjs');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/interviews', interviewRoutes);

// Alias analytics to interviews for simplicity in this demo structure
app.use('/api/analytics', interviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PrepWiseAI Backend', time: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend Server running on http://localhost:${PORT}`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
