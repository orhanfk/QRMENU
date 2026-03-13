import * as XLSX from 'xlsx';

/**
 * Excel dosyasını parse eder.
 * Beklenen format:
 * Kolon A: Kategori | Kolon B: Ürün Adı | Kolon C: Açıklama | Kolon D: Fiyat
 * Başlık satırı otomatik atlanır.
 */
export function parseMenuExcel(filePath) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  if (rows.length < 2) throw new Error('Excel dosyası boş veya hatalı format');

  const categoriesMap = new Map();

  for (let i = 1; i < rows.length; i++) {
    const [rawCat, rawName, rawDesc, rawPrice] = rows[i];
    if (!rawName || rawPrice === '') continue;

    const category = String(rawCat || 'Genel').trim();
    const name = String(rawName).trim();
    const description = String(rawDesc || '').trim();
    const price = parseFloat(String(rawPrice).replace(',', '.'));

    if (isNaN(price) || price < 0) continue;

    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, { name: category, items: [] });
    }
    categoriesMap.get(category).items.push({ name, description, price });
  }

  const categories = [...categoriesMap.values()];
  if (categories.length === 0) throw new Error('Geçerli ürün bulunamadı');

  return categories;
}

export function generateExcelTemplate() {
  const wb = XLSX.utils.book_new();
  const data = [
    ['Kategori', 'Ürün Adı', 'Açıklama', 'Fiyat (TRY)'],
    ['Başlangıçlar', 'Mercimek Çorbası', 'Geleneksel tarif', 75],
    ['Başlangıçlar', 'Ezme', 'Acılı veya tatlı', 65],
    ['Ana Yemekler', 'Izgara Köfte', '200gr, yanında pilav', 250],
    ['Ana Yemekler', 'Tavuk Şiş', 'Marine edilmiş', 220],
    ['Tatlılar', 'Künefe', 'Antep fıstıklı', 130],
    ['İçecekler', 'Ayran', '300ml', 35],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Menü');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
