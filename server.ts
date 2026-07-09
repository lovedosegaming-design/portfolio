import express from 'express';
import { createServer as createViteServer } from 'vite';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// Database Adapter: Supports Postgres + SQLite
// ─────────────────────────────────────────────

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

let pgPool: import('pg').Pool | null = null;
let sqliteDb: import('better-sqlite3').Database | null = null;

if (POSTGRES_URL) {
  // Postgres mode (Vercel / production)
  const { Pool } = await import('pg');
  pgPool = new Pool({ connectionString: POSTGRES_URL, ssl: { rejectUnauthorized: false } });
  console.log('Using PostgreSQL database');
} else {
  // SQLite mode (local / Docker)
  const { default: Database } = await import('better-sqlite3');
  const DB_PATH = process.env.DATABASE_PATH || 'lumina.db';
  const DB_DIR = path.dirname(path.resolve(DB_PATH));
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  sqliteDb = new Database(DB_PATH);
  console.log(`Using SQLite database: ${DB_PATH}`);
}

// Universal query helper
async function dbQuery(sql: string, params: any[] = []): Promise<any[]> {
  if (pgPool) {
    // Convert SQLite ? placeholders to $1, $2 for Postgres
    let pgSql = sql;
    let i = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${i++}`);
    // Convert SQLite INSERT OR REPLACE to Postgres ON CONFLICT DO UPDATE
    pgSql = pgSql.replace(
      /INSERT OR REPLACE INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/gi,
      (_, table, cols, vals) => {
        const colArr = cols.split(',').map((c: string) => c.trim());
        const valArr = vals.split(',').map((v: string) => v.trim());
        const firstCol = colArr[0];
        const updates = colArr.slice(1).map((c: string, idx: number) => `${c} = ${valArr[idx + 1]}`).join(', ');
        return `INSERT INTO ${table} (${cols}) VALUES (${vals}) ON CONFLICT (${firstCol}) DO UPDATE SET ${updates}`;
      }
    );
    const result = await pgPool.query(pgSql, params);
    return result.rows;
  } else {
    // SQLite synchronous
    const stmt = sqliteDb!.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params) as any[];
    } else {
      stmt.run(...params);
      return [];
    }
  }
}

// ─────────────────────────────────────────────
// Initialize Tables
// ─────────────────────────────────────────────

async function initDb() {
  const createProjects = `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client_name TEXT,
    platform TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    subscribers_gained INTEGER DEFAULT 0,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const createReviews = `CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    client_name TEXT,
    client_avatar TEXT,
    channel_name TEXT,
    rating INTEGER,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const createAnalytics = `CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    metric_name TEXT,
    value INTEGER,
    label TEXT
  )`;

  const createSkills = `CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT,
    proficiency INTEGER
  )`;

  const createSettings = `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`;

  if (pgPool) {
    await pgPool.query(createProjects);
    await pgPool.query(createReviews);
    await pgPool.query(createAnalytics);
    await pgPool.query(createSkills);
    await pgPool.query(createSettings);
  } else {
    sqliteDb!.exec(`${createProjects}; ${createReviews}; ${createAnalytics}; ${createSkills}; ${createSettings};`);
  }

  // Seed initial data if empty
  const projectCount = await dbQuery('SELECT count(*) as count FROM projects');
  const pCount = Number(projectCount[0]?.count ?? 0);
  if (pCount === 0) {
    await dbQuery(`INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [uuidv4(), 'Epic Travel Vlog', 'TravelWithTom', 'YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/travel/1280/720', 1200000, 45000, 15000, 'Vlog']);
    await dbQuery(`INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [uuidv4(), 'Tech Review: iPhone 15', 'TechDaily', 'YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/tech/1280/720', 850000, 32000, 5000, 'Tech']);
    await dbQuery(`INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [uuidv4(), 'Fitness Transformation', 'FitLife', 'Instagram', 'https://www.instagram.com/reel/C8...', 'https://picsum.photos/seed/fitness/1080/1920', 500000, 20000, 8000, 'Shorts']);
    await dbQuery(`INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [uuidv4(), 'Gaming Highlights', 'ProGamerX', 'TikTok', 'https://www.tiktok.com/@user/video/...', 'https://picsum.photos/seed/gaming/1080/1920', 2000000, 150000, 25000, 'Shorts']);
  }

  const analyticsCount = await dbQuery('SELECT count(*) as count FROM analytics');
  const aCount = Number(analyticsCount[0]?.count ?? 0);
  if (aCount === 0) {
    await dbQuery('INSERT INTO analytics (id, metric_name, value, label) VALUES (?, ?, ?, ?)', [uuidv4(), 'total_clients', 45, 'Total Clients']);
    await dbQuery('INSERT INTO analytics (id, metric_name, value, label) VALUES (?, ?, ?, ?)', [uuidv4(), 'videos_edited', 320, 'Videos Edited']);
    await dbQuery('INSERT INTO analytics (id, metric_name, value, label) VALUES (?, ?, ?, ?)', [uuidv4(), 'views_generated', 15000000, 'Views Generated']);
    await dbQuery('INSERT INTO analytics (id, metric_name, value, label) VALUES (?, ?, ?, ?)', [uuidv4(), 'subs_gained', 500000, 'Subscribers Gained']);
  }

  const reviewsCount = await dbQuery('SELECT count(*) as count FROM reviews');
  const rCount = Number(reviewsCount[0]?.count ?? 0);
  if (rCount === 0) {
    await dbQuery('INSERT INTO reviews (id, client_name, client_avatar, channel_name, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), 'Sarah Jenkins', 'https://picsum.photos/seed/sarah/200', 'SarahVlogs', 5, 'Absolutely transformed my channel. The retention rate skyrocketed after hiring him!']);
    await dbQuery('INSERT INTO reviews (id, client_name, client_avatar, channel_name, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), 'Mike Ross', 'https://picsum.photos/seed/mike/200', 'TechInsider', 5, 'Professional, fast, and incredibly creative. Best editor I have worked with.']);
    await dbQuery('INSERT INTO reviews (id, client_name, client_avatar, channel_name, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), 'Jessica Lee', 'https://picsum.photos/seed/jessica/200', 'YogaWithJess', 4, 'Great communication and amazing edits. Highly recommended for lifestyle content.']);
  }

  const settingsCount = await dbQuery('SELECT count(*) as count FROM settings');
  const sCount = Number(settingsCount[0]?.count ?? 0);
  if (sCount === 0) {
    await dbQuery('INSERT INTO settings (key, value) VALUES (?, ?)', ['availability_status', 'available']);
  }
}

// ─────────────────────────────────────────────
// Express Server
// ─────────────────────────────────────────────

async function startServer() {
  await initDb();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // CORS Middleware — allows Vercel frontend to call this backend
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // ── API Routes ──

  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await dbQuery('SELECT * FROM projects ORDER BY created_at DESC');
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    const { title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category } = req.body;
    const id = uuidv4();
    try {
      await dbQuery(
        `INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, client_name, platform, video_url, thumbnail_url, views || 0, likes || 0, subscribers_gained || 0, category]
      );
      res.json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await dbQuery('DELETE FROM projects WHERE id = ?', [id]);
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  app.get('/api/analytics', async (req, res) => {
    try {
      const analytics = await dbQuery('SELECT * FROM analytics');
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await dbQuery('SELECT * FROM reviews');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await dbQuery('SELECT * FROM settings');
      const settingsMap = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post('/api/settings', async (req, res) => {
    const { key, value } = req.body;
    try {
      await dbQuery('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
      res.json({ key, value });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save setting' });
    }
  });

  // ── Vite / Static ──

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
