import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token, user } = await api.post('/auth/login', form)
      setAuth(user, token)
      toast.success(`Hoş geldiniz, ${user.restaurantName}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.error || 'Giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.box} className="fade-in">
        <div style={styles.logo}>
          <QrIcon />
        </div>
        <h1 style={styles.title}>Giriş Yap</h1>
        <p style={styles.sub}>QR Menü panelinize erişin</p>

        <form onSubmit={submit} style={styles.form}>
          <div>
            <label className="label">E-posta</label>
            <input className="input" name="email" type="email" value={form.email}
              onChange={handle} placeholder="restoran@ornek.com" required />
          </div>
          <div>
            <label className="label">Şifre</label>
            <input className="input" name="password" type="password" value={form.password}
              onChange={handle} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'Giriş Yap'}
          </button>
        </form>

        <p style={styles.footer}>
          Hesabınız yok mu?{' '}
          <Link to="/register" style={{ color: 'var(--accent2)' }}>Kayıt Olun</Link>
        </p>
      </div>
    </div>
  )
}

function QrIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="var(--accent)" opacity=".15"/>
      <rect x="8" y="8" width="10" height="10" rx="2" stroke="var(--accent2)" strokeWidth="2" fill="none"/>
      <rect x="22" y="8" width="10" height="10" rx="2" stroke="var(--accent2)" strokeWidth="2" fill="none"/>
      <rect x="8" y="22" width="10" height="10" rx="2" stroke="var(--accent2)" strokeWidth="2" fill="none"/>
      <rect x="11" y="11" width="4" height="4" rx="1" fill="var(--accent2)"/>
      <rect x="25" y="11" width="4" height="4" rx="1" fill="var(--accent2)"/>
      <rect x="11" y="25" width="4" height="4" rx="1" fill="var(--accent2)"/>
      <path d="M22 22h4v4h-4zM28 22h2v2h-2zM26 26h4v4h-4zM22 28h2v2h-2z" fill="var(--accent2)"/>
    </svg>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'radial-gradient(ellipse at 50% 0%, rgba(124,111,255,0.1) 0%, transparent 60%)',
  },
  box: {
    width: '100%',
    maxWidth: 400,
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px 36px',
  },
  logo: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
  sub: { color: 'var(--text2)', fontSize: 14, marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  footer: { marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text2)' },
}
