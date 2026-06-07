import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt olunamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg-primary)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--accent)',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24, margin: '0 auto 16px', color: 'white',
          }}>◆</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            Hesap Oluştur
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Bazaar'a katılın</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{
              background: 'var(--accent-soft)', border: '1px solid var(--accent)',
              color: 'var(--accent)', padding: '10px 14px', borderRadius: 10,
              fontSize: 13, marginBottom: 20,
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Ad Soyad', val: name, set: setName, type: 'text', ph: 'Adın Soyadın' },
              { label: 'Email', val: email, set: setEmail, type: 'email', ph: 'ornek@email.com' },
              { label: 'Şifre', val: password, set: setPassword, type: 'password', ph: 'En az 6 karakter' },
            ].map(({ label, val, set, type, ph }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  type={type} value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph} required
                  className="input-field"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4 }}>
              {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 20 }}>
            Zaten hesabın var mı?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register