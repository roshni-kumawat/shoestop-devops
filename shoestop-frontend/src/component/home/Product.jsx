import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productContext } from '../contextAPI/Context';

const FALLBACK_SHOES = [
  { _id: 's1', title: 'Air Jordan 1 Retro High OG', company: 'Jordan', price: 12999, rating: '4.8', discount: '20% off', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { _id: 's2', title: 'Nike Air Max 270 React', company: 'Nike', price: 8499, rating: '4.6', discount: '25% off', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80' },
  { _id: 's3', title: 'Adidas Ultraboost Light', company: 'Adidas', price: 9999, rating: '4.7', discount: '18% off', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80' },
  { _id: 's4', title: 'Puma RS-X Efekt PRM', company: 'Puma', price: 6499, rating: '4.5', discount: '30% off', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80' },
  { _id: 's5', title: 'Nike Dunk Low Panda', company: 'Nike', price: 7999, rating: '4.9', discount: '15% off', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80' },
  { _id: 's6', title: 'Converse Chuck 70 Classic', company: 'Converse', price: 4299, rating: '4.6', discount: '22% off', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80' },
  { _id: 's7', title: 'New Balance 574 Core', company: 'New Balance', price: 6999, rating: '4.7', discount: '20% off', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80' },
  { _id: 's8', title: 'Reebok Classic Leather', company: 'Reebok', price: 4999, rating: '4.4', discount: '35% off', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80' },
  { _id: 's9', title: 'Jordan Jumpman MVP', company: 'Jordan', price: 11499, rating: '4.8', discount: '15% off', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80' },
  { _id: 's10', title: 'Adidas Forum Low Originals', company: 'Adidas', price: 7499, rating: '4.6', discount: '24% off', image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&q=80' },
  { _id: 's11', title: 'Puma Palermo Leather', company: 'Puma', price: 5499, rating: '4.5', discount: '28% off', image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80' },
  { _id: 's12', title: 'Nike Pegasus 40 Running', company: 'Nike', price: 8999, rating: '4.7', discount: '19% off', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80' }
];

const BRANDS = ['All', 'Nike', 'Adidas', 'Jordan', 'Puma', 'Converse', 'New Balance', 'Reebok'];

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [justClickedTitle, setJustClickedTitle] = useState('');
  const { API_BASE, cartItems, addItemToCart, searchQuery, selectedBrand, setSelectedBrand } = useContext(productContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/getproducts`);
        const dbItems = Array.isArray(res.data) ? res.data : [];
        setProducts(dbItems.length >= 6 ? dbItems : [...dbItems, ...FALLBACK_SHOES]);
      } catch {
        setProducts(FALLBACK_SHOES);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [API_BASE]);

  const showToast = (title, subtitle, isExists = false) => {
    setToast({ title, subtitle, isExists });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async (item, redirectCart = false) => {
    setJustClickedTitle(item.title);
    setTimeout(() => setJustClickedTitle(''), 600);

    const res = await addItemToCart(item);
    if (redirectCart) {
      navigate('/cart');
    } else if (res.status === 'exists') {
      showToast('Already in Cart!', `"${item.title}" is already added.`, true);
    } else {
      showToast('Done! Added to Cart ✓', `"${item.title}" added successfully!`, false);
    }
  };

  const filtered = products.filter((item) => {
    const matchesBrand = selectedBrand === 'All' || (item.company || '').toLowerCase() === selectedBrand.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || (item.title || '').toLowerCase().includes(q) || (item.company || '').toLowerCase().includes(q);
    return matchesBrand && matchesQuery;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 16px 40px' }}>
      <style>{`
        @keyframes popBounce {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          75% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes slideDownFade {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .btn-click-pop {
          animation: popBounce 0.45s ease;
        }
        .flipkart-toast {
          animation: slideDownFade 0.3s ease-out;
        }
      `}</style>

      {/* Bright Top-Right Flipkart Popup Notification */}
      {toast && (
        <div
          className="flipkart-toast"
          onClick={() => navigate('/cart')}
          style={{
            position: 'fixed',
            top: '74px',
            right: '24px',
            backgroundColor: toast.isExists ? '#1e293b' : '#16a34a',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '6px',
            zIndex: 2500,
            boxShadow: '0 10px 28px rgba(0,0,0,0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.25)',
            maxWidth: '340px'
          }}
        >
          <span style={{ fontSize: '24px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            {toast.isExists ? '!' : '✓'}
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>{toast.title}</div>
            <div style={{ fontSize: '12px', opacity: 0.92 }}>{toast.subtitle}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffe500', marginTop: '3px' }}>Click here to view Cart →</div>
          </div>
        </div>
      )}

      {/* Brand Strip */}
      <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '4px', marginBottom: '12px', display: 'flex', gap: '10px', overflowX: 'auto', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            style={{
              padding: '7px 18px',
              borderRadius: '20px',
              border: selectedBrand === brand ? '1px solid #2874f0' : '1px solid #e0e0e0',
              backgroundColor: selectedBrand === brand ? '#2874f0' : '#fff',
              color: selectedBrand === brand ? '#fff' : '#212121',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {brand === 'All' ? '🔥 All Brands' : brand}
          </button>
        ))}
      </div>

      {/* Sale Banner */}
      <div style={{ background: 'linear-gradient(90deg, #2874f0 0%, #1a56db 60%, #0f172a 100%)', borderRadius: '4px', padding: '24px 32px', color: '#fff', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ backgroundColor: '#ffe500', color: '#212121', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>
            Big Sneaker Days Live
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px' }}>Top Footwear Deals — Up to 35% Off</h2>
          <p style={{ color: '#dbeafe', fontSize: '14px', margin: 0 }}>100% Authentic Nike, Jordan, Adidas & Puma • Free Express Delivery</p>
        </div>
        <div style={{ fontSize: '44px' }}>👟⚡</div>
      </div>

      {/* Section Header */}
      <div style={{ backgroundColor: '#fff', padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
          {selectedBrand === 'All' ? 'Best of Sneakers & Sports Shoes' : `${selectedBrand} Collection`} ({filtered.length} Items)
        </h4>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ backgroundColor: '#fff', padding: '40px', textAlign: 'center' }}>Loading shoes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', backgroundColor: '#fff', padding: '16px' }}>
          {filtered.map((item, idx) => {
            const mrp = Math.round(Number(item.price) * 1.25);
            const isAdded = cartItems.some((c) => c.title === item.title);
            const isAnimating = justClickedTitle === item.title;

            return (
              <div
                key={item._id || idx}
                style={{
                  border: isAdded ? '2px solid #22c55e' : '1px solid #f0f0f0',
                  borderRadius: '4px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  boxShadow: isAdded ? '0 4px 14px rgba(34, 197, 94, 0.18)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '190px', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isAdded && (
                      <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                        ✓ In Cart
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#878787', textTransform: 'uppercase' }}>{item.company}</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#212121', margin: '4px 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#388e3c', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
                      {item.rating || '4.6'} ★
                    </span>
                    <span style={{ fontSize: '12px', color: '#2874f0', fontWeight: 700 }}>Assured ✓</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>₹{Number(item.price).toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '13px', color: '#878787', textDecoration: 'line-through' }}>₹{mrp.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '12px', color: '#388e3c', fontWeight: 700 }}>{item.discount || '20% off'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={isAnimating ? 'btn-click-pop' : ''}
                    onClick={() => (isAdded ? navigate('/cart') : handleAddToCart(item, false))}
                    style={{
                      flex: 1,
                      backgroundColor: isAdded ? '#16a34a' : '#ff9f00',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      borderRadius: '2px',
                      cursor: 'pointer',
                      boxShadow: isAdded ? '0 0 12px rgba(22, 163, 74, 0.5)' : '0 1px 2px rgba(0,0,0,0.12)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {isAdded ? '✓ ADDED (GO TO CART)' : 'ADD TO CART'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item, true)}
                    style={{ flex: 1, backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: '10px 6px', fontSize: '12px', fontWeight: 800, borderRadius: '2px', cursor: 'pointer' }}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Product;