import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { productContext } from '../contextAPI/Context';

const Orders = () => {
  const { orders } = useContext(productContext);

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '4px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>My Orders ({orders.length})</h4>
        <Link to="/home" style={{ color: '#2874f0', fontWeight: 600, fontSize: '14px' }}>← Continue Shopping</Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '50px 20px', textAlign: 'center', borderRadius: '4px' }}>
          <h5>No orders placed yet!</h5>
          <p style={{ color: '#878787' }}>Add shoes to your cart and click Place Order.</p>
          <Link to="/home" style={{ backgroundColor: '#2874f0', color: '#fff', padding: '10px 24px', borderRadius: '2px', fontWeight: 600 }}>Explore Shoes</Link>
        </div>
      ) : (
        orders.map((ord) => (
          <div key={ord.orderId} style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '18px 20px', marginBottom: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#2874f0' }}>Order #{ord.orderId}</span>
                <span style={{ marginLeft: '14px', fontSize: '13px', color: '#64748b' }}>Placed on {ord.date}</span>
              </div>
              <div>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '12px', padding: '4px 10px', borderRadius: '12px' }}>
                  ● {ord.status}
                </span>
                <span style={{ marginLeft: '14px', fontWeight: 700, fontSize: '16px' }}>₹{Number(ord.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {ord.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                <img src={item.image} alt={item.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#878787' }}>{item.company} • ₹{Number(item.price).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;