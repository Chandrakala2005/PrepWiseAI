/**
 * PrepWiseAI — User Profile Routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

// Apply auth middleware to all user routes
router.use(authenticateToken);

// GET /api/user/profile
router.get('/profile', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM users WHERE id = ${req.user.id}`);
    
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const columns = result[0].columns;
    const values = result[0].values[0];
    
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });
    
    delete user.password_hash;
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/user/profile
router.put('/profile', (req, res) => {
  const { name, role, avatar_bg } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const db = getDb();
    
    db.runAndSave(
      `UPDATE users SET name = ?, role = ?, avatar_bg = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, role || 'Candidate', avatar_bg || '#14B8A6', req.user.id]
    );

    const result = db.exec(`SELECT * FROM users WHERE id = ${req.user.id}`);
    const columns = result[0].columns;
    const values = result[0].values[0];
    
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });
    delete user.password_hash;
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
