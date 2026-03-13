import QRCode from 'qrcode';
import path from 'path';
import { mkdirSync } from 'fs';

const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';

export async function generateQRCode(menuSlug, baseUrl) {
  const menuUrl = `${baseUrl}/m/${menuSlug}`;
  const qrDir = path.resolve(UPLOADS_DIR, 'qrcodes');
  mkdirSync(qrDir, { recursive: true });

  const pngPath = path.join(qrDir, `${menuSlug}.png`);
  const svgPath = path.join(qrDir, `${menuSlug}.svg`);

  await QRCode.toFile(pngPath, menuUrl, {
    width: 400,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' },
    errorCorrectionLevel: 'M'
  });

  const svgStr = await QRCode.toString(menuUrl, {
    type: 'svg',
    width: 400,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' }
  });

  const { writeFileSync } = await import('fs');
  writeFileSync(svgPath, svgStr);

  return {
    pngPath: path.relative(process.cwd(), pngPath),
    svgPath: path.relative(process.cwd(), svgPath),
    menuUrl
  };
}

export async function generateQRCodeDataUrl(menuSlug, baseUrl) {
  const menuUrl = `${baseUrl}/m/${menuSlug}`;
  return QRCode.toDataURL(menuUrl, {
    width: 300,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' },
    errorCorrectionLevel: 'M'
  });
}
