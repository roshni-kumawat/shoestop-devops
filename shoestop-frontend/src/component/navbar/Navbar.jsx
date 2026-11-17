import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productContext } from '../contextAPI/Context';

const NavbarLog = () => {
  const { user, logout, cartItems, searchQuery, setSearchQuery, orders } = useContext(productContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const displayName = user?.name || user?.email?.split('@')[0] || 'Roshni';

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: '#2874f0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Brand Logo */}
        <Link to="/home" style={{ display: 'flex', flexDirection: 'column', color: '#fff', lineHeight: 1.1 }}>
          <span style={{ fontSize: '22px', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.5px' }}>ShoeStop</span>
          <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#ffe500', fontWeight: 600 }}>
            Explore <span style={{ color: '#fff' }}>Plus ✦</span>
          </span>
        </Link>

        {/* Flipkart Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '540px', display: 'flex', backgroundColor: '#fff', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Nike, Adidas, Jordans, sneakers and more..."
            style={{ flex: 1, border: 'none', outline: 'none', padding: '9px 14px', fontSize: '14px', color: '#212121' }}
          />
          <button type="submit" style={{ backgroundColor: '#fff', border: 'none', padding: '0 16px', color: '#2874f0', fontWeight: 700, cursor: 'pointer', fontSize: '16px' }}>
            🔍
          </button>
        </form>

        {/* Right Actions: Profile, Orders, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#fff', fontWeight: 600, fontSize: '15px' }}>
          
          {/* Profile Dropdown */}
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.14)', padding: '6px 14px', borderRadius: '4px' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ffe500', color: '#2874f0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span>{displayName} ▾</span>
            </div>

            {showProfileMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: '#fff', color: '#212121', minWidth: '220px', borderRadius: '4px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 1001 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{displayName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email || 'Verified Member'}</div>
                </div>
                <Link to="/orders" style={{ display: 'block', padding: '10px 16px', color: '#212121', fontSize: '14px', borderBottom: '1px solid #f0f0f0' }}>
                  📦 My Orders ({orders.length})
                </Link>
                <Link to="/cart" style={{ display: 'block', padding: '10px 16px', color: '#212121', fontSize: '14px', borderBottom: '1px solid #f0f0f0' }}>
                  🛒 My Cart ({cartItems.length})
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', backgroundColor: '#fff', color: '#e11d48', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          {/* Orders Link */}
          <Link to="/orders" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Orders</span>
            {orders.length > 0 && (
              <span style={{ backgroundColor: '#ffe500', color: '#212121', fontSize: '11px', fontWeight: 800, padding: '1px 6px', borderRadius: '10px' }}>
                {orders.length}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛒 Cart</span>
            <span style={{ backgroundColor: '#ff6161', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>
              {cartItems.length}
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
};

export default NavbarLog;