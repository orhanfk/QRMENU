import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDb } from './utils/initDb.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menus.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';

// Init DB
initDb();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Static: serve uploads (PDFs, QR codes, logos)
app.use('/uploads', express.static(path.resolve(UPLOADS_DIR)));

// Public menu viewer — /m/:slug
app.get('/m/:slug', async (req, res) => {
  const { default: menuRouterInstance } = await import('./routes/menus.js');
  req.params.slug = req.params.slug;
  // Forward to the public handler
  res.redirect(`/api/menus/public/${req.params.slug}`);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route bulunamadı' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Dosya çok büyük' });
  res.status(500).json({ error: err.message || 'Sunucu hatası' });
});

app.listen(PORT, () => {
  console.log(`🚀 QR Menu API: http://localhost:${PORT}`);
  console.log(`📂 Uploads: ${path.resolve(UPLOADS_DIR)}`);
});
