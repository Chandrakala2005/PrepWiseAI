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

// Database lazy-init middleware for Serverless (Vercel) & local environments
let dbInitPromise = null;
function ensureDatabase() {
  if (!dbInitPromise) {
    dbInitPromise = initDatabase().catch(err => {
      console.error('Failed to initialize database:', err);
      dbInitPromise = null; // allow retry on next request
      throw err;
    });
  }
  return dbInitPromise;
}

// Health check endpoint (placed before db middleware so it responds immediately)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'PrepWiseAI Backend (Vercel Serverless Ready)', time: new Date() });
});

app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes (supporting both /api/* and root paths in case of Vercel rewrites)
const authRoutes = require('./routes/auth.cjs');
const userRoutes = require('./routes/user.cjs');
const interviewRoutes = require('./routes/interviews.cjs');

app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/user', '/user'], userRoutes);
app.use(['/api/interviews', '/interviews'], interviewRoutes);

// Alias analytics to interviews for simplicity in this demo structure
app.use(['/api/analytics', '/analytics'], interviewRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error handler:', err);
  res.status(500).json({ error: 'Server error', message: err.message || 'Something went wrong' });
});

// Start standalone server when executed directly (node server/server.cjs or npm run server)
if (require.main === module) {
  ensureDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Backend Server running on http://localhost:${PORT}`);
      console.log(`   API Endpoint: http://localhost:${PORT}/api`);
    });
  }).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
}

module.exports = app;
