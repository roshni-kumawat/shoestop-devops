import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { productContext } from '../contextAPI/Context';

const Cart = () => {
  const { API_BASE, cartItems, fetchCart, placeOrder, user } = useContext(productContext);
  const navigate = useNavigate();

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/addcart/${id}`);
      await fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const totalMrp = Math.round(totalAmount * 1.25);
  const discount = totalMrp - totalAmount;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    placeOrder(cartItems, totalAmount);
    navigate('/orders');
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '20px auto', padding: '0 16px' }}>
      {cartItems.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '60px 20px', textAlign: 'center', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '54px', marginBottom: '12px' }}>🛒</div>
          <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Your ShoeStop Cart is empty!</h4>
          <p style={{ color: '#878787', marginBottom: '20px' }}>Add branded sneakers to it now.</p>
          <Link to="/home" style={{ backgroundColor: '#2874f0', color: '#fff', padding: '12px 36px', borderRadius: '2px', fontWeight: 600 }}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left: Cart Items List */}
          <div style={{ flex: '2 1 560px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#2874f0' }}>ShoeStop Cart ({cartItems.length})</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Deliver to: <strong>{user?.name || 'Roshni'}</strong></span>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img src={item.image} alt={item.title} style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f0f0f0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#878787', margin: '4px 0 8px' }}>Brand: {item.company} • Seller: ShoeStop Retail</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700 }}>₹{Number(item.price).toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 700 }}>20% Off • Free Delivery</span>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    style={{ background: 'none', border: 'none', color: '#212121', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}

            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', boxShadow: '0 -2px 10px rgba(0,0,0,0.06)' }}>
              <button
                onClick={handlePlaceOrder}
                style={{ backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: '14px 42px', fontSize: '15px', fontWeight: 700, borderRadius: '2px', cursor: 'pointer' }}
              >
                PLACE ORDER
              </button>
            </div>
          </div>

          {/* Right: Price Details Box */}
          <div style={{ flex: '1 1 300px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: '16px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#878787', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '16px' }}>
              PRICE DETAILS
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15px' }}>
              <span>Price ({cartItems.length} items)</span>
              <span>₹{totalMrp.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15px', color: '#388e3c' }}>
              <span>Discount</span>
              <span>− ₹{discount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
              <span>Delivery Charges</span>
              <span style={{ color: '#388e3c', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e0e0e0', borderBottom: '1px dashed #e0e0e0', padding: '16px 0', fontSize: '18px', fontWeight: 700 }}>
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ color: '#388e3c', fontWeight: 600, fontSize: '13px', marginTop: '14px' }}>
              You will save ₹{discount.toLocaleString('en-IN')} on this order
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;