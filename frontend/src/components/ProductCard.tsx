import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Product {
  id: string; name: string; description: string
  price: number; stock: number; image: string | null; category: string
}

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ overflow: 'hidden', cursor: 'pointer', height: '100%' }}
      >
        {/* Resim */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 210, background: 'var(--bg-secondary)' }}>
          <img
            src={product.image || `https://picsum.photos/400/300?random=${product.id}`}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
          />

          {/* Overlay gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }} />

          {/* Stok badge */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(2px)',
            }}>
              <span style={{
                color: 'white', fontWeight: 600, fontSize: 13,
                background: 'rgba(0,0,0,0.5)',
                padding: '6px 16px', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>Stok Tükendi</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'var(--accent)',
              color: 'white', fontSize: 10, fontWeight: 700,
              padding: '4px 10px', borderRadius: 20,
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(200,75,49,0.4)',
            }}>SON {product.stock}</div>
          )}

          {/* Hovered incele butonu */}
          <div style={{
            position: 'absolute', bottom: 12, left: '50%',
            transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(12px)',
            opacity: hovered ? 1 : 0,
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              background: 'white', color: 'var(--accent)',
              fontSize: 12, fontWeight: 600,
              padding: '6px 18px', borderRadius: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>İncele →</span>
          </div>
        </div>

        {/* İçerik */}
        <div style={{ padding: '16px 18px 20px' }}>
          <span className="badge" style={{ marginBottom: 10 }}>
            {product.category}
          </span>

          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 18, fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            marginBottom: 6,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{product.name}</h3>

          <p style={{
            fontSize: 12.5, color: 'var(--text-muted)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: 14,
          }}>{product.description}</p>

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            paddingTop: 14,
          }}>
            <div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 22, fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}>
                ₺{product.price.toLocaleString('tr-TR')}
              </div>
              {product.stock > 0 && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  {product.stock} adet stokta
                </div>
              )}
            </div>

            <div style={{
              width: 36, height: 36,
              background: hovered ? 'var(--accent)' : 'var(--bg-secondary)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)',
            }}>
              <span style={{ color: hovered ? 'white' : 'var(--text-muted)', fontSize: 14 }}>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard