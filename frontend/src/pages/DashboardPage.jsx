import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/shared/Layout'
import QRModal from '../components/qr/QRModal'
import api from '../utils/api'

export default function DashboardPage() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrMenu, setQrMenu] = useState(null)

  useEffect(() => {
    api.get('/menus').then(({ menus }) => setMenus(menus)).catch(() => toast.error('Menüler yüklenemedi')).finally(() => setLoading(false))
  }, [])

  const deleteMenu = async (id) => {
    if (!confirm('Bu menüyü silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/menus/${id}`)
      setMenus(m => m.filter(x => x.id !== id))
      toast.success('Menü silindi')
    } catch { toast.error('Silme başarısız') }
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Menülerim</h1>
            <p style={styles.sub}>{menus.length} aktif menü</p>
          </div>
          <Link to="/menus/new" className="btn btn-primary">
            <PlusIcon /> Yeni Menü
          </Link>
        </div>

        {loading ? (
          <div style={styles.center}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
        ) : menus.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={styles.grid}>
            {menus.map(menu => (
              <MenuCard key={menu.id} menu={menu}
                onQR={() => setQrMenu(menu)}
                onDelete={() => deleteMenu(menu.id)} />
            ))}
          </div>
        )}
      </div>

      {qrMenu && <QRModal menu={qrMenu} onClose={() => setQrMenu(null)} />}
    </Layout>
  )
}

function MenuCard({ menu, onQR, onDelete }) {
  const date = new Date(menu.created_at).toLocaleDateString('tr-TR')
  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={styles.cardIcon}>
          {menu.type === 'pdf' ? '📄' : '✨'}
        </div>
        <span className={`badge badge-${menu.type}`}>
          {menu.type === 'pdf' ? 'PDF' : 'Akıllı'}
        </span>
      </div>

      <h3 style={styles.cardTitle}>{menu.name}</h3>

      <div style={styles.cardMeta}>
        {menu.type === 'smart' && (
          <span style={styles.metaItem}><PackageIcon /> {menu.item_count || 0} ürün</span>
        )}
        <span style={styles.metaItem}><CalendarIcon /> {date}</span>
      </div>

      {menu.type === 'smart' && menu.theme && (
        <div style={styles.themePill}>{menu.theme}</div>
      )}

      <div style={styles.cardActions}>
        <button className="btn btn-primary" onClick={onQR} style={{ flex: 1, fontSize: 13, padding: '9px' }}>
          <QrCodeIcon /> QR Göster
        </button>
        <Link to={`/menus/${menu.id}`} className="btn btn-ghost" style={{ fontSize: 13, padding: '9px 14px' }}>
          <EditIcon />
        </Link>
        <button className="btn btn-danger" onClick={onDelete} style={{ fontSize: 13, padding: '9px 14px' }}>
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>🍽️</div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Henüz menünüz yok</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14 }}>PDF yükleyerek veya Excel ile akıllı menü oluşturarak başlayın</p>
      <Link to="/menus/new" className="btn btn-primary">İlk Menünüzü Oluşturun</Link>
    </div>
  )
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
}
function QrCodeIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="5" height="5" rx="1" opacity=".9"/><rect x="10" y="1" width="5" height="5" rx="1" opacity=".9"/>
    <rect x="1" y="10" width="5" height="5" rx="1" opacity=".9"/>
    <path d="M10 10h2v2h-2zM13 10h2v2h-2zM11.5 12.5h2v2h-2zM10 14.5h1.5v1.5H10z"/>
  </svg>
}
function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10.5 2.5l3 3L5 14H2v-3L10.5 2.5z"/>
  </svg>
}
function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
  </svg>
}
function PackageIcon() {
  return <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M8 1l6 3v8l-6 3-6-3V4L8 1zM8 1v12M2 4l6 3 6-3"/>
  </svg>
}
function CalendarIcon() {
  return <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="1" y="2" width="14" height="13" rx="2"/><path d="M5 1v2M11 1v2M1 7h14"/>
  </svg>
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  sub: { color: 'var(--text2)', fontSize: 14 },
  center: { display: 'flex', justifyContent: 'center', padding: 80 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.15s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardIcon: { fontSize: 24 },
  cardTitle: { fontSize: 16, fontWeight: 600, lineHeight: 1.3 },
  cardMeta: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)' },
  themePill: { display: 'inline-block', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 10px', fontSize: 12, color: 'var(--text3)' },
  cardActions: { display: 'flex', gap: 8, marginTop: 4 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
}
