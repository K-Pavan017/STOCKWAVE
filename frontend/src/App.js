import React from 'react';
import Login from './Login';
import Signup from './Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StockDashboard from './StockDashboard';
import PredictionPage from './PredictionPage';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import './App.css';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<StockDashboard />} />
         <Route path="/predict/:ticker" element={<PredictionPage />} />
         <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
