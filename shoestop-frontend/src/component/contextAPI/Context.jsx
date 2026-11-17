import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const productContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ContextProvider = ({ children }) => {
  const cleanToken = (raw) => {
    if (!raw) return '';
    return raw.replace(/^"|"$/g, '');
  };

  const [token, setTokenState] = useState(() => cleanToken(localStorage.getItem('token')));
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shoestop_user')) || null;
    } catch {
      return null;
    }
  });
  const [cartItems, setCartItems] = useState([]);
  const [favProList, setFavProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shoestop_orders')) || [];
    } catch {
      return [];
    }
  });

  const setToken = (newToken) => {
    const cleaned = cleanToken(newToken);
    if (cleaned) {
      localStorage.setItem('token', cleaned);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(cleaned);
  };

  const setUser = (userObj) => {
    if (userObj) {
      localStorage.setItem('shoestop_user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('shoestop_user');
    }
    setUserState(userObj);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setCartItems([]);
  };

  const fetchCart = async (activeToken = token) => {
    if (!activeToken) return;
    try {
      const res = await axios.get(`${API_BASE}/api/addcart`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log('Cart fetch info:', err?.response?.status);
    }
  };

  const placeOrder = (items, totalAmount) => {
    const newOrder = {
      orderId: 'SS' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      items,
      totalAmount,
      status: 'Confirmed'
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('shoestop_orders', JSON.stringify(updated));
    return newOrder;
  };

  useEffect(() => {
    if (token) {
      fetchCart(token);
    }
  }, [token]);

  return (
    <productContext.Provider
      value={{
        API_BASE,
        token,
        setToken,
        user,
        setUser,
        logout,
        cartItems,
        setCartItems,
        fetchCart,
        favProList,
        setFavProductList,
        searchQuery,
        setSearchQuery,
        selectedBrand,
        setSelectedBrand,
        orders,
        placeOrder
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export default ContextProvider;