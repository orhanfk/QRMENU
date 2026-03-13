import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/shared/Layout'
import QRModal from '../components/qr/QRModal'
import api from '../utils/api'

export default function MenuDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [themes, setThemes] = useState([])
  const [changingTheme, setChangingTheme] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`/menus/${id}`),
      api.get('/menus/themes')
    ]).then(([menuData, themeData]) => {
      setData(menuData)
      setThemes(themeData.themes)
    }).catch(() => { toast.error('Menü yüklenemedi'); navigate('/') })
      .finally(() => setLoading(false))
  }, [id])

  const changeTheme = async (themeId) => {
    if (data.menu.theme === themeId) return
    setChangingTheme(true)
    try {
      await api.patch(`/menus/${id}/theme`, { theme: themeId })
      setData(d => ({ ...d, menu: { ...d.menu, theme: themeId } }))
      toast.success('Tema güncellendi!')
    } catch { toast.error('Tema değiştirilemedi') }
    finally { setChangingTheme(false) }
  }

  if (loading) return <Layout><div style={styles.center}><div className="spinner" style={{ width: 32, height: 32 }} /></div></Layout>
  if (!data) return null

  const { menu, categories = [], restaurant } = data
  const menuUrl = `${window.location.origin}/m/${menu.slug}`

  return (
    <Layout>
      <div className="fade-in">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.breadcrumb} onClick={() => navigate('/')}>← Menülerim</div>
            <h1 style={styles.title}>{menu.name}</h1>
            <div style={styles.meta}>
              <span className={`badge badge-${menu.type}`}>{menu.type === 'pdf' ? '📄 PDF' : '✨ Akıllı'}</span>
              {menu.theme && <span style={styles.metaTheme}>{menu.theme}</span>}
              <span style={styles.metaUrl}>{menuUrl}</span>
            </div>
          </div>
          <div style={styles.headerActions}>
            <a href={menuUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>
              Önizleme ↗
            </a>
            <button className="btn btn-primary" onClick={() => setShowQR(true)} style={{ fontSize: 13 }}>
              QR Kodunu Göster
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Left: menu items */}
          <div>
            {menu.type === 'smart' && categories.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h2 style={styles.sectionTitle}>Menü İçeriği</h2>
                {categories.map(cat => (
                  <div key={cat.id} style={styles.category}>
                    <div style={styles.catHeader}>{cat.name}</div>
                    <div style={styles.itemList}>
                      {cat.items.map(item => (
                        <div key={item.id} style={styles.item}>
                          <div>
                            <div style={styles.itemName}>{item.name}</div>
                            {item.description && <div style={styles.itemDesc}>{item.description}</div>}
                          </div>
                          <div style={styles.itemPrice}>₺{item.price % 1 === 0 ? item.price.toFixed(0) : item.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {menu.type === 'pdf' && (
              <div className="card">
                <h2 style={styles.sectionTitle}>PDF Menü</h2>
                <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 16 }}>
                  QR kod tarandığında PDF dosyanız müşterilere gösterilecek.
                </p>
                <a href={`/uploads/pdfs/${menu.pdf_path?.split('/').pop()}`} target="_blank"
                  rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>
                  PDF'i Görüntüle ↗
                </a>
              </div>
            )}
          </div>

          {/* Right: QR + theme */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* QR preview */}
            <div className="card" style={{ textAlign: 'center' }}>
              <h2 style={{ ...styles.sectionTitle, textAlign: 'left' }}>QR Kod</h2>
              <div style={styles.qrPreview}>
                <img src={`/${menu.qr_path}`} alt="QR" style={{ width: 140, height: 140, borderRadius: 8 }}
                  onError={e => e.target.style.display = 'none'} />
              </div>
              <button className="btn btn-primary" onClick={() => setShowQR(true)} style={{ width: '100%', marginTop: 12 }}>
                Detaylı Görüntüle & İndir
              </button>
            </div>

            {/* Theme selector (only for smart menus) */}
            {menu.type === 'smart' && (
              <div className="card">
                <h2 style={{ ...styles.sectionTitle, marginBottom: 12 }}>
                  Tema {changingTheme && <span className="spinner" style={{ width: 14, height: 14, display: 'inline-block', marginLeft: 8 }} />}
                </h2>
                <div style={styles.themeList}>
                  {themes.map(t => (
                    <div key={t.id}
                      style={{ ...styles.themeRow, ...(menu.theme === t.id ? styles.themeRowActive : {}) }}
                      onClick={() => changeTheme(t.id)}>
                      <div style={{ ...styles.themeColor, background: t.preview }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.desc}</div>
                      </div>
                      {menu.theme === t.id && <span style={styles.checkmark}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQR && <QRModal menu={menu} onClose={() => setShowQR(false)} />}
    </Layout>
  )
}

const styles = {
  center: { display: 'flex', justifyContent: 'center', padding: 80 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 16 },
  breadcrumb: { fontSize: 13, color: 'var(--text3)', cursor: 'pointer', marginBottom: 6 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 10 },
  meta: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  metaTheme: { fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' },
  metaUrl: { fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' },
  headerActions: { display: 'flex', gap: 10, flexShrink: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' },
  sectionTitle: { fontSize: 15, fontWeight: 600, marginBottom: 16 },
  category: { marginBottom: 20 },
  catHeader: { fontSize: 13, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' },
  itemList: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' },
  itemName: { fontSize: 14, fontWeight: 500 },
  itemDesc: { fontSize: 12, color: 'var(--text3)', marginTop: 2 },
  itemPrice: { fontSize: 14, color: 'var(--accent2)', fontWeight: 600, whiteSpace: 'nowrap' },
  qrPreview: { display: 'flex', justifyContent: 'center', background: '#fff', borderRadius: 10, padding: 16, margin: '0 auto', width: 'fit-content' },
  themeList: { display: 'flex', flexDirection: 'column', gap: 6 },
  themeRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s' },
  themeRowActive: { background: 'rgba(124,111,255,0.08)', border: '1px solid var(--accent)' },
  themeColor: { width: 28, height: 28, borderRadius: 6, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' },
  checkmark: { marginLeft: 'auto', color: 'var(--accent2)', fontWeight: 700, fontSize: 13 },
}
