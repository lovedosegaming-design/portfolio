import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('lumina.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    client_name TEXT,
    client_avatar TEXT,
    channel_name TEXT,
    rating INTEGER,
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    metric_name TEXT,
    value INTEGER,
    label TEXT
  );
  
  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT,
    proficiency INTEGER
  );
`);

// Seed initial data if empty
const projectCount = db.prepare('SELECT count(*) as count FROM projects').get() as { count: number };
if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(uuidv4(), 'Epic Travel Vlog', 'TravelWithTom', 'YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/travel/1280/720', 1200000, 45000, 15000, 'Vlog');
  insertProject.run(uuidv4(), 'Tech Review: iPhone 15', 'TechDaily', 'YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/tech/1280/720', 850000, 32000, 5000, 'Tech');
  insertProject.run(uuidv4(), 'Fitness Transformation', 'FitLife', 'Instagram', 'https://www.instagram.com/reel/C8...', 'https://picsum.photos/seed/fitness/1080/1920', 500000, 20000, 8000, 'Shorts');
  insertProject.run(uuidv4(), 'Gaming Highlights', 'ProGamerX', 'TikTok', 'https://www.tiktok.com/@user/video/...', 'https://picsum.photos/seed/gaming/1080/1920', 2000000, 150000, 25000, 'Shorts');
}

const analyticsCount = db.prepare('SELECT count(*) as count FROM analytics').get() as { count: number };
if (analyticsCount.count === 0) {
  const insertAnalytic = db.prepare('INSERT INTO analytics (id, metric_name, value, label) VALUES (?, ?, ?, ?)');
  insertAnalytic.run(uuidv4(), 'total_clients', 45, 'Total Clients');
  insertAnalytic.run(uuidv4(), 'videos_edited', 320, 'Videos Edited');
  insertAnalytic.run(uuidv4(), 'views_generated', 15000000, 'Views Generated');
  insertAnalytic.run(uuidv4(), 'subs_gained', 500000, 'Subscribers Gained');
}

const reviewsCount = db.prepare('SELECT count(*) as count FROM reviews').get() as { count: number };
if (reviewsCount.count === 0) {
  const insertReview = db.prepare('INSERT INTO reviews (id, client_name, client_avatar, channel_name, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)');
  insertReview.run(uuidv4(), 'Sarah Jenkins', 'https://picsum.photos/seed/sarah/200', 'SarahVlogs', 5, 'Absolutely transformed my channel. The retention rate skyrocketed after hiring him!');
  insertReview.run(uuidv4(), 'Mike Ross', 'https://picsum.photos/seed/mike/200', 'TechInsider', 5, 'Professional, fast, and incredibly creative. Best editor I have worked with.');
  insertReview.run(uuidv4(), 'Jessica Lee', 'https://picsum.photos/seed/jessica/200', 'YogaWithJess', 4, 'Great communication and amazing edits. Highly recommended for lifestyle content.');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json(projects);
  });

  app.post('/api/projects', (req, res) => {
    const { title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category } = req.body;
    const id = uuidv4();
    try {
      const stmt = db.prepare(`
        INSERT INTO projects (id, title, client_name, platform, video_url, thumbnail_url, views, likes, subscribers_gained, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, title, client_name, platform, video_url, thumbnail_url, views || 0, likes || 0, subscribers_gained || 0, category);
      res.json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get('/api/analytics', (req, res) => {
    const analytics = db.prepare('SELECT * FROM analytics').all();
    res.json(analytics);
  });

  app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
      const result = stmt.run(id);
      if (result.changes > 0) {
        res.json({ message: 'Project deleted successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  app.get('/api/reviews', (req, res) => {
    const reviews = db.prepare('SELECT * FROM reviews').all();
    res.json(reviews);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
