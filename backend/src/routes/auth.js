import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../utils/initDb.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { restaurantName, email, password } = req.body;
  if (!restaurantName || !email || !password) {
    return res.status(400).json({ error: 'Tüm alanlar zorunlu' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) return res.status(409).json({ error: 'Bu email zaten kayıtlı' });

  const slug = restaurantName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') + '-' + uuidv4().slice(0, 6);

  const hash = await bcrypt.hash(password, 12);

  const insertRestaurant = db.prepare(
    'INSERT INTO restaurants (name, slug) VALUES (?, ?)'
  );
  const insertUser = db.prepare(
    'INSERT INTO users (restaurant_id, email, password_hash) VALUES (?, ?, ?)'
  );

  const tx = db.transaction(() => {
    const rest = insertRestaurant.run(restaurantName, slug);
    const user = insertUser.run(rest.lastInsertRowid, email, hash);
    return { restaurantId: rest.lastInsertRowid, userId: user.lastInsertRowid };
  });

  const { restaurantId, userId } = tx();
  const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(restaurantId);

  const token = jwt.sign(
    { userId, restaurantId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.status(201).json({ token, restaurant, user: { id: userId, email } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre gerekli' });
  }

  const user = db.prepare(`
    SELECT u.*, r.name as restaurantName, r.slug as restaurantSlug, r.logo_path
    FROM users u JOIN restaurants r ON u.restaurant_id = r.id
    WHERE u.email = ?
  `).get(email);

  if (!user) return res.status(401).json({ error: 'Geçersiz email veya şifre' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Geçersiz email veya şifre' });

  const token = jwt.sign(
    { userId: user.id, restaurantId: user.restaurant_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id, email: user.email,
      restaurantId: user.restaurant_id,
      restaurantName: user.restaurantName,
      restaurantSlug: user.restaurantSlug,
      logoPath: user.logo_path
    }
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token gerekli' });
  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    const user = db.prepare(`
      SELECT u.id, u.email, u.restaurant_id, r.name as restaurantName, r.slug, r.logo_path
      FROM users u JOIN restaurants r ON u.restaurant_id = r.id
      WHERE u.id = ?
    `).get(payload.userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Geçersiz token' });
  }
});

export default router;
