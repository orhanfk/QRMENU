import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './styles/global.css'
import useAuthStore from './stores/authStore'
import api from './utils/api'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NewMenuPage from './pages/NewMenuPage'
import MenuDetailPage from './pages/MenuDetailPage'

function ProtectedRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function AuthRoute({ children }) {
  const { token } = useAuthStore()
  return !token ? children : <Navigate to="/" replace />
}

function AppInit({ children }) {
  const { token, setUser, setLoading, logout } = useAuthStore()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(({ user }) => { setUser(user); setLoading(false) })
        .catch(() => { logout(); setLoading(false) })
        .finally(() => setReady(true))
    } else {
      setLoading(false)
      setReady(true)
    }
  }, [])

  if (!ready) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/menus/new" element={<ProtectedRoute><NewMenuPage /></ProtectedRoute>} />
          <Route path="/menus/:id" element={<ProtectedRoute><MenuDetailPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppInit>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#18181F',
            color: '#F0F0F8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4AE68A', secondary: '#18181F' } },
          error: { iconTheme: { primary: '#FF5E5E', secondary: '#18181F' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
