import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI, cartAPI } from '../api'
import { useAuth } from '../context/AuthContext'

interface Product {
  id: string; name: string; description: string
  price: number; stock: number; image: string | null; category: string
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productAPI.getOne(id!)
        setProduct(res.data.product)
      } catch { navigate('/') }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await cartAPI.addItem(product!.id, quantity)
      setMessage('Sepete eklendi!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Hata oluştu')
    } finally { setAdding(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>◆</div>
        <p>Yükleniyor...</p>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: '1px solid var(--border)',
        borderRadius: 10, padding: '8px 16px',
        fontSize: 13, fontWeight: 500,
        color: 'var(--text-secondary)', cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        marginBottom: 32,
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.2s',
      }}>← Geri dön</button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        background: 'var(--bg-card)',
        borderRadius: 24,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
      }}>
        {/* Sol — Resim */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 460 }}>
          <img
            src={product.image || `https://picsum.photos/600/500?random=${product.id}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(200,75,49,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Sağ — Bilgiler */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="badge" style={{ marginBottom: 16, alignSelf: 'flex-start' }}>
            {product.category}
          </span>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>{product.name}</h1>

          <p style={{
            fontSize: 15, color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: 28,
          }}>{product.description}</p>

          {/* Fiyat */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8,
            marginBottom: 8,
          }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 42, fontWeight: 700,
              color: 'var(--text-primary)',
            }}>₺{product.price.toLocaleString('tr-TR')}</span>
          </div>

          {/* Stok */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, marginBottom: 28,
            color: product.stock === 0 ? 'var(--accent)' : product.stock <= 5 ? '#C07020' : '#28A060',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: product.stock === 0 ? 'var(--accent)' : product.stock <= 5 ? '#C07020' : '#28A060',
            }} />
            {product.stock === 0 ? 'Stok tükendi' : product.stock <= 5 ? `Son ${product.stock} ürün` : `${product.stock} adet stokta`}
          </div>

          {product.stock > 0 && (
            <>
              {/* Adet */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Adet
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{
                    width: 42, height: 42, background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)',
                    borderRadius: '12px 0 0 12px', transition: 'background 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>−</button>
                  <span style={{ width: 40, textAlign: 'center', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{
                    width: 42, height: 42, background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)',
                    borderRadius: '0 12px 12px 0', transition: 'background 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>+</button>
                </div>
              </div>

              {message && (
                <div className="fade-up" style={{
                  background: message.includes('Hata') ? 'var(--accent-soft)' : '#EDFAF3',
                  border: `1px solid ${message.includes('Hata') ? 'var(--accent)' : '#28A060'}`,
                  color: message.includes('Hata') ? 'var(--accent)' : '#28A060',
                  padding: '10px 16px', borderRadius: 10,
                  fontSize: 13, fontWeight: 500, marginBottom: 16,
                }}>{message}</div>
              )}

              <button onClick={handleAddToCart} disabled={adding} className="btn-primary"
                style={{ fontSize: 15, padding: '14px 28px' }}>
                {adding ? '...' : '🛒 Sepete Ekle'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail