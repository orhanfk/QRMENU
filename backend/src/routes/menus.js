import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { mkdirSync, unlinkSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import db from '../utils/initDb.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateQRCode, generateQRCodeDataUrl } from '../services/qrService.js';
import { parseMenuExcel, generateExcelTemplate } from '../services/excelService.js';
import { renderMenuHTML, THEMES } from '../services/menuRenderer.js';

const router = Router();
const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(UPLOADS_DIR, 'pdfs');
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}.pdf`)
});

const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(UPLOADS_DIR, 'temp');
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}.xlsx`)
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(UPLOADS_DIR, 'logos');
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Sadece PDF dosyası yükleyebilirsiniz'));
  }
});

const uploadExcel = multer({
  storage: excelStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'].includes(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Sadece Excel (.xlsx) dosyası yükleyebilirsiniz'));
  }
});

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Sadece görsel dosyası yükleyebilirsiniz'));
  }
});

// GET /api/menus — list all menus for restaurant
router.get('/', authMiddleware, (req, res) => {
  const menus = db.prepare(`
    SELECT m.*, COUNT(mi.id) as item_count
    FROM menus m
    LEFT JOIN menu_items mi ON mi.menu_id = m.id
    WHERE m.restaurant_id = ?
    GROUP BY m.id
    ORDER BY m.created_at DESC
  `).all(req.user.restaurantId);
  res.json({ menus });
});

// GET /api/menus/themes — available themes
router.get('/themes', (req, res) => {
  const themes = Object.entries(THEMES).map(([id, t]) => ({
    id, name: t.name, desc: t.desc, preview: t.preview
  }));
  res.json({ themes });
});

// GET /api/menus/template — download Excel template
router.get('/template', (req, res) => {
  const buffer = generateExcelTemplate();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="menu-sablonu.xlsx"');
  res.send(buffer);
});

// GET /api/menus/:id — single menu with items
router.get('/:id', authMiddleware, (req, res) => {
  const menu = db.prepare('SELECT * FROM menus WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.user.restaurantId);
  if (!menu) return res.status(404).json({ error: 'Menü bulunamadı' });

  const categories = db.prepare('SELECT * FROM menu_categories WHERE menu_id = ? ORDER BY sort_order').all(menu.id);
  for (const cat of categories) {
    cat.items = db.prepare('SELECT * FROM menu_items WHERE category_id = ? ORDER BY sort_order').all(cat.id);
  }

  const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(req.user.restaurantId);
  res.json({ menu, categories, restaurant });
});

// POST /api/menus/pdf — upload PDF menu (v1)
router.post('/pdf', authMiddleware, uploadPdf.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'PDF dosyası gerekli' });
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Menü adı gerekli' });

  const slug = `m-${uuidv4().slice(0, 10)}`;
  const pdfRelPath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

  const { pngPath, menuUrl } = await generateQRCode(slug, baseUrl);

  const result = db.prepare(`
    INSERT INTO menus (restaurant_id, name, slug, type, pdf_path, qr_path)
    VALUES (?, ?, ?, 'pdf', ?, ?)
  `).run(req.user.restaurantId, name, slug, pdfRelPath, pngPath);

  const menu = db.prepare('SELECT * FROM menus WHERE id = ?').get(result.lastInsertRowid);
  const qrDataUrl = await generateQRCodeDataUrl(slug, baseUrl);

  res.status(201).json({ menu, menuUrl, qrDataUrl });
});

