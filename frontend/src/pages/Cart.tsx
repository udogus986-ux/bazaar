import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartAPI } from '../api'
import { useAuth } from '../context/AuthContext'

interface CartItem {
  id: string; quantity: number
  product: { id: string; name: string; price: number; image: string | null; stock: number; category: string }
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (!user) navigate('/login') }, [user])

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart()
      setCartItems(res.data.cartItems)
      setTotal(res.data.total)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCart() }, [])

  const handleUpdate = async (productId: string, quantity: number) => {
    await cartAPI.updateItem(productId, quantity)
    fetchCart()
  }

  const handleRemove = async (productId: string) => {
    await cartAPI.removeItem(productId)
    fetchCart()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>◆</div>
        <p>Yükleniyor...</p>
      </div>
    </div>
  )

  if (cartItems.length === 0) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, background: 'var(--bg-secondary)',
          borderRadius: 24, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32,
          margin: '0 auto 20px', border: '1px solid var(--border)',
        }}>🛒</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: 'var(--text-primary)', marginBottom: 8 }}>
          Sepetiniz Boş
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          Henüz sepete ürün eklemediniz
        </p>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
            Alışverişe Başla
          </button>
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div className="badge" style={{ marginBottom: 10 }}>Sepetim</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>
          {cartItems.length} Ürün
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Ürünler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cartItems.map((item, i) => (
            <div key={item.id} className="card fade-up" style={{
              animationDelay: `${i * 0.08}s`, opacity: 0,
              padding: '20px',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-secondary)' }}>
                <img src={item.product.image || `https://picsum.photos/100/100?random=${item.product.id}`}
                  alt={item.product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <span className="badge" style={{ marginBottom: 6, fontSize: 9 }}>{item.product.category}</span>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {item.product.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  ₺{item.product.price.toLocaleString('tr-TR')} / adet
                </div>
              </div>

              {/* Adet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <button onClick={() => item.quantity > 1 && handleUpdate(item.product.id, item.quantity - 1)}
                  style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-secondary)', fontFamily: 'DM Sans' }}>
                  −
                </button>
                <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.quantity}
                </span>
                <button onClick={() => item.quantity < item.product.stock && handleUpdate(item.product.id, item.quantity + 1)}
                  style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-secondary)', fontFamily: 'DM Sans' }}>
                  +
                </button>
              </div>

              {/* Toplam */}
              <div style={{ minWidth: 90, textAlign: 'right' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                </div>
                <button onClick={() => handleRemove(item.product.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--accent)', fontFamily: 'DM Sans',
                  marginTop: 4,
                }}>Kaldır</button>
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div className="card" style={{ padding: 28, position: 'sticky', top: 80 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
            Sipariş Özeti
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Ara Toplam', val: `₺${total.toLocaleString('tr-TR')}`, muted: false },
              { label: 'Kargo', val: 'Ücretsiz', muted: true },
              { label: 'İndirim', val: '—', muted: true },
            ].map(({ label, val, muted }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: muted ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                <span>{label}</span>
                <span style={{ color: val === 'Ücretsiz' ? '#28A060' : undefined }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Toplam</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>
              ₺{total.toLocaleString('tr-TR')}
            </span>
          </div>

          <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            Siparişi Tamamla →
          </button>

          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
            Alışverişe devam et
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart