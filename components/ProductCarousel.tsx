import React, { useRef, useState, useEffect } from 'react';

interface Product {
  image_url: string;
  product_name: string;
  product_description: string;
  link: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    // Add ResizeObserver to handle container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      if (resizeObserver && el) resizeObserver.unobserve(el);
    };
  }, []);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-220)}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Scroll left"
        >
          <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-6-6 6-6"/></svg>
        </button>
      )}
      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(220)}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: '#d1d5db', // Made even more grey
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Scroll right"
        >
          <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l6 6-6 6"/></svg>
        </button>
      )}
      <div
        ref={scrollRef}
        style={{
          position: 'relative',
          display: 'flex',
          overflowX: 'auto',
          gap: '12px',
          padding: '16px 0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="product-carousel-scroll"
      >
        {products.map((product, idx) => (
          <a
            key={idx}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              minWidth: 170,
              maxWidth: 180,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 12,
              border: '1px solid #f3f4f6',
              zIndex: 2,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.2s',
            }}
          >
            <img
              src={product.image_url}
              alt={product.product_name}
              style={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                borderRadius: 8,
                marginBottom: 10,
                background: '#f9fafb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            />
            <div style={{ width: '100%', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 2, color: '#111' }}>{product.product_name}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{product.product_description}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .product-carousel-scroll::-webkit-scrollbar { display: none; }
    .product-carousel-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}

export default ProductCarousel; 