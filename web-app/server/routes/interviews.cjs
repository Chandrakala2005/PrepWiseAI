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
      [req.user.id, title, role, difficulty, score, status, topic, duration_minutes || 30, ai_persona]
    );

    const latestRes = db.exec(`SELECT * FROM interviews WHERE user_id = ${req.user.id} ORDER BY id DESC LIMIT 1`);
    
    if (latestRes.length === 0 || !latestRes[0].values[0]) {
      return res.status(201).json({ user_id: req.user.id, title, score, role });
    }

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

// POST /api/interviews/sync (Sync and merge client-side interviews so stats never decrease)
router.post('/sync', (req, res) => {
  const { interviews = [] } = req.body;
  
  try {
    const db = getDb();
    
    // Check existing records for this user
    const existingRes = db.exec(`SELECT title, score, duration_minutes, topic FROM interviews WHERE user_id = ${req.user.id}`);
    const existingSet = new Set();
    if (existingRes.length > 0) {
      existingRes[0].values.forEach(row => {
        existingSet.add(`${row[0]}_${row[1]}_${row[2]}_${row[3]}`);
      });
    }

    let inserted = 0;
    for (const item of interviews) {
      const key = `${item.title}_${item.score}_${item.duration_minutes || 30}_${item.topic || ''}`;
      if (!existingSet.has(key)) {
        db.run(
          `INSERT INTO interviews (user_id, title, role, difficulty, score, status, topic, duration_minutes, ai_persona, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`,
          [
            req.user.id,
            item.title,
            item.role,
            item.difficulty || 'Medium',
            Number(item.score) || 0,
            item.status || 'Completed',
            item.topic || item.role,
            Number(item.duration_minutes) || 30,
            item.ai_persona || 'AI Interviewer',
            item.created_at || null
          ]
        );
        existingSet.add(key);
        inserted++;
      }
    }

    if (inserted > 0) {
      try {
        const data = db.export();
        const buffer = Buffer.from(data);
        const fs = require('fs');
        const path = require('path');
        const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
        const DB_PATH = isVercel ? path.join('/tmp', 'prepwise.sqlite') : path.join(__dirname, '..', 'prepwise.sqlite');
        fs.writeFileSync(DB_PATH, buffer);
      } catch (err) {
        console.warn('DB sync write warning:', err.message);
      }
    }

    // Return current full list of user interviews
    const result = db.exec(`
      SELECT * FROM interviews 
      WHERE user_id = ${req.user.id} 
      ORDER BY id DESC
    `);
    
    if (result.length === 0) return res.json([]);
    const columns = result[0].columns;
    const rows = result[0].values.map(row => {
      const interview = {};
      columns.forEach((col, i) => { interview[col] = row[i]; });
      return interview;
    });
    
    res.json(rows);
  } catch (error) {
    console.error('Sync interviews error:', error);
    res.status(500).json({ error: 'Failed to sync interviews' });
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
    if (tRes.length > 0 && tRes[0].values[0]) {
      totalInterviews = Number(tRes[0].values[0][0]) || 0;
    }
    
    // Average Score
    let avgScore = 0;
    const sRes = db.exec(`SELECT AVG(CAST(score AS REAL)) FROM interviews WHERE user_id = ${req.user.id} AND score IS NOT NULL`);
    if (sRes.length > 0 && sRes[0].values[0] && sRes[0].values[0][0] !== null && sRes[0].values[0][0] !== undefined) {
      avgScore = Math.round(Number(sRes[0].values[0][0]) || 0);
    }
    
    // Total Practice Hours
    let totalMinutes = 0;
    const mRes = db.exec(`SELECT SUM(CAST(duration_minutes AS REAL)) FROM interviews WHERE user_id = ${req.user.id}`);
    if (mRes.length > 0 && mRes[0].values[0] && mRes[0].values[0][0] !== null && mRes[0].values[0][0] !== undefined) {
      totalMinutes = Number(mRes[0].values[0][0]) || 0;
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
