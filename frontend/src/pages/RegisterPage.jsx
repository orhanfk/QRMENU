import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../stores/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ restaurantName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Şifre en az 6 karakter olmalı')
    setLoading(true)
    try {
      const { token, user, restaurant } = await api.post('/auth/register', form)
      setAuth(user, token)
      toast.success(`${restaurant.name} başarıyla oluşturuldu!`)
      navigate('/')
    } catch (err) {
      toast.error(err.error || 'Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.box} className="fade-in">
        <h1 style={styles.title}>Hesap Oluştur</h1>
        <p style={styles.sub}>Restoranınız için QR menü sistemi kurun</p>

        <form onSubmit={submit} style={styles.form}>
          <div>
            <label className="label">Restoran / İşletme Adı</label>
            <input className="input" name="restaurantName" value={form.restaurantName}
              onChange={handle} placeholder="Örn: Deniz Restaurant" required />
          </div>
          <div>
            <label className="label">E-posta</label>
            <input className="input" name="email" type="email" value={form.email}
              onChange={handle} placeholder="siz@ornek.com" required />
          </div>
          <div>
            <label className="label">Şifre</label>
            <input className="input" name="password" type="password" value={form.password}
              onChange={handle} placeholder="En az 6 karakter" required />
          </div>

          <div style={styles.features}>
            {['PDF menü yükle ve QR üret', 'Excel\'den akıllı menü oluştur', '10 profesyonel tema'].map(f => (
              <div key={f} style={styles.feat}>
                <span style={{ color: 'var(--green)' }}>✓</span> {f}
              </div>
            ))}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px' }}>
            {loading ? <span className="spinner" /> : 'Ücretsiz Başla'}
          </button>
        </form>

        <p style={styles.footer}>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)' }}>Giriş Yapın</Link>
        </p>
      </div>
    </div>
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
    maxWidth: 420,
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px 36px',
  },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
  sub: { color: 'var(--text2)', fontSize: 14, marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  features: { background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 },
  feat: { fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8 },
  footer: { marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text2)' },
}
