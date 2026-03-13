export const THEMES = {
  elegant: {
    name: 'Elegant',
    desc: 'Altın detaylar, beyaz zemin',
    preview: '#F5F0E8',
    css: `
      body { font-family: 'Cormorant Garamond', Georgia, serif; background: #FAF8F3; color: #2C2416; margin: 0; }
      .header { background: #2C2416; color: #D4AF6A; padding: 48px 32px; text-align: center; }
      .header h1 { font-size: 3rem; font-weight: 300; letter-spacing: .15em; margin: 0 0 8px; }
      .header .tagline { color: #A8896A; font-style: italic; font-size: 1.1rem; }
      .logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #D4AF6A; margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.5rem; color: #B8924A; letter-spacing: .1em; text-transform: uppercase; border-bottom: 1px solid #D4AF6A; padding-bottom: 8px; margin-bottom: 20px; }
      .item { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 0; border-bottom: 1px dashed #E8DFC8; gap: 16px; }
      .item-name { font-size: 1.1rem; font-weight: 600; }
      .item-desc { font-size: .9rem; color: #8A7A64; margin-top: 2px; }
      .item-price { font-size: 1.1rem; color: #B8924A; white-space: nowrap; font-weight: 600; }
    `
  },
  modern: {
    name: 'Modern',
    desc: 'Siyah zemin, neon vurgu',
    preview: '#0F0F0F',
    css: `
      body { font-family: 'Inter', 'Helvetica Neue', sans-serif; background: #0F0F0F; color: #E8E8E8; margin: 0; }
      .header { padding: 48px 32px; text-align: center; border-bottom: 1px solid #2A2A2A; }
      .header h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -.02em; margin: 0; color: #fff; }
      .header .tagline { color: #6B6B6B; font-size: .9rem; margin-top: 8px; }
      .logo { width: 72px; height: 72px; border-radius: 12px; object-fit: cover; margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 48px; }
      .category-title { font-size: 1rem; color: #00F5A0; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 20px; }
      .item { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px; background: #1A1A1A; border-radius: 8px; margin-bottom: 8px; gap: 16px; }
      .item-name { font-size: 1rem; font-weight: 600; }
      .item-desc { font-size: .85rem; color: #6B6B6B; margin-top: 4px; }
      .item-price { font-size: 1rem; color: #00F5A0; white-space: nowrap; font-weight: 700; }
    `
  },
  bistro: {
    name: 'Bistro',
    desc: 'Kırmızı beyaz, şık Fransız',
    preview: '#FEFEFE',
    css: `
      body { font-family: 'Playfair Display', Georgia, serif; background: #FEFEFE; color: #1A1A1A; margin: 0; }
      .header { background: #C41E2A; color: #fff; padding: 48px 32px; text-align: center; }
      .header h1 { font-size: 2.8rem; font-weight: 700; margin: 0 0 8px; }
      .header .tagline { font-style: italic; opacity: .85; }
      .logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,.5); margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.4rem; color: #C41E2A; font-weight: 700; margin-bottom: 16px; }
      .item { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0; border-bottom: 1px solid #F0E8E8; gap: 16px; }
      .item-name { font-size: 1.05rem; font-weight: 600; }
      .item-desc { font-size: .88rem; color: #777; margin-top: 3px; font-style: italic; }
      .item-price { color: #C41E2A; font-weight: 700; white-space: nowrap; }
    `
  },
  minimal: {
    name: 'Minimal',
    desc: 'Sadece tipografi, saf',
    preview: '#FFFFFF',
    css: `
      body { font-family: 'DM Sans', Arial, sans-serif; background: #fff; color: #111; margin: 0; }
      .header { padding: 56px 32px 40px; }
      .header h1 { font-size: 2.2rem; font-weight: 300; margin: 0; letter-spacing: -.01em; }
      .header .tagline { color: #999; font-size: .9rem; margin-top: 6px; }
      .logo { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 0 32px 56px; }
      .category { margin-bottom: 48px; }
      .category-title { font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: #999; margin-bottom: 16px; }
      .item { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px solid #F0F0F0; gap: 16px; }
      .item-name { font-size: 1rem; }
      .item-desc { font-size: .85rem; color: #aaa; margin-top: 2px; }
      .item-price { font-size: 1rem; color: #111; white-space: nowrap; }
    `
  },
  rustic: {
    name: 'Rustik',
    desc: 'Kahverengi, doğal dokular',
    preview: '#F2EAD8',
    css: `
      body { font-family: 'Libre Baskerville', Georgia, serif; background: #F2EAD8; color: #3D2B1F; margin: 0; }
      .header { background: #5C3D2E; color: #F2EAD8; padding: 48px 32px; text-align: center; }
      .header h1 { font-size: 2.6rem; font-weight: 700; margin: 0; }
      .header .tagline { color: #C4A882; font-style: italic; margin-top: 8px; }
      .logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #C4A882; margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.3rem; color: #5C3D2E; font-weight: 700; border-bottom: 2px solid #C4A882; padding-bottom: 6px; margin-bottom: 18px; }
      .item { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0; border-bottom: 1px dashed #C4A882; gap: 16px; }
      .item-name { font-size: 1.05rem; font-weight: 600; }
      .item-desc { font-size: .88rem; color: #7A5C4A; margin-top: 3px; font-style: italic; }
      .item-price { color: #7A3B1E; font-weight: 700; white-space: nowrap; }
    `
  },
  neon: {
    name: 'Neon',
    desc: 'Mor arkaplan, canlı renkler',
    preview: '#1A0A2E',
    css: `
      body { font-family: 'Rajdhani', 'Arial Narrow', sans-serif; background: #1A0A2E; color: #E0D0FF; margin: 0; }
      .header { padding: 48px 32px; text-align: center; border-bottom: 1px solid #3D1F6B; }
      .header h1 { font-size: 2.8rem; font-weight: 700; color: #BF5FFF; margin: 0; text-shadow: 0 0 20px rgba(191,95,255,.5); letter-spacing: .05em; }
      .header .tagline { color: #7A5FA8; margin-top: 8px; }
      .logo { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; border: 2px solid #BF5FFF; margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.1rem; color: #FF6B9D; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 16px; }
      .item { display: flex; justify-content: space-between; padding: 14px 16px; background: rgba(255,255,255,.04); border: 1px solid rgba(191,95,255,.15); border-radius: 8px; margin-bottom: 8px; gap: 16px; }
      .item-name { font-size: 1.05rem; font-weight: 600; }
      .item-desc { font-size: .85rem; color: #7A5FA8; margin-top: 3px; }
      .item-price { color: #FF6B9D; font-weight: 700; white-space: nowrap; }
    `
  },
  cafe: {
    name: 'Cafe',
    desc: 'Sıcak bej, kahve tonu',
    preview: '#FBF7F0',
    css: `
      body { font-family: 'Nunito', 'Segoe UI', sans-serif; background: #FBF7F0; color: #3A2E26; margin: 0; }
      .header { background: #E8D5B7; padding: 40px 32px; text-align: center; }
      .header h1 { font-size: 2.4rem; font-weight: 800; color: #5C3D2E; margin: 0; }
      .header .tagline { color: #8B6A52; margin-top: 6px; }
      .logo { width: 80px; height: 80px; border-radius: 16px; object-fit: cover; margin-bottom: 16px; border: 3px solid #C4A882; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.2rem; color: #5C3D2E; font-weight: 800; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
      .category-title::after { content: ''; flex: 1; height: 2px; background: #E8D5B7; }
      .item { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #EFE5D0; gap: 16px; }
      .item-name { font-size: 1rem; font-weight: 700; }
      .item-desc { font-size: .85rem; color: #8B6A52; margin-top: 3px; }
      .item-price { background: #5C3D2E; color: #F2EAD8; padding: 2px 10px; border-radius: 20px; font-size: .9rem; font-weight: 700; white-space: nowrap; }
    `
  },
  luxury: {
    name: 'Luxury',
    desc: 'Koyu lacivert, gümüş',
    preview: '#0D1B2A',
    css: `
      body { font-family: 'Cinzel', 'Times New Roman', serif; background: #0D1B2A; color: #C8D8E8; margin: 0; }
      .header { padding: 56px 32px; text-align: center; border-bottom: 1px solid rgba(192,192,192,.2); }
      .header h1 { font-size: 2.4rem; font-weight: 400; color: #C0C0C0; letter-spacing: .2em; margin: 0; }
      .header .tagline { color: #607080; font-family: Georgia, serif; font-style: italic; margin-top: 10px; }
      .logo { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid #C0C0C0; margin-bottom: 20px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 48px; }
      .category-title { font-size: 1rem; color: #8090A0; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 20px; }
      .item { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px solid rgba(192,192,192,.1); gap: 16px; }
      .item-name { font-size: 1rem; font-weight: 400; color: #E0EAF0; }
      .item-desc { font-size: .85rem; color: #506070; margin-top: 3px; }
      .item-price { color: #C0C0C0; white-space: nowrap; letter-spacing: .05em; }
    `
  },
  street: {
    name: 'Street Food',
    desc: 'Sarı siyah, enerjik',
    preview: '#1C1C1C',
    css: `
      body { font-family: 'Oswald', Impact, sans-serif; background: #1C1C1C; color: #F5F5F5; margin: 0; }
      .header { background: #F5C518; padding: 40px 32px; text-align: center; }
      .header h1 { font-size: 3rem; font-weight: 700; color: #1C1C1C; margin: 0; letter-spacing: .03em; text-transform: uppercase; }
      .header .tagline { color: #4A4A1A; margin-top: 6px; font-style: normal; }
      .logo { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 3px solid #1C1C1C; margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.4rem; color: #F5C518; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 16px; }
      .item { display: flex; justify-content: space-between; padding: 12px 16px; background: #2A2A2A; border-left: 4px solid #F5C518; margin-bottom: 8px; gap: 16px; }
      .item-name { font-size: 1.1rem; font-weight: 600; }
      .item-desc { font-size: .85rem; color: #888; margin-top: 3px; font-family: Arial, sans-serif; text-transform: none; }
      .item-price { color: #F5C518; font-weight: 700; font-size: 1.1rem; white-space: nowrap; }
    `
  },
  fresh: {
    name: 'Fresh',
    desc: 'Yeşil doğal, sağlıklı',
    preview: '#F0F7F0',
    css: `
      body { font-family: 'Poppins', 'Segoe UI', sans-serif; background: #F0F7F0; color: #1A3A2A; margin: 0; }
      .header { background: linear-gradient(135deg, #2D7A4F, #1A5C38); color: #fff; padding: 48px 32px; text-align: center; }
      .header h1 { font-size: 2.4rem; font-weight: 700; margin: 0; }
      .header .tagline { color: rgba(255,255,255,.7); margin-top: 6px; }
      .logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,.5); margin-bottom: 16px; }
      .container { max-width: 680px; margin: 0 auto; padding: 32px 24px; }
      .category { margin-bottom: 40px; }
      .category-title { font-size: 1.1rem; color: #2D7A4F; font-weight: 700; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
      .item { display: flex; justify-content: space-between; align-items: flex-start; padding: 14px; background: #fff; border-radius: 10px; margin-bottom: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.06); gap: 16px; }
      .item-name { font-size: 1rem; font-weight: 600; }
      .item-desc { font-size: .85rem; color: #5A8A6A; margin-top: 3px; }
      .item-price { background: #E8F5ED; color: #1A5C38; padding: 3px 10px; border-radius: 20px; font-weight: 700; font-size: .9rem; white-space: nowrap; }
    `
  }
};

