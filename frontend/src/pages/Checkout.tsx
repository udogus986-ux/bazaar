import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartAPI, orderAPI, addressAPI } from '../api'
import { useAuth } from '../context/AuthContext'

interface CartItem {
  id: string; quantity: number
  product: { id: string; name: string; price: number; image: string | null }
}
interface Address {
  id: string; title: string; fullName: string; phone: string
  city: string; district: string; address: string; zipCode?: string; isDefault: boolean
}

const CITIES = ['İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Gaziantep','Mersin','Diyarbakır','Kayseri','Eskişehir','Trabzon','Samsun','Diğer']

// ── Kredi Kartı Komponenti ─────────────────────────
const CreditCard = ({ number, name, expiry, cvv, flipped }: {
  number: string; name: string; expiry: string; cvv: string; flipped: boolean
}) => {
  const formatted = number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  const display = formatted.padEnd(19, '•').slice(0, 19).split('').map((c, i) =>
    [4,9,14].includes(i) ? ' ' : c === '•' ? '•' : c
  ).join('')

  return (
    <div style={{ perspective: 1000, width: 340, height: 200, margin: '0 auto 32px' }}>
      <div style={{
        width: '100%', height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>

        {/* Ön yüz */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          padding: '24px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          {/* Arka plan efekti */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -20, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          {/* Üst satır */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
            <div style={{ display: 'flex', gap: -8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EB001B', opacity: 0.9 }} />
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F79E1B', opacity: 0.9, marginLeft: -14 }} />
            </div>
            <div style={{ width: 48, height: 36, background: 'linear-gradient(135deg, #ffd700, #ffed4e)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 32, height: 24, background: 'rgba(0,0,0,0.15)', borderRadius: 4, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.3)' }} />
              </div>
            </div>
          </div>

          {/* Kart numarası */}
          <div style={{
            fontFamily: 'monospace', fontSize: 20, letterSpacing: 3,
            color: 'white', marginBottom: 20,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
          }}>
            {display || '•••• •••• •••• ••••'}
          </div>

          {/* Alt satır */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Kart Sahibi</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
                {name || 'AD SOYAD'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Son Kul.</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: 'monospace' }}>
                {expiry || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>

        {/* Arka yüz */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          {/* Siyah şerit */}
          <div style={{ background: '#1a1a1a', height: 48, marginTop: 28 }} />
          {/* CVV alanı */}
          <div style={{ padding: '16px 24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 6, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, height: 12, background: 'repeating-linear-gradient(90deg, #ccc 0px, #ccc 8px, transparent 8px, transparent 12px)' }} />
              <div style={{ marginLeft: 16, fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#333', minWidth: 40, textAlign: 'right' }}>
                {cvv || '•••'}
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 8, textAlign: 'right' }}>CVV</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Adres Formu ────────────────────────────────────
const AddressForm = ({ onSave, onCancel }: { onSave: (a: Address) => void; onCancel: () => void }) => {
  const [form, setForm] = useState({ title: 'Ev', fullName: '', phone: '', city: '', district: '', address: '', zipCode: '', isDefault: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.city || !form.district || !form.address) {
      setError('Lütfen tüm zorunlu alanları doldurun')
      return
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Geçerli bir telefon numarası girin')
      return
    }
    setSaving(true)
    try {
      const res = await addressAPI.create(form)
      onSave(res.data.address)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Adres kaydedilemedi')
    } finally { setSaving(false) }
  }

  const f = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }))

  return (
    <div className="card scale-in" style={{ padding: 24, marginTop: 16 }}>
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Yeni Adres Ekle
      </h3>

      {error && <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Adres başlığı */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Adres Başlığı</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Ev', 'İş', 'Diğer'].map(t => (
              <button key={t} type="button" onClick={() => f('title', t)} style={{
  padding: '8px 18px', borderRadius: 20, cursor: 'pointer',
  fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
  background: form.title === t ? 'var(--accent)' : 'var(--bg-secondary)',
  color: form.title === t ? 'white' : 'var(--text-secondary)',
  border: `1px solid ${form.title === t ? 'transparent' : 'var(--border)'}`,
  transition: 'all 0.2s',
}}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ad Soyad *</label>
            <input value={form.fullName} onChange={e => f('fullName', e.target.value)} placeholder="Ad Soyad" className="input-field" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Telefon *</label>
            <input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="05XX XXX XX XX" className="input-field" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Şehir *</label>
            <select value={form.city} onChange={e => f('city', e.target.value)} className="input-field">
              <option value="">Seçin</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>İlçe *</label>
            <input value={form.district} onChange={e => f('district', e.target.value)} placeholder="İlçe" className="input-field" />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Açık Adres *</label>
          <textarea value={form.address} onChange={e => f('address', e.target.value)} placeholder="Mahalle, sokak, bina no, daire no..." rows={3} className="input-field" style={{ resize: 'none' }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Posta Kodu</label>
          <input value={form.zipCode} onChange={e => f('zipCode', e.target.value)} placeholder="34000" className="input-field" style={{ maxWidth: 140 }} />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 20 }}>
          <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Varsayılan adresim olarak kaydet</span>
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '11px 24px' }}>
            {saving ? 'Kaydediliyor...' : 'Adresi Kaydet'}
          </button>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 20px', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans' }}>
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Ana Checkout Sayfası ───────────────────────────
const Checkout = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  // Kart bilgileri
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardFlipped, setCardFlipped] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (!user) navigate('/login') }, [user])

  useEffect(() => {
    const init = async () => {
      try {
        const [cartRes, addrRes] = await Promise.all([cartAPI.getCart(), addressAPI.getAll()])
        if (cartRes.data.cartItems.length === 0) { navigate('/cart'); return }
        setCartItems(cartRes.data.cartItems)
        setTotal(cartRes.data.total)
        setAddresses(addrRes.data.addresses)
        const def = addrRes.data.addresses.find((a: Address) => a.isDefault)
        if (def) setSelectedAddressId(def.id)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    init()
  }, [])

  const handleCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    setCardNumber(formatted)
  }

  const handleExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) setCardExpiry(digits.slice(0, 2) + '/' + digits.slice(2))
    else setCardExpiry(digits)
  }

  const validateCard = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) return 'Kart numarası 16 haneli olmalıdır'
    if (!cardName.trim()) return 'Kart üzerindeki adı girin'
    if (cardExpiry.length !== 5) return 'Son kullanma tarihi MM/YY formatında olmalıdır'
    if (cardCvv.length < 3) return 'CVV en az 3 haneli olmalıdır'
    return null
  }

  const handlePlaceOrder = async () => {
    const cardErr = validateCard()
    if (cardErr) { setError(cardErr); return }
    if (!selectedAddressId) { setError('Lütfen bir teslimat adresi seçin'); return }
    setPlacing(true); setError('')
    try {
      await orderAPI.create({ addressId: selectedAddressId })
      setStep(3)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sipariş verilemedi')
    } finally { setPlacing(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>◆</div>
        <p>Yükleniyor...</p>
      </div>
    </div>
  )

  // ── Adım 3: Başarı ─────────────────────────────
  if (step === 3) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 24 }}>
      <div className="card scale-in" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 440 }}>
        <div style={{
          width: 72, height: 72,
          background: '#EDFAF3', border: '2px solid #10B981',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32, margin: '0 auto 20px',
        }}>✅</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
          Siparişiniz Alındı!
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 28 }}>
          Siparişiniz başarıyla oluşturuldu. Kargo takip bilgileriniz e-posta adresinize gönderilecektir.
        </p>
        <button onClick={() => navigate('/orders')} className="btn-primary" style={{ width: '100%', padding: '13px' }}>
          Siparişlerimi Görüntüle
        </button>
        <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: 10, background: 'none', border: '1px solid var(--border)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans' }}>
          Alışverişe Devam Et
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

      {/* Başlık + adım göstergesi */}
      <div style={{ marginBottom: 36 }}>
        <div className="badge" style={{ marginBottom: 10 }}>Ödeme</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
          Siparişi Tamamla
        </h1>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[{ n: 1, label: 'Adres' }, { n: 2, label: 'Ödeme' }].map(({ n, label }, i) => (
            <>
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: n < step ? 'pointer' : 'default' }}
                onClick={() => n < step && setStep(n as 1 | 2)}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: step >= n ? 'var(--accent)' : 'var(--bg-secondary)',
                  border: step >= n ? 'none' : '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: step >= n ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.3s',
                }}>{n}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: step >= n ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
              </div>
              {i === 0 && <div style={{ flex: 1, height: 1, background: step > 1 ? 'var(--accent)' : 'var(--border)', margin: '0 16px', maxWidth: 60, transition: 'background 0.3s' }} />}
            </>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Sol — Adım içeriği */}
        <div>

          {/* ── ADIM 1: Adres ── */}
          {step === 1 && (
            <div className="fade-up" style={{ opacity: 0 }}>
              <div className="card" style={{ padding: 28, marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                  Teslimat Adresi
                </h2>

                {addresses.length === 0 && !showAddressForm && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>📍</div>
                    <p style={{ marginBottom: 16 }}>Henüz kayıtlı adresiniz yok</p>
                  </div>
                )}

                {addresses.map(addr => (
                  <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} style={{
                    padding: '16px 18px', borderRadius: 14, marginBottom: 10,
                    border: selectedAddressId === addr.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: selectedAddressId === addr.id ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{addr.title}</span>
                          {addr.isDefault && <span className="badge" style={{ fontSize: 9 }}>Varsayılan</span>}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{addr.fullName}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{addr.phone}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{addr.address}, {addr.district} / {addr.city}</div>
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        border: selectedAddressId === addr.id ? '6px solid var(--accent)' : '2px solid var(--border)',
                        transition: 'all 0.2s', flexShrink: 0,
                      }} />
                    </div>
                  </div>
                ))}

                {!showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)} style={{
                    width: '100%', background: 'none',
                    border: '2px dashed var(--border)', borderRadius: 14,
                    padding: '14px', fontSize: 14, fontWeight: 500,
                    color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'DM Sans',
                    transition: 'all 0.2s', marginTop: 4,
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                  >+ Yeni Adres Ekle</button>
                )}
              </div>

              {showAddressForm && (
                <AddressForm
                  onSave={(addr) => {
                    setAddresses(p => [addr, ...p])
                    setSelectedAddressId(addr.id)
                    setShowAddressForm(false)
                  }}
                  onCancel={() => setShowAddressForm(false)}
                />
              )}

              <button
                onClick={() => { if (!selectedAddressId) { setError('Lütfen bir adres seçin'); return } setError(''); setStep(2) }}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 16 }}
              >
                Ödemeye Geç →
              </button>

              {error && <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginTop: 12 }}>{error}</div>}
            </div>
          )}

          {/* ── ADIM 2: Ödeme ── */}
          {step === 2 && (
            <div className="fade-up" style={{ opacity: 0 }}>
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
                  Kart Bilgileri
                </h2>

                {/* Kredi kartı animasyonu */}
                <CreditCard number={cardNumber} name={cardName} expiry={cardExpiry} cvv={cardCvv} flipped={cardFlipped} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Kart numarası */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Kart Numarası *
                    </label>
                    <input
                      value={cardNumber}
                      onChange={e => handleCardNumber(e.target.value)}
                      placeholder="1234  5678  9012  3456"
                      className="input-field"
                      maxLength={19}
                      style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 2 }}
                    />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {cardNumber.replace(/\s/g, '').length}/16 hane
                    </div>
                  </div>

                  {/* Ad */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Kart Üzerindeki Ad *
                    </label>
                    <input
                      value={cardName}
                      onChange={e => setCardName(e.target.value.toUpperCase())}
                      placeholder="AD SOYAD"
                      className="input-field"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  {/* Tarih + CVV */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Son Kullanma *
                      </label>
                      <input
                        value={cardExpiry}
                        onChange={e => handleExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="input-field"
                        maxLength={5}
                        style={{ fontFamily: 'monospace', fontSize: 15 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        CVV *
                      </label>
                      <input
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••"
                        className="input-field"
                        maxLength={4}
                        onFocus={() => setCardFlipped(true)}
                        onBlur={() => setCardFlipped(false)}
                        style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Güvenlik */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', marginTop: 20, border: '1px solid var(--border)' }}>
                  <span>🔒</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>256-bit SSL şifreleme ile korunmaktadır</span>
                </div>

                {error && (
                  <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginTop: 16 }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setStep(1)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 20px', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'DM Sans' }}>
                    ← Geri
                  </button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary" style={{ flex: 1, padding: '13px', fontSize: 15 }}>
                    {placing ? 'İşleniyor...' : `₺${total.toLocaleString('tr-TR')} Öde`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sağ — Sipariş özeti */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Sipariş Özeti
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={item.product.image || 'https://picsum.photos/48/48?random=1'} alt=""
                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.product.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.quantity} adet</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            {[
              { label: 'Ara Toplam', val: `₺${total.toLocaleString('tr-TR')}` },
              { label: 'Kargo', val: 'Ücretsiz', green: true },
              { label: 'Vergi (%20)', val: `₺${Math.round(total * 0.20).toLocaleString('tr-TR')}` },
            ].map(({ label, val, green }: any) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                <span>{label}</span>
                <span style={{ color: green ? '#10B981' : undefined }}>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Toplam</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
                ₺{total.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {/* Seçili adres özeti */}
          {selectedAddressId && step === 2 && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Teslimat Adresi</div>
              {(() => {
                const addr = addresses.find(a => a.id === selectedAddressId)
                return addr ? (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 500 }}>{addr.fullName}</div>
                    <div>{addr.address}</div>
                    <div>{addr.district} / {addr.city}</div>
                  </div>
                ) : null
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout