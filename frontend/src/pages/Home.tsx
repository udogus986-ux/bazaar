import { useState, useEffect, useRef } from 'react'
import { productAPI } from '../api'
import ProductCard from '../components/ProductCard'

interface Product {
  id: string; name: string; description: string
  price: number; stock: number; image: string | null; category: string
}

const categories = ['Hepsi', 'Elektronik', 'Giyim', 'Ev & Yaşam', 'Spor', 'Kitap']

const STATS = [
  { value: '2.400+', label: 'Ürün' },
  { value: '98%',    label: 'Memnuniyet' },
  { value: '1 Gün',  label: 'Teslimat' },
  { value: '7/24',   label: 'Destek' },
]

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Hepsi')
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero animasyonunu tetikle
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (selectedCategory !== 'Hepsi') params.category = selectedCategory
      const res = await productAPI.getAll(params)
      setProducts(res.data.products)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [selectedCategory])
  useEffect(() => {
    const t = setTimeout(fetchProducts, 500)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 520,
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
      }}>

        {/* Arka plan geometrik şekiller */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(200,75,49,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(201,146,42,0.08) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(200,75,49,0.05) 0%, transparent 35%)
          `,
        }} />

        {/* Dönen büyük çember */}
        <div style={{
          position: 'absolute', right: -120, top: -120,
          width: 600, height: 600,
          border: '1px solid var(--border)',
          borderRadius: '50%',
          animation: 'spin-slow 40s linear infinite',
          opacity: 0.4,
        }} />
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 480, height: 480,
          border: '1px solid rgba(200,75,49,0.15)',
          borderRadius: '50%',
          animation: 'spin-slow 30s linear infinite reverse',
        }} />

        {/* Floating diamond shapes */}
        {[
          { size: 40, top: '15%', left: '8%', delay: '0s', color: 'var(--accent)' },
          { size: 24, top: '60%', left: '15%', delay: '1.2s', color: 'var(--gold)' },
          { size: 16, top: '30%', left: '40%', delay: '0.6s', color: 'var(--accent)' },
          { size: 32, top: '70%', right: '25%', delay: '1.8s', color: 'var(--gold)' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: s.top, left: (s as any).left, right: (s as any).right,
            width: s.size, height: s.size,
            background: s.color,
            opacity: 0.15,
            transform: 'rotate(45deg)',
            animation: `float 4s ease-in-out ${s.delay} infinite`,
          }} />
        ))}

        {/* Hero içerik */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 580 }}>

            <div className={`badge badge-gold ${heroVisible ? 'fade-up stagger-1' : ''}`}
              style={{ marginBottom: 20, fontSize: 11 }}>
              ✦ 2025 Yeni Koleksiyon
            </div>

            <h1 className={heroVisible ? 'fade-up stagger-2' : ''} style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 700,
              lineHeight: 1.05,
              color: 'var(--text-primary)',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}>
              Seçkin<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Ürünler,</em><br />
              Özgün Zevk
            </h1>

            <p className={heroVisible ? 'fade-up stagger-3' : ''} style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 420,
            }}>
              Binlerce özenle seçilmiş ürün, güvenli ödeme ve hızlı teslimat ile kapınızda.
            </p>

            <div className={heroVisible ? 'fade-up stagger-4' : ''} style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn-primary"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ fontSize: 15, padding: '13px 28px' }}
              >
                Alışverişe Başla
              </button>
              <button style={{
                background: 'none',
                border: '1px solid var(--border-strong)',
                borderRadius: 12,
                padding: '13px 24px',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; (e.target as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.target as HTMLElement).style.color = 'var(--text-secondary)' }}
              >
                Keşfet →
              </button>
            </div>
          </div>
        </div>

        {/* Sağ dekoratif resim kartları */}
        <div style={{
          position: 'absolute',
          right: 60, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 12,
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          {['?random=10', '?random=20', '?random=30'].map((r, i) => (
            <div key={i} style={{
              width: i === 1 ? 180 : 140,
              height: i === 1 ? 140 : 110,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              marginLeft: i === 1 ? 0 : i === 0 ? 30 : 20,
              animation: `float ${3.5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
            }}>
              <img src={`https://picsum.photos/200/160${r}`} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <div style={{
        background: 'var(--accent)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="fade-up" style={{
              animationDelay: `${0.1 * i}s`, opacity: 0,
              textAlign: 'center',
              padding: '8px 0',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', fontFamily: 'Cormorant Garamond, serif' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ÜRÜNLER BÖLÜMÜ ─────────────────────────────────── */}
      <div id="products" style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>

        {/* Bölüm başlığı */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge" style={{ marginBottom: 10 }}>Koleksiyon</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}>
              Tüm Ürünler
            </h2>
          </div>

          {/* Arama */}
          <div style={{ position: 'relative', minWidth: 280 }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontSize: 16, pointerEvents: 'none',
            }}>⌕</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="input-field"
              style={{ paddingLeft: 40, width: '100%' }}
            />
          </div>
        </div>

        {/* Kategoriler */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
              padding: '8px 20px',
              borderRadius: 24,
              border: selectedCategory === cat ? 'none' : '1px solid var(--border)',
              background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-card)',
              color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === cat ? '0 2px 12px rgba(200,75,49,0.3)' : 'none',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Ürün grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: 'hidden' }}>
                <div className="shimmer" style={{ height: 200, borderRadius: 0 }} />
                <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: '0 0 20px 20px' }}>
                  <div className="shimmer" style={{ height: 12, width: '60%', marginBottom: 10 }} />
                  <div className="shimmer" style={{ height: 18, width: '85%', marginBottom: 10 }} />
                  <div className="shimmer" style={{ height: 12, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
            <div style={{
              width: 72, height: 72,
              background: 'var(--bg-secondary)',
              borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 20px',
            }}>⌕</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, marginBottom: 8, color: 'var(--text-secondary)' }}>
              Ürün Bulunamadı
            </h3>
            <p style={{ fontSize: 14 }}>Farklı bir arama deneyin</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {products.map((product, i) => (
              <div key={product.id}
                className={`fade-up stagger-${Math.min((i % 6) + 1, 6)}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER BANNER ──────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '48px 24px',
        textAlign: 'center',
        marginTop: 40,
      }}>
        <div style={{
          width: 48, height: 48,
          background: 'var(--accent)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 20, color: 'white', fontWeight: 700,
        }}>◆</div>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 28, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 8,
        }}>Bazaar</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2025 Bazaar. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}

export default Home