export function renderMenuHTML(menu, restaurant, categories) {
  const theme = THEMES[menu.theme] || THEMES.elegant;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  const logoUrl = restaurant.logo_path
    ? `${baseUrl}/${restaurant.logo_path}`
    : null;

  const formatPrice = (p) => `₺${p % 1 === 0 ? p.toFixed(0) : p.toFixed(2)}`;

  const categoriesHTML = categories.map(cat => `
    <div class="category">
      <div class="category-title">${escapeHtml(cat.name)}</div>
      ${cat.items.map(item => `
        <div class="item">
          <div>
            <div class="item-name">${escapeHtml(item.name)}</div>
            ${item.description ? `<div class="item-desc">${escapeHtml(item.description)}</div>` : ''}
          </div>
          <div class="item-price">${formatPrice(item.price)}</div>
        </div>
      `).join('')}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(restaurant.name)} — Menü</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600;700;800&family=Poppins:wght@300;400;600;700&family=Oswald:wght@400;600;700&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    ${theme.css}
    .footer { text-align: center; padding: 32px; color: #999; font-size: .75rem; }
  </style>
</head>
<body>
  <div class="header">
    ${logoUrl ? `<img class="logo" src="${logoUrl}" alt="${escapeHtml(restaurant.name)}">` : ''}
    <h1>${escapeHtml(restaurant.name)}</h1>
    <div class="tagline">Menümüz</div>
  </div>
  <div class="container">
    ${categoriesHTML}
  </div>
  <div class="footer">Fiyatlara KDV dahildir • ${new Date().getFullYear()}</div>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