// POST /api/menus/smart — create smart menu from Excel (v2)
router.post('/smart', authMiddleware, uploadExcel.single('excel'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Excel dosyası gerekli' });
  const { name, theme = 'elegant' } = req.body;
  if (!name) return res.status(400).json({ error: 'Menü adı gerekli' });
  if (!THEMES[theme]) return res.status(400).json({ error: 'Geçersiz tema' });

  let categories;
  try {
    categories = parseMenuExcel(req.file.path);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  } finally {
    if (existsSync(req.file.path)) unlinkSync(req.file.path);
  }

  const slug = `m-${uuidv4().slice(0, 10)}`;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  const { pngPath, menuUrl } = await generateQRCode(slug, baseUrl);

  const insertMenu = db.prepare(`
    INSERT INTO menus (restaurant_id, name, slug, type, theme, qr_path) VALUES (?, ?, ?, 'smart', ?, ?)
  `);
  const insertCat = db.prepare('INSERT INTO menu_categories (menu_id, name, sort_order) VALUES (?, ?, ?)');
  const insertItem = db.prepare(`
    INSERT INTO menu_items (category_id, menu_id, name, description, price, sort_order) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    const menuResult = insertMenu.run(req.user.restaurantId, name, slug, theme, pngPath);
    const menuId = menuResult.lastInsertRowid;
    categories.forEach((cat, ci) => {
      const catResult = insertCat.run(menuId, cat.name, ci);
      cat.items.forEach((item, ii) => {
        insertItem.run(catResult.lastInsertRowid, menuId, item.name, item.description, item.price, ii);
      });
    });
    return menuId;
  });

  const menuId = tx();
  const menu = db.prepare('SELECT * FROM menus WHERE id = ?').get(menuId);
  const qrDataUrl = await generateQRCodeDataUrl(slug, baseUrl);

  res.status(201).json({ menu, menuUrl, qrDataUrl, categories });
});

// PATCH /api/menus/:id/theme — update theme
router.patch('/:id/theme', authMiddleware, (req, res) => {
  const { theme } = req.body;
  if (!THEMES[theme]) return res.status(400).json({ error: 'Geçersiz tema' });
  const menu = db.prepare('SELECT * FROM menus WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.user.restaurantId);
  if (!menu) return res.status(404).json({ error: 'Menü bulunamadı' });
  db.prepare('UPDATE menus SET theme = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(theme, menu.id);
  res.json({ success: true });
});

// DELETE /api/menus/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const menu = db.prepare('SELECT * FROM menus WHERE id = ? AND restaurant_id = ?')
    .get(req.params.id, req.user.restaurantId);
  if (!menu) return res.status(404).json({ error: 'Menü bulunamadı' });
  db.prepare('DELETE FROM menus WHERE id = ?').run(menu.id);
  res.json({ success: true });
});

// POST /api/menus/logo — upload restaurant logo
router.post('/logo', authMiddleware, uploadLogo.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Görsel gerekli' });
  const logoPath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
  db.prepare('UPDATE restaurants SET logo_path = ? WHERE id = ?').run(logoPath, req.user.restaurantId);
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  res.json({ logoUrl: `${baseUrl}/${logoPath}` });
});

// PUBLIC: GET /m/:slug — serve menu (PDF redirect or HTML render)
router.get('/public/:slug', async (req, res) => {
  const menu = db.prepare('SELECT m.*, r.name as restaurantName, r.logo_path FROM menus m JOIN restaurants r ON r.id = m.restaurant_id WHERE m.slug = ? AND m.is_active = 1').get(req.params.slug);
  if (!menu) return res.status(404).send('Menü bulunamadı');

  if (menu.type === 'pdf') {
    const pdfPath = path.resolve(menu.pdf_path);
    if (!existsSync(pdfPath)) return res.status(404).send('PDF bulunamadı');
    return res.sendFile(pdfPath);
  }

  const categories = db.prepare('SELECT * FROM menu_categories WHERE menu_id = ? ORDER BY sort_order').all(menu.id);
  for (const cat of categories) {
    cat.items = db.prepare('SELECT * FROM menu_items WHERE category_id = ? AND is_available = 1 ORDER BY sort_order').all(cat.id);
  }

  const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(menu.restaurant_id);
  const html = renderMenuHTML(menu, restaurant, categories);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
