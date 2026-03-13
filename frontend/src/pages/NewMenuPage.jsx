import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/shared/Layout'
import QRModal from '../components/qr/QRModal'
import api from '../utils/api'

export default function NewMenuPage() {
  const [mode, setMode] = useState(null) // 'pdf' | 'smart'
  const [createdMenu, setCreatedMenu] = useState(null)
  const navigate = useNavigate()

  if (createdMenu) return (
    <Layout>
      <SuccessScreen menu={createdMenu} onDone={() => navigate('/')} />
    </Layout>
  )

  return (
    <Layout>
      <div className="fade-in">
        <div style={styles.header}>
          <h1 style={styles.title}>Yeni Menü Oluştur</h1>
          <p style={styles.sub}>İki yöntemden birini seçin</p>
        </div>

        {!mode ? (
          <ModeSelector onSelect={setMode} />
        ) : mode === 'pdf' ? (
          <PDFUploader onBack={() => setMode(null)} onSuccess={setCreatedMenu} />
        ) : (
          <SmartMenuWizard onBack={() => setMode(null)} onSuccess={setCreatedMenu} />
        )}
      </div>
    </Layout>
  )
}

function ModeSelector({ onSelect }) {
  return (
    <div style={styles.modeGrid}>
      <ModeCard
        icon="📄"
        title="PDF Menü"
        badge="Basit"
        badgeColor="var(--green)"
        desc="Hazır PDF menünüzü yükleyin. QR kod tarandığında PDF doğrudan açılır."
        features={['Hazır PDF\'inizi yükleyin', 'Anında QR kod alın', 'PDF açılır, değişiklik yok']}
        btnLabel="PDF Yükle"
        onClick={() => onSelect('pdf')}
      />
      <ModeCard
        icon="✨"
        title="Akıllı Menü"
        badge="Gelişmiş"
        badgeColor="var(--accent2)"
        desc="Excel şablonunu doldurun, tema seçin. Mobil uyumlu dijital menü oluşturulur."
        features={['Excel şablonuyla kolay giriş', '10 profesyonel tema', 'Logo yükleme desteği', 'Mobil uyumlu HTML menü']}
        btnLabel="Başla"
        onClick={() => onSelect('smart')}
        featured
      />
    </div>
  )
}

