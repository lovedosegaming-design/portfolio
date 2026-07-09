// Vercel Serverless Function entry point
// This re-exports the Express app as a serverless handler for Vercel

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

let pgPool: import('pg').Pool | null = null;

if (POSTGRES_URL) {
  const { Pool } = await import('pg');
  pgPool = new Pool({ connectionString: POSTGRES_URL, ssl: { rejectUnauthorized: false } });
}

async function dbQuery(sql: string, params: any[] = []): Promise<any[]> {
  if (!pgPool) {
    throw new Error('No database configured. Set POSTGRES_URL environment variable in Vercel.');
  }
  let pgSql = sql;
  let i = 1;
  pgSql = pgSql.replace(/\?/g, () => `$${i++}`);
  // SQLite INSERT OR REPLACE -> Postgres ON CONFLICT DO UPDATE
  pgSql = pgSql.replace(
    /INSERT OR REPLACE INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/gi,
    (_, table, cols, vals) => {
      const colArr = cols.split(',').map((c: string) => c.trim());
      const firstCol = colArr[0];
      const updates = colArr.slice(1).map((c: string) => `${c} = EXCLUDED.${c}`).join(', ');
      return `INSERT INTO ${table} (${cols}) VALUES (${vals}) ON CONFLICT (${firstCol}) DO UPDATE SET ${updates}`;
    }
  );
  const result = await pgPool.query(pgSql, params);
  return result.rows;
}

async function initDb() {
  if (!pgPool) return;
  await pgPool.query(`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, title TEXT NOT NULL, client_name TEXT, platform TEXT, video_url TEXT, thumbnail_url TEXT, views INTEGER DEFAULT 0, likes INTEGER DEFAULT 0, subscribers_gained INTEGER DEFAULT 0, category TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pgPool.query(`CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, client_name TEXT, client_avatar TEXT, channel_name TEXT, rating INTEGER, review_text TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pgPool.query(`CREATE TABLE IF NOT EXISTS analytics (id TEXT PRIMARY KEY, metric_name TEXT, value INTEGER, label TEXT)`);
  await pgPool.query(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);

  const pc = await pgPool.query('SELECT count(*) as count FROM projects');
  if (Number(pc.rows[0]?.count) === 0) {
    const ins = (args: any[]) => pgPool!.query(`INSERT INTO projects (id,title,client_name,platform,video_url,thumbnail_url,views,likes,subscribers_gained,category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, args);
    await ins([uuidv4(), 'Epic Travel Vlog', 'TravelWithTom', 'YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/travel/1280/720', 1200000, 45000, 15000, 'Vlog']);
    await ins([uuidv4(), 'Tech Review: iPhone 15', 'TechDaily', 'YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/tech/1280/720', 850000, 32000, 5000, 'Tech']);
    await ins([uuidv4(), 'Fitness Transformation', 'FitLife', 'Instagram', 'https://www.instagram.com/reel/C8...', 'https://picsum.photos/seed/fitness/1080/1920', 500000, 20000, 8000, 'Shorts']);
    await ins([uuidv4(), 'Gaming Highlights', 'ProGamerX', 'TikTok', 'https://www.tiktok.com/@user/video/...', 'https://picsum.photos/seed/gaming/1080/1920', 2000000, 150000, 25000, 'Shorts']);
  }

  const ac = await pgPool.query('SELECT count(*) as count FROM analytics');
  if (Number(ac.rows[0]?.count) === 0) {
    const ins = (args: any[]) => pgPool!.query('INSERT INTO analytics (id,metric_name,value,label) VALUES ($1,$2,$3,$4)', args);
    await ins([uuidv4(), 'total_clients', 45, 'Total Clients']);
    await ins([uuidv4(), 'videos_edited', 320, 'Videos Edited']);
    await ins([uuidv4(), 'views_generated', 15000000, 'Views Generated']);
    await ins([uuidv4(), 'subs_gained', 500000, 'Subscribers Gained']);
  }

  const rc = await pgPool.query('SELECT count(*) as count FROM reviews');
  if (Number(rc.rows[0]?.count) === 0) {
    const ins = (args: any[]) => pgPool!.query('INSERT INTO reviews (id,client_name,client_avatar,channel_name,rating,review_text) VALUES ($1,$2,$3,$4,$5,$6)', args);
    await ins([uuidv4(), 'Sarah Jenkins', 'https://picsum.photos/seed/sarah/200', 'SarahVlogs', 5, 'Absolutely transformed my channel. The retention rate skyrocketed after hiring him!']);
    await ins([uuidv4(), 'Mike Ross', 'https://picsum.photos/seed/mike/200', 'TechInsider', 5, 'Professional, fast, and incredibly creative. Best editor I have worked with.']);
    await ins([uuidv4(), 'Jessica Lee', 'https://picsum.photos/seed/jessica/200', 'YogaWithJess', 4, 'Great communication and amazing edits. Highly recommended for lifestyle content.']);
  }

  const sc = await pgPool.query('SELECT count(*) as count FROM settings');
  if (Number(sc.rows[0]?.count) === 0) {
    await pgPool.query('INSERT INTO settings (key,value) VALUES ($1,$2)', ['availability_status', 'available']);
  }
}

const dbReady = initDb();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.sendStatus(200); } else { next(); }
});

app.get('/api/projects', async (_req, res) => {
  try { await dbReady; const r = await dbQuery('SELECT * FROM projects ORDER BY created_at DESC'); res.json(r); }
  catch (e) { res.status(500).json({ error: 'Failed to fetch projects' }); }
});

app.post('/api/projects', async (req, res) => {
  const { title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category } = req.body;
  const id = uuidv4();
  try {
    await dbReady;
    await dbQuery(`INSERT INTO projects (id,title,client_name,platform,video_url,thumbnail_url,views,likes,subscribers_gained,category) VALUES (?,?,?,?,?,?,?,?,?,?)`, [id, title, client_name, platform, video_url, thumbnail_url, views || 0, likes || 0, subscribers_gained || 0, category]);
    res.json({ id, ...req.body });
  } catch (e) { res.status(500).json({ error: 'Failed to create project' }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try { await dbReady; await dbQuery('DELETE FROM projects WHERE id = ?', [req.params.id]); res.json({ message: 'Project deleted successfully' }); }
  catch (e) { res.status(500).json({ error: 'Failed to delete project' }); }
});

app.get('/api/analytics', async (_req, res) => {
  try { await dbReady; const r = await dbQuery('SELECT * FROM analytics'); res.json(r); }
  catch (e) { res.status(500).json({ error: 'Failed to fetch analytics' }); }
});

app.get('/api/reviews', async (_req, res) => {
  try { await dbReady; const r = await dbQuery('SELECT * FROM reviews'); res.json(r); }
  catch (e) { res.status(500).json({ error: 'Failed to fetch reviews' }); }
});

app.get('/api/settings', async (_req, res) => {
  try {
    await dbReady;
    const settings = await dbQuery('SELECT * FROM settings');
    const settingsMap = settings.reduce((acc: any, curr: any) => { acc[curr.key] = curr.value; return acc; }, {});
    res.json(settingsMap);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch settings' }); }
});

app.post('/api/settings', async (req, res) => {
  const { key, value } = req.body;
  try {
    await dbReady;
    await dbQuery('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
    res.json({ key, value });
  } catch (e) { res.status(500).json({ error: 'Failed to save setting' }); }
});

export default app;
