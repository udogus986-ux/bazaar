import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { orderAPI } from '../api'
import { useAuth } from '../context/AuthContext'

interface Order {
  id: string; status: string; total: number; createdAt: string
  items: { quantity: number; price: number; product: { name: string; image: string | null } }[]
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  PENDING:    { label: 'Bekliyor',        color: '#92620A', bg: '#FEF3C7', dot: '#D97706' },
  PROCESSING: { label: 'Hazırlanıyor',    color: '#1E40AF', bg: '#DBEAFE', dot: '#3B82F6' },
  SHIPPED:    { label: 'Kargoda',         color: '#5B21B6', bg: '#EDE9FE', dot: '#7C3AED' },
  DELIVERED:  { label: 'Teslim Edildi',   color: '#065F46', bg: '#D1FAE5', dot: '#10B981' },
  CANCELLED:  { label: 'İptal Edildi',    color: '#991B1B', bg: '#FEE2E2', dot: '#EF4444' },
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (!user) navigate('/login') }, [user])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await orderAPI.getMyOrders()
        setOrders(res.data.orders)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>◆</div>
        <p>Yükleniyor...</p>
      </div>
    </div>
  )

  if (orders.length === 0) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: 'var(--bg-secondary)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px', border: '1px solid var(--border)' }}>📦</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: 'var(--text-primary)', marginBottom: 8 }}>Henüz Siparişiniz Yok</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>İlk siparişinizi vermek için alışverişe başlayın</p>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>Alışverişe Başla</button>
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 36 }}>
        <div className="badge" style={{ marginBottom: 10 }}>Geçmiş</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>
          Siparişlerim
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map((order, i) => {
          const st = statusConfig[order.status] || statusConfig.PENDING
          return (
            <div key={order.id} className="card fade-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Sipariş #{order.id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: st.bg, color: st.color,
                    fontSize: 12, fontWeight: 600,
                    padding: '5px 12px', borderRadius: 20,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
                    {st.label}
                  </span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₺{order.total.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {order.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', borderRadius: 10, padding: '8px 12px', border: '1px solid var(--border)' }}>
                    <img src={item.product.image || 'https://picsum.photos/40/40?random=99'} alt=""
                      style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{item.product.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.quantity} adet · ₺{(item.price * item.quantity).toLocaleString('tr-TR')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders