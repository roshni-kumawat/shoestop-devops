import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './component/home/Home';
import Cart from './component/cart/Cart';
import Orders from './component/cart/Orders';
import Signup from './component/signup/Signup';
import Login from './component/login/Login';
import NavbarLog from './component/navbar/NavbarLog';
import { productContext } from './component/contextAPI/Context';

const App = () => {
  const { token } = useContext(productContext);
  const isLoggedIn = Boolean(token);

  return (
    <BrowserRouter>
      {isLoggedIn && <NavbarLog />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Login defaultMode="login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login defaultMode="login" />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;