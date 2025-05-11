import React from 'react';
import Login from './Login';
import Signup from './Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import StockDashboard from './StockDashboard';
import PredictionPage from './PredictionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<StockDashboard />} />
         <Route path="/predict/:ticker" element={<PredictionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
