import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

export default function QRModal({ menu, onClose }) {
  const menuUrl = `${window.location.origin}/m/${menu.slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(menuUrl)
    toast.success('Bağlantı kopyalandı!')
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-svg-export')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 400
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 400, 400)
      ctx.drawImage(img, 0, 0, 400, 400)
      const a = document.createElement('a')
      a.download = `qr-${menu.slug}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
      toast.success('QR kod indirildi!')
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="fade-in">
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{menu.name}</h2>
            <p style={styles.sub}>QR kodu tarayarak menüye erişin</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.qrWrap}>
          <div style={styles.qrBox}>
            <QRCodeSVG
              id="qr-svg-export"
              value={menuUrl}
              size={200}
              level="M"
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
          </div>
          <div style={styles.badge}>
            <span style={{ fontSize: 12, marginRight: 6 }}>{menu.type === 'pdf' ? '📄' : '✨'}</span>
            {menu.type === 'pdf' ? 'PDF Menü' : 'Akıllı Menü'} — {menu.name}
          </div>
        </div>

        <div style={styles.urlRow}>
          <code style={styles.url}>{menuUrl}</code>
          <button className="btn btn-ghost" onClick={copyLink} style={{ padding: '8px 14px', fontSize: 13 }}>
            Kopyala
          </button>
        </div>

        <div style={styles.actions}>
          <button className="btn btn-ghost" onClick={downloadQR} style={{ flex: 1 }}>
            <DownloadIcon /> PNG İndir
          </button>
          <a href={menuUrl} target="_blank" rel="noreferrer"
            className="btn btn-primary" style={{ flex: 1 }}>
            <ExternalIcon /> Menüyü Aç
          </a>
        </div>
      </div>
    </div>
  )
}

function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 2v9M4 8l4 4 4-4M2 14h12"/>
  </svg>
}
function ExternalIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M9 2h5v5M8 8l6-6"/>
  </svg>
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modal: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: 32, width: '100%', maxWidth: 420,
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: 'var(--text2)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, padding: 4 },
  qrWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 24 },
  qrBox: {
    background: '#fff', padding: 20, borderRadius: 16,
    boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
  },
  badge: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '5px 14px', fontSize: 13, color: 'var(--text2)',
  },
  urlRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg3)', borderRadius: 'var(--radius-sm)',
    padding: '8px 8px 8px 14px', marginBottom: 16,
    border: '1px solid var(--border)',
  },
  url: { flex: 1, fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  actions: { display: 'flex', gap: 10 },
}
