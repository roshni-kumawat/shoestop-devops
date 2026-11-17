import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const productContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "https://shoestop-devops.onrender.com";

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
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shoestop_cart')) || [];
    } catch {
      return [];
    }
  });
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

  const saveCartLocal = (items) => {
    setCartItems(items);
    localStorage.setItem('shoestop_cart', JSON.stringify(items));
  };

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
    saveCartLocal([]);
  };

  const fetchCart = async (activeToken = token) => {
    if (!activeToken) return;
    try {
      const res = await axios.get(`${API_BASE}/api/addcart`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        saveCartLocal(res.data);
      }
    } catch (err) {
      console.log('Cart sync info:', err?.response?.status);
    }
  };

  const addItemToCart = async (item) => {
    const exists = cartItems.some((c) => c.title === item.title);
    if (exists) {
      return { status: 'exists' };
    }
    const newItem = {
      _id: item._id || 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      image: item.image,
      title: item.title,
      company: item.company,
      price: Number(item.price)
    };
    const updated = [...cartItems, newItem];
    saveCartLocal(updated);

    if (token) {
      try {
        await axios.post(
          `${API_BASE}/api/addcart`,
          { image: item.image, title: item.title, company: item.company, price: item.price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.log('Backend cart post fallback:', err?.response?.status);
      }
    }
    return { status: 'added' };
  };

  const removeItemFromCart = async (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    saveCartLocal(updated);
    if (token && id && !String(id).startsWith('cart_')) {
      try {
        await axios.delete(`${API_BASE}/api/addcart/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.log(err);
      }
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
    saveCartLocal([]);
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
        addItemToCart,
        removeItemFromCart,
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