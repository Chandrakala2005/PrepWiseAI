/**
 * PrepWiseAI — sql.js Database Setup
 * Auto-creates tables and seeds demo user accounts using in-memory/file-backed sql.js.
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_DB_PATH = path.join(__dirname, 'prepwise.sqlite');
const DB_PATH = isVercel ? path.join('/tmp', 'prepwise.sqlite') : BUNDLED_DB_PATH;

let dbInstance = null;

async function initDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  let wasmBinary = null;
  const localWasm = path.join(__dirname, 'sql-wasm.wasm');
  if (fs.existsSync(localWasm)) {
    try {
      wasmBinary = fs.readFileSync(localWasm);
    } catch (e) {
      console.warn('Could not read local wasm:', e.message);
    }
  }
  if (!wasmBinary) {
    try {
      const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');
      if (fs.existsSync(wasmPath)) {
        wasmBinary = fs.readFileSync(wasmPath);
      }
    } catch (e) {
      console.warn('Could not resolve wasm path:', e.message);
    }
  }

  const SQL = await initSqlJs(wasmBinary ? { wasmBinary } : {});
  let db;

  // In Vercel serverless, copy pre-seeded SQLite file to writable /tmp directory if needed
  if (isVercel && !fs.existsSync(DB_PATH) && fs.existsSync(BUNDLED_DB_PATH)) {
    try {
      fs.copyFileSync(BUNDLED_DB_PATH, DB_PATH);
    } catch (err) {
      console.warn('Could not copy bundled DB to /tmp:', err.message);
    }
  }

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  // Helper to run query and save to file immediately
  db.runAndSave = function(sql, params = []) {
      this.run(sql, params);
      try {
        const data = this.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
      } catch (err) {
        console.warn('DB file write warning:', err.message);
      }
  };
  
  db.execAndSave = function(sql) {
      this.exec(sql);
      try {
        const data = this.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
      } catch (err) {
        console.warn('DB file write warning:', err.message);
      }
  };


  // ─── Create Tables ───────────────────────────────────────────
  db.execAndSave(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Candidate',
      auth_method TEXT DEFAULT 'Email & Password',
      avatar_bg TEXT DEFAULT '#14B8A6',
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      role TEXT,
      difficulty TEXT DEFAULT 'Medium',
      interview_type TEXT DEFAULT 'Technical',
      duration_minutes INTEGER DEFAULT 30,
      score INTEGER,
      status TEXT DEFAULT 'Completed',
      topic TEXT,
      feedback TEXT,
      ai_persona TEXT,
      questions_count INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      metric_key TEXT NOT NULL,
      metric_value TEXT NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // ─── Seed Demo Users (only if table is empty) ────────────────
  const result = db.exec('SELECT COUNT(*) as count FROM users');
  const userCount = result[0].values[0][0];

  if (userCount === 0) {
    const hashedPassword = bcrypt.hashSync('Password123!', 10);

    const insertUser = `
      INSERT INTO users (email, password_hash, name, role, auth_method, avatar_bg)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const seedUsers = [
      ['candidate@prepwise.ai', hashedPassword, 'Candidate User', 'Software Engineer Candidate', 'Email & Password', '#14B8A6'],
      ['sarah.swe@prepwise.ai', hashedPassword, 'Sarah Chen', 'Staff Software Engineer', 'Instant Demo Persona', '#6366F1'],
      ['david.sysdesign@prepwise.ai', hashedPassword, 'David Miller', 'System Design Architect', 'Instant Demo Persona', '#14B8A6'],
      ['elena.aiml@prepwise.ai', hashedPassword, 'Elena Rostova', 'AI / ML Specialist', 'Instant Demo Persona', '#8B5CF6'],
      ['marcus.pm@prepwise.ai', hashedPassword, 'Marcus Vance', 'Lead Product Manager', 'Instant Demo Persona', '#F59E0B']
    ];

    
    for (const user of seedUsers) {
        db.run(insertUser, user);
    }
    

    // Seed some interview history for the default candidate
    const res = db.exec("SELECT id FROM users WHERE email = 'candidate@prepwise.ai'");
    const candidateId = res[0].values[0][0];

    const insertInterview = `
      INSERT INTO interviews (user_id, title, role, difficulty, score, status, topic, duration_minutes, ai_persona)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const seedInterviews = [
      [candidateId, 'System Design Mock Interview', 'System Design Architect', 'Hard', 88, 'Passed', 'Distributed Caching', 45, 'Alex Vance'],
      [candidateId, 'FAANG Data Structures Practice', 'Software Engineer', 'Medium', 94, 'Passed', 'Trees & Graphs', 30, 'Dr. Sarah Chen'],
      [candidateId, 'Behavioral & Leadership Drills', 'Product Manager', 'Medium', 79, 'Needs Work', 'Conflict Resolution', 30, 'Marcus Brody'],
      [candidateId, 'Binary Search Deep Dive', 'Software Engineer', 'Easy', 96, 'Passed', 'Arrays & Sorting', 15, 'Dr. Sarah Chen'],
      [candidateId, 'Microservices Architecture', 'System Design Architect', 'Hard', 82, 'Passed', 'Service Mesh', 45, 'Alex Vance'],
      [candidateId, 'Dynamic Programming Sprint', 'Software Engineer', 'Hard', 71, 'Needs Work', 'DP Optimization', 30, 'Marcus Brody'],
      [candidateId, 'ML Pipeline Design', 'AI / ML Engineer', 'Medium', 85, 'Passed', 'Model Deployment', 30, 'Dr. Sarah Chen'],
      [candidateId, 'API Design Best Practices', 'Software Engineer', 'Medium', 91, 'Passed', 'REST vs gRPC', 30, 'Alex Vance'],
    ];

    for (const interview of seedInterviews) {
        db.run(insertInterview, interview);
    }
    
    // final save after seeding
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.warn('DB seed write warning:', err.message);
    }

    console.log('✅ Database seeded with demo users and interview history');
  }

  dbInstance = db;
  return db;
}

function getDb() {
    if (!dbInstance) {
        throw new Error("Database not initialized");
    }
    return dbInstance;
}

module.exports = { initDatabase, getDb };
