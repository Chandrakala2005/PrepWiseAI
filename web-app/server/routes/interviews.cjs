/**
 * PrepWiseAI — Interviews & Analytics Routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

router.use(authenticateToken);

// ─── INTERVIEWS ──────────────────────────────────────────────

// GET /api/interviews (List user's interviews)
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`
      SELECT * FROM interviews 
      WHERE user_id = ${req.user.id} 
      ORDER BY id DESC
    `);
    
    if (result.length === 0) {
      return res.json([]);
    }

    const columns = result[0].columns;
    const rows = result[0].values.map(row => {
      const interview = {};
      columns.forEach((col, i) => { interview[col] = row[i]; });
      return interview;
    });
    
    res.json(rows);
  } catch (error) {
    console.error('List interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// POST /api/interviews (Save new completed interview)
router.post('/', (req, res) => {
  const { title, role, difficulty, score, status, topic, duration_minutes, ai_persona } = req.body;
  
  try {
    const db = getDb();
    
    db.runAndSave(
      `INSERT INTO interviews (user_id, title, role, difficulty, score, status, topic, duration_minutes, ai_persona) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, role, difficulty, score, status, topic, duration_minutes, ai_persona]
    );

    // Get the newly inserted row ID using a simpler approach since lastInsertRowid is tricky with sql.js custom runAndSave
    const latestRes = db.exec(`SELECT * FROM interviews WHERE user_id = ${req.user.id} ORDER BY id DESC LIMIT 1`);
    
    const columns = latestRes[0].columns;
    const values = latestRes[0].values[0];
    const interview = {};
    columns.forEach((col, i) => { interview[col] = values[i]; });
    
    res.status(201).json(interview);
  } catch (error) {
    console.error('Save interview error:', error);
    res.status(500).json({ error: 'Failed to save interview' });
  }
});

// ─── ANALYTICS ───────────────────────────────────────────────

// GET /api/analytics/summary
router.get('/summary', (req, res) => {
  try {
    const db = getDb();
    
    // Total Interviews
    let totalInterviews = 0;
    const tRes = db.exec(`SELECT COUNT(*) FROM interviews WHERE user_id = ${req.user.id}`);
    if (tRes.length > 0) totalInterviews = tRes[0].values[0][0];
    
    // Average Score
    let avgScore = 0;
    const sRes = db.exec(`SELECT AVG(score) FROM interviews WHERE user_id = ${req.user.id} AND score IS NOT NULL`);
    if (sRes.length > 0 && sRes[0].values[0][0]) {
      avgScore = Math.round(sRes[0].values[0][0]);
    }
    
    // Total Practice Hours
    let totalMinutes = 0;
    const mRes = db.exec(`SELECT SUM(duration_minutes) FROM interviews WHERE user_id = ${req.user.id}`);
    if (mRes.length > 0 && mRes[0].values[0][0]) {
      totalMinutes = mRes[0].values[0][0];
    }
    
    const practiceHours = (totalMinutes / 60).toFixed(1);

    res.json({
      totalInterviews,
      avgScore,
      practiceHours: practiceHours.endsWith('.0') ? practiceHours.slice(0, -2) : practiceHours
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

module.exports = router;
