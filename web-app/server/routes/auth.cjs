/**
 * PrepWiseAI — Authentication Routes
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../database.cjs');
const { generateToken } = require('../middleware/auth.cjs');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const db = getDb();
    const result = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const columns = result[0].columns;
    const values = result[0].values[0];
    
    // Map array values to object keys
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });

    // For SSO / Persona users that might not have a password
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Please login using your original method' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    
    // Remove hash before sending back to client
    delete user.password_hash;
    
    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  try {
    const db = getDb();
    
    // Check if user exists
    const checkRes = db.exec(`SELECT id FROM users WHERE email = '${email}'`);
    if (checkRes.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.runAndSave(
      `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`, 
      [email, hashedPassword, name]
    );

    // Get the newly created user
    const newUserRes = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    const columns = newUserRes[0].columns;
    const values = newUserRes[0].values[0];
    
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });

    const token = generateToken(user);
    delete user.password_hash;
    
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/otp/send
router.post('/otp/send', (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number required' });
  }

  try {
    const db = getDb();
    const code = '849201'; // Mock OTP code for demo
    
    db.runAndSave(
      `INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, datetime('now', '+10 minutes'))`,
      [phone, code]
    );

    res.json({ message: 'OTP sent successfully', _devCode: code });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/auth/otp/verify
router.post('/otp/verify', (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code required' });
  }

  try {
    const db = getDb();
    
    // Verify OTP
    const otpRes = db.exec(`SELECT * FROM otp_codes WHERE phone = '${phone}' AND code = '${code}' AND used = 0 AND expires_at > datetime('now') ORDER BY id DESC LIMIT 1`);
    
    if (otpRes.length === 0 || otpRes[0].values.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }
    
    const otpId = otpRes[0].values[0][0]; // Assuming ID is first col
    db.runAndSave(`UPDATE otp_codes SET used = 1 WHERE id = ?`, [otpId]);

    // Find or create user
    const email = `phone_${phone.replace(/\D/g, '')}@prepwise.ai`;
    let userRes = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    
    if (userRes.length === 0) {
      // Create new phone user
      db.runAndSave(
        `INSERT INTO users (email, name, role, auth_method, phone) VALUES (?, ?, ?, ?, ?)`,
        [email, 'Mobile Candidate', 'Verified Mobile User', 'Phone SMS OTP', phone]
      );
      userRes = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    }

    const columns = userRes[0].columns;
    const values = userRes[0].values[0];
    
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });

    const token = generateToken(user);
    delete user.password_hash;
    
    res.json({ token, user });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// POST /api/auth/social
router.post('/social', (req, res) => {
  const { provider } = req.body; // 'Google', 'GitHub', 'LinkedIn'
  
  if (!provider) {
    return res.status(400).json({ error: 'Provider required' });
  }

  try {
    const db = getDb();
    const email = `user.${provider.toLowerCase()}@prepwise.ai`;
    
    let userRes = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    
    if (userRes.length === 0) {
      // Create new social user
      db.runAndSave(
        `INSERT INTO users (email, name, role, auth_method) VALUES (?, ?, ?, ?)`,
        [email, `${provider} Candidate`, 'FAANG Applicant', `${provider} OAuth SSO`]
      );
      userRes = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    }

    const columns = userRes[0].columns;
    const values = userRes[0].values[0];
    
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });

    const token = generateToken(user);
    delete user.password_hash;
    
    res.json({ token, user });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ error: 'Social login failed' });
  }
});

// POST /api/auth/persona
router.post('/persona', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Persona email required' });
  }

  try {
    const db = getDb();
    const userRes = db.exec(`SELECT * FROM users WHERE email = '${email}' AND auth_method = 'Instant Demo Persona'`);
    
    if (userRes.length === 0 || userRes[0].values.length === 0) {
      return res.status(404).json({ error: 'Demo persona not found' });
    }

    const columns = userRes[0].columns;
    const values = userRes[0].values[0];
    
    const user = {};
    columns.forEach((col, i) => { user[col] = values[i]; });

    const token = generateToken(user);
    delete user.password_hash;
    
    res.json({ token, user });
  } catch (error) {
    console.error('Persona login error:', error);
    res.status(500).json({ error: 'Persona login failed' });
  }
});

module.exports = router;