function ModeCard({ icon, title, badge, badgeColor, desc, features, btnLabel, onClick, featured }) {
  return (
    <div style={{ ...styles.modeCard, ...(featured ? styles.modeCardFeatured : {}) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ fontSize: 36 }}>{icon}</span>
        <span style={{ ...styles.badge, background: `${badgeColor}22`, color: badgeColor }}>{badge}</span>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{desc}</p>
      <ul style={styles.featureList}>
        {features.map(f => (
          <li key={f} style={styles.featureItem}>
            <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={onClick} style={{ width: '100%', marginTop: 'auto', paddingTop: 12, paddingBottom: 12 }}>
        {btnLabel}
      </button>
    </div>
  )
}

function PDFUploader({ onBack, onSuccess }) {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('PDF dosyası seçin')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('pdf', file)
      const { menu } = await api.post('/menus/pdf', fd)
      toast.success('PDF menü oluşturuldu!')
      onSuccess(menu)
    } catch (err) {
      toast.error(err.error || 'Yükleme başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wizard}>
      <button onClick={onBack} style={styles.backBtn}><BackIcon /> Geri</button>
      <h2 style={styles.wizardTitle}>PDF Menü Yükle</h2>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="label">Menü Adı</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)}
            placeholder="Örn: Yaz Menüsü 2025" required />
        </div>

        <div>
          <label className="label">PDF Dosyası</label>
          <div style={{ ...styles.dropzone, ...(file ? styles.dropzoneActive : {}) }}
            onClick={() => fileRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]) }}>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
              onChange={e => setFile(e.target.files[0])} />
            {file ? (
              <>
                <span style={{ fontSize: 28 }}>📄</span>
                <strong style={{ fontSize: 14 }}>{file.name}</strong>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 32 }}>⬆️</span>
                <strong style={{ fontSize: 14 }}>PDF dosyasını sürükleyin veya tıklayın</strong>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>Maksimum 20 MB</span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-ghost" onClick={onBack} style={{ flex: 1 }}>İptal</button>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
            {loading ? <><span className="spinner" /> Yükleniyor...</> : 'Menü Oluştur ve QR Al'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SmartMenuWizard({ onBack, onSuccess }) {
  const [step, setStep] = useState(1) // 1: info, 2: excel, 3: theme
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [themes, setThemes] = useState([])
  const [theme, setTheme] = useState('elegant')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    api.get('/menus/themes').then(({ themes }) => setThemes(themes)).catch(() => {})
  }, [])

  const downloadTemplate = async () => {
    const a = document.createElement('a')
    a.href = '/api/menus/template'
    a.download = 'menu-sablonu.xlsx'
    a.click()
    toast.success('Şablon indiriliyor...')
  }

  const submit = async () => {
    if (!file) return toast.error('Excel dosyası seçin')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('theme', theme)
      fd.append('excel', file)
      const { menu } = await api.post('/menus/smart', fd)
      toast.success('Akıllı menü oluşturuldu!')
      onSuccess(menu)
    } catch (err) {
      toast.error(err.error || 'Oluşturma başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wizard}>
      <button onClick={onBack} style={styles.backBtn}><BackIcon /> Geri</button>

      {/* Steps */}
      <div style={styles.steps}>
        {['Menü Adı', 'Excel Yükle', 'Tema Seç'].map((s, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{ ...styles.stepDot, ...(step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : {}) }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, color: step === i + 1 ? 'var(--text)' : 'var(--text3)' }}>{s}</span>
            {i < 2 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={styles.wizardTitle}>Menü adını girin</h2>
          <div>
            <label className="label">Menü Adı</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)}
              placeholder="Örn: Akşam Menüsü" autoFocus />
          </div>
          <button className="btn btn-primary" onClick={() => name.trim() && setStep(2)}
            disabled={!name.trim()} style={{ alignSelf: 'flex-end', padding: '10px 28px' }}>
            İleri →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={styles.wizardTitle}>Excel şablonunu doldurun</h2>
          <div style={styles.infoBox}>
            <span style={{ fontSize: 20 }}>📋</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Excel şablonu indirin</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>Kategori, ürün adı, açıklama ve fiyatları doldurun</div>
            </div>
            <button className="btn btn-ghost" onClick={downloadTemplate} style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
              İndir
            </button>
          </div>

          <div>
            <label className="label">Doldurulmuş Excel Dosyası</label>
            <div style={{ ...styles.dropzone, ...(file ? styles.dropzoneActive : {}) }}
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]) }}>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <><span style={{ fontSize: 28 }}>📊</span><strong style={{ fontSize: 14 }}>{file.name}</strong></>
              ) : (
                <><span style={{ fontSize: 32 }}>⬆️</span><strong style={{ fontSize: 14 }}>Excel dosyasını yükleyin</strong><span style={{ fontSize: 12, color: 'var(--text3)' }}>.xlsx formatı</span></>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Geri</button>
            <button className="btn btn-primary" onClick={() => file && setStep(3)} disabled={!file} style={{ flex: 2 }}>
              Tema Seçimine Geç →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={styles.wizardTitle}>Menü temasını seçin</h2>
          <div style={styles.themeGrid}>
            {themes.map(t => (
              <div key={t.id} style={{ ...styles.themeCard, ...(theme === t.id ? styles.themeCardActive : {}) }}
                onClick={() => setTheme(t.id)}>
                <div style={{ ...styles.themePreview, background: t.preview }} />
                <div style={styles.themeInfo}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.desc}</div>
                </div>
                {theme === t.id && <span style={styles.themeCheck}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>← Geri</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ flex: 2 }}>
              {loading ? <><span className="spinner" /> Oluşturuluyor...</> : '🚀 Menüyü Oluştur'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SuccessScreen({ menu, onDone }) {
  const [showQR, setShowQR] = useState(true)
  return (
    <div style={styles.success} className="fade-in">
      <div style={styles.successIcon}>🎉</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Menünüz Hazır!</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32 }}>
        <strong style={{ color: 'var(--text)' }}>{menu.name}</strong> başarıyla oluşturuldu
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => setShowQR(true)}>QR Kodunu Gör</button>
        <button className="btn btn-primary" onClick={onDone}>Dashboard'a Dön</button>
      </div>
      {showQR && <QRModal menu={menu} onClose={() => { setShowQR(false); onDone() }} />}
    </div>
  )
}

function BackIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
}

const styles = {
  header: { marginBottom: 32 },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  sub: { color: 'var(--text2)', fontSize: 14 },
  modeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 700 },
  modeCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', flexDirection: 'column' },
  modeCardFeatured: { border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent), 0 8px 32px rgba(124,111,255,0.15)' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 },
  featureItem: { display: 'flex', gap: 8, fontSize: 13, color: 'var(--text2)', alignItems: 'flex-start' },
  wizard: { maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 28 },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text2)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: 0 },
  wizardTitle: { fontSize: 20, fontWeight: 700 },
  steps: { display: 'flex', alignItems: 'center', gap: 0 },
  stepItem: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 },
  stepLine: { flex: 1, height: 1, background: 'var(--border)', margin: '0 8px' },
  stepDot: { width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, background: 'var(--bg3)', color: 'var(--text3)', flexShrink: 0 },
  stepActive: { background: 'var(--accent)', color: '#fff' },
  stepDone: { background: 'rgba(74,230,138,0.15)', color: 'var(--green)' },
  dropzone: { border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' },
  dropzoneActive: { borderColor: 'var(--accent)', background: 'rgba(124,111,255,0.05)' },
  infoBox: { display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 18px' },
  themeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 },
  themeCard: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'border-color 0.15s' },
  themeCardActive: { border: '2px solid var(--accent)' },
  themePreview: { height: 60, width: '100%' },
  themeInfo: { padding: '8px 10px' },
  themeCheck: { position: 'absolute', top: 6, right: 6, background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 },
  success: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' },
  successIcon: { fontSize: 56, marginBottom: 16 },
}
