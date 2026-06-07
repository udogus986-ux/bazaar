import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  )
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    if (isDark) {
      root.classList.remove('dark')
      setIsDark(false)
    } else {
      root.classList.add('dark')
      setIsDark(true)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{
      background: scrolled ? 'var(--bg-card)' : 'var(--bg-primary)',
      borderBottom: '1px solid var(--border)',
      boxShadow: scrolled ? 'var(--shadow)' : 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--accent)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: 'white', fontWeight: 700,
          }}>◆</div>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 22, fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>Bazaar</span>
        </Link>

        {/* Orta linkler */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            { to: '/', label: 'Keşfet' },
            ...(user ? [{ to: '/cart', label: '🛒 Sepet' }] : []),
            ...(user ? [{ to: '/orders', label: 'Siparişlerim' }] : []),
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              color: isActive(to) ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: isActive(to) ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: 2,
              transition: 'color 0.2s ease',
            }}>{label}</Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" style={{
              textDecoration: 'none',
              fontSize: 13, fontWeight: 600,
              color: 'var(--gold)',
              background: 'rgba(212,168,71,0.1)',
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid rgba(212,168,71,0.3)',
            }}>✦ Admin</Link>
          )}
        </div>

        {/* Sağ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{
            width: 38, height: 38,
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{isDark ? '☀️' : '🌙'}</button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: 'var(--accent)',
              }}>{user.name.charAt(0).toUpperCase()}</div>
              <button onClick={handleLogout} style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 10, padding: '6px 14px',
                fontSize: 13, fontWeight: 500,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>Çıkış</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={{
                textDecoration: 'none', padding: '8px 16px',
                borderRadius: 10, fontSize: 14, fontWeight: 500,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}>Giriş</Link>
              <Link to="/register" style={{
                textDecoration: 'none', padding: '8px 16px',
                borderRadius: 10, fontSize: 14, fontWeight: 500,
                color: 'white', background: 'var(--accent)',
              }}>Kayıt Ol</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar