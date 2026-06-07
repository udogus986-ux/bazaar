import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI, orderAPI } from '../api'
import { useAuth } from '../context/AuthContext'

interface Product {
  id: string; name: string; price: number; stock: number
  category: string; image: string | null; description: string
}
interface Order {
  id: string; status: string; total: number; createdAt: string
  user: { name: string; email: string }
  items: { quantity: number; product: { name: string } }[]
  address?: {
    fullName: string; phone: string; address: string
    district: string; city: string; zipCode?: string
  }
}

const statusMap: Record<string, string> = {
  PENDING: 'Bekliyor', PROCESSING: 'Hazırlanıyor',
  SHIPPED: 'Kargoda', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal Edildi',
}
const statusColors: Record<string, string> = {
  PENDING: '#D97706', PROCESSING: '#3B82F6',
  SHIPPED: '#7C3AED', DELIVERED: '#10B981', CANCELLED: '#EF4444',
}

const emptyForm = { name: '', description: '', price: '', stock: '', category: '', image: '' }

const Admin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'ADMIN') { navigate('/'); return }
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [p, o] = await Promise.all([productAPI.getAll(), orderAPI.getAll()])
      setProducts(p.data.products)
      setOrders(o.data.orders)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) { await productAPI.update(editingId, form); showMsg('✅ Ürün güncellendi') }
      else { await productAPI.create(form); showMsg('✅ Ürün eklendi') }
      setForm(emptyForm); setEditingId(null); setShowForm(false)
      fetchAll()
    } catch (err: any) { showMsg(err.response?.data?.message || 'Hata oluştu') }
  }

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), stock: String(p.stock), category: p.category, image: p.image || '' })
    setEditingId(p.id); setShowForm(true); window.scrollTo(0, 0)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await productAPI.delete(id); showMsg('✅ Ürün silindi'); fetchAll()
  }

  const handleStatus = async (orderId: string, status: string) => {
    await orderAPI.updateStatus(orderId, status); fetchAll()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>◆</div>
        <p>Yükleniyor...</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

      {/* Başlık */}
      <div style={{ marginBottom: 32 }}>
        <span className="badge badge-gold" style={{ marginBottom: 10 }}>✦ Admin</span>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>
          Yönetim Paneli
        </h1>
      </div>

      {/* İstatistik kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Toplam Ürün', value: products.length, icon: '📦', color: 'var(--accent)' },
          { label: 'Toplam Sipariş', value: orders.length, icon: '🛒', color: 'var(--gold)' },
          { label: 'Bekleyen', value: orders.filter(o => o.status === 'PENDING').length, icon: '⏳', color: '#D97706' },
          { label: 'Teslim Edilen', value: orders.filter(o => o.status === 'DELIVERED').length, icon: '✅', color: '#10B981' },
        ].map((s, i) => (
          <div key={i} className="card fade-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0, padding: '20px 24px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mesaj */}
      {message && (
        <div className="fade-up" style={{
          background: message.includes('✅') ? '#EDFAF3' : 'var(--accent-soft)',
          border: `1px solid ${message.includes('✅') ? '#10B981' : 'var(--accent)'}`,
          color: message.includes('✅') ? '#065F46' : 'var(--accent)',
          padding: '12px 16px', borderRadius: 12, fontSize: 13, marginBottom: 20,
        }}>{message}</div>
      )}

      {/* Tablar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['products', 'orders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 24px', borderRadius: 24,
            border: tab === t ? 'none' : '1px solid var(--border)',
            background: tab === t ? 'var(--accent)' : 'var(--bg-card)',
            color: tab === t ? 'white' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: tab === t ? '0 2px 12px rgba(200,75,49,0.3)' : 'none',
            transition: 'all 0.2s',
          }}>
            {t === 'products' ? `📦 Ürünler (${products.length})` : `🛒 Siparişler (${orders.length})`}
          </button>
        ))}
      </div>

      {/* ÜRÜNLER */}
      {tab === 'products' && (
        <div>
          <button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditingId(null) }}
            className="btn-primary" style={{ marginBottom: 20, padding: '10px 22px' }}>
            {showForm ? '✕ Kapat' : '+ Yeni Ürün'}
          </button>

          {showForm && (
            <div className="card scale-in" style={{ padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                {editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Ürün Adı', key: 'name', ph: 'iPhone 15 Pro' },
                  { label: 'Kategori', key: 'category', ph: 'Elektronik' },
                  { label: 'Fiyat (₺)', key: 'price', ph: '45000' },
                  { label: 'Stok', key: 'stock', ph: '50' },
                  { label: 'Resim URL', key: 'image', ph: 'https://...' },
                ].map(({ label, key, ph }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {label}
                    </label>
                    <input type="text" value={(form as any)[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={ph} className="input-field" />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Açıklama
                  </label>
                  <textarea value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Ürün açıklaması..." rows={3}
                    className="input-field" style={{ resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn-primary" style={{ padding: '11px 24px' }}>
                    {editingId ? 'Güncelle' : 'Ekle'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null) }}
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 20px', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans' }}>
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ürün tablosu */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['Ürün', 'Kategori', 'Fiyat', 'Stok', 'İşlemler'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image || `https://picsum.photos/40/40?random=${i}`} alt=""
                            style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
                          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge" style={{ fontSize: 10 }}>{p.category}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₺{p.price.toLocaleString('tr-TR')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: p.stock === 0 ? 'var(--accent)' : p.stock <= 5 ? '#D97706' : '#10B981' }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleEdit(p)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans', transition: 'all 0.2s' }}>
                            Düzenle
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: '1px solid var(--accent)', borderRadius: 8, padding: '5px 12px', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'DM Sans', transition: 'all 0.2s' }}>
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SİPARİŞLER */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order, i) => (
            <div key={order.id} className="card fade-up" style={{ animationDelay: `${i * 0.06}s`, opacity: 0, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                    #{order.id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {order.user.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.user.email}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                    {order.items.map(it => `${it.product.name} x${it.quantity}`).join(' · ')}
                  </div>

                  {/* Adres bilgisi */}
                  {order.address && (
                    <div style={{
                      marginTop: 12, padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 10, border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                    }}>
                      <span style={{ fontSize: 14 }}>📍</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {order.address.fullName} — {order.address.phone}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {order.address.address}, {order.address.district} / {order.address.city}
                          {order.address.zipCode ? ` — ${order.address.zipCode}` : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₺{order.total.toLocaleString('tr-TR')}
                  </span>
                  <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)}
                    style={{
                      border: `1px solid ${statusColors[order.status] || 'var(--border)'}`,
                      borderRadius: 10, padding: '6px 12px',
                      fontSize: 12, fontWeight: 600,
                      color: statusColors[order.status] || 'var(--text-secondary)',
                      background: 'var(--bg-card)',
                      cursor: 'pointer', fontFamily: 'DM Sans',
                      outline: 'none',
                    }}>
                    {Object.entries(statusMap).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin