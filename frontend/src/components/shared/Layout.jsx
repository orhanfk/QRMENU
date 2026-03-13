import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import toast from 'react-hot-toast'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Çıkış yapıldı')
    navigate('/login')
  }

  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <div style={styles.sideTop}>
          <div style={styles.brand}>
            <QrIcon />
            <span style={styles.brandName}>QR Menü</span>
          </div>

          <div style={styles.restaurant}>
            <div style={styles.avatar}>{(user?.restaurantName || 'R')[0].toUpperCase()}</div>
            <div>
              <div style={styles.restName}>{user?.restaurantName || '—'}</div>
              <div style={styles.restEmail}>{user?.email}</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <NavItem to="/" icon={<GridIcon />} label="Menülerim" active={location.pathname === '/'} />
            <NavItem to="/menus/new" icon={<PlusIcon />} label="Yeni Menü" active={location.pathname === '/menus/new'} />
          </nav>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogoutIcon /> Çıkış Yap
        </button>
      </aside>

      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}>
      <span style={{ opacity: active ? 1 : 0.5 }}>{icon}</span>
      {label}
    </Link>
  )
}

function QrIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="var(--accent)" opacity=".2"/>
      <rect x="5" y="5" width="7" height="7" rx="1.5" stroke="var(--accent2)" strokeWidth="1.5" fill="none"/>
      <rect x="16" y="5" width="7" height="7" rx="1.5" stroke="var(--accent2)" strokeWidth="1.5" fill="none"/>
      <rect x="5" y="16" width="7" height="7" rx="1.5" stroke="var(--accent2)" strokeWidth="1.5" fill="none"/>
      <rect x="7.5" y="7.5" width="2" height="2" rx=".5" fill="var(--accent2)"/>
      <rect x="18.5" y="7.5" width="2" height="2" rx=".5" fill="var(--accent2)"/>
      <rect x="7.5" y="18.5" width="2" height="2" rx=".5" fill="var(--accent2)"/>
      <path d="M16 16h2.5v2.5H16zM19.5 16H22v2.5h-2.5zM18 19h2.5v2.5H18zM16 21.5h2v2.5h-2z" fill="var(--accent2)"/>
    </svg>
  )
}

function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/>
  </svg>
}
function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10"/>
  </svg>
}
function LogoutIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10 3h3a1 1 0 011 1v8a1 1 0 01-1 1h-3M7 11l3-3-3-3M10 8H2"/>
  </svg>
}

const styles = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar: {
    width: 220,
    minWidth: 220,
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 12px',
  },
  sideTop: { display: 'flex', flexDirection: 'column', gap: 24 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' },
  brandName: { fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' },
  restaurant: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px',
  },
  avatar: {
    width: 34, height: 34, borderRadius: 8,
    background: 'var(--accent)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  restName: { fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 },
  restEmail: { fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: 'var(--text2)',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(124,111,255,0.12)',
    color: 'var(--accent2)',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 12px', borderRadius: 8,
    fontSize: 13, color: 'var(--text3)',
    background: 'transparent', cursor: 'pointer',
    border: 'none', transition: 'color 0.15s',
    fontFamily: 'inherit',
  },
  main: { flex: 1, overflow: 'auto', padding: 32 },
}
