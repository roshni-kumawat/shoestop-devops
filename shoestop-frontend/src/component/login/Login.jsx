import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { productContext } from '../contextAPI/Context';

const AuthPage = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  const { API_BASE, setToken, setUser, fetchCart } = useContext(productContext);
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password || (!isLogin && !name)) {
      setErrorMsg('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);

      if (res.status === 200 || res.status === 201) {
        const receivedToken = res.data?.token;
        if (receivedToken) {
          setToken(receivedToken);
          const userData = res.data?.user || { name: name || email.split('@')[0], email };
          setUser(userData);
          await fetchCart(receivedToken);
          navigate('/home');
        } else if (!isLogin) {
          // If signup succeeds without returning token directly, auto-login
          const loginRes = await axios.post(`${API_BASE}/login`, { email, password });
          setToken(loginRes.data.token);
          setUser({ name, email });
          await fetchCart(loginRes.data.token);
          navigate('/home');
        }
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err?.response?.data || 'Authentication failed. Check credentials or wait 30s for server wake-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f3f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', maxWidth: '820px', width: '100%', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', minHeight: '500px', flexWrap: 'wrap' }}>
        
        {/* Left Flipkart Blue Panel */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#2874f0', color: '#fff', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, fontStyle: 'italic', marginBottom: '24px' }}>
              ShoeStop <span style={{ color: '#ffe500', fontSize: '14px' }}>Plus ✦</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>
              {isLogin ? 'Login' : "Looks like you're new here!"}
            </h2>
            <p style={{ fontSize: '16px', color: '#dbdbdb', lineHeight: 1.5 }}>
              {isLogin
                ? 'Get access to your Orders, Wishlist and Exclusive Sneaker Drops'
                : 'Sign up with your email to start shopping top footwear brands'}
            </p>
          </div>
          <div style={{ fontSize: '64px', textAlign: 'center', opacity: 0.9 }}>👟</div>
        </div>

        {/* Right White Form Panel */}
        <div style={{ flex: '1.3 1 340px', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fecaca' }}>
                {String(errorMsg)}
              </div>
            )}

            {!isLogin && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', color: '#878787', fontWeight: 600 }}>Full Name / Username</label>
                <input
                  type="text"
                  placeholder="Enter your name (e.g. Roshni Kumawat)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 4px', border: 'none', borderBottom: '2px solid #e0e0e0', outline: 'none', fontSize: '15px' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', color: '#878787', fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter Email (e.g. roshni@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 4px', border: 'none', borderBottom: '2px solid #e0e0e0', outline: 'none', fontSize: '15px' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', color: '#878787', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 4px', border: 'none', borderBottom: '2px solid #e0e0e0', outline: 'none', fontSize: '15px' }}
              />
            </div>

            <p style={{ fontSize: '12px', color: '#878787', marginBottom: '18px' }}>
              By continuing, you agree to ShoeStop's Terms of Use and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: '13px', fontSize: '15px', fontWeight: 700, borderRadius: '2px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            >
              {loading ? 'Please wait...' : isLogin ? 'LOGIN' : 'CONTINUE & SIGN UP'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#2874f0', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
            >
              {isLogin ? 'New to ShoeStop? Create an account' : 'Existing User? Log in'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;