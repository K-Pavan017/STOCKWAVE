import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import './Login.css'; // Ensure this exists

function Login() {
  const [showWaves, setShowWaves] = useState(false);
  const [showStockWave, setShowStockWave] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const waveTimer = setTimeout(() => setShowWaves(true), 2000);
    const textTimer = setTimeout(() => setShowStockWave(true), 2500);
    const formTimer = setTimeout(() => setShowForm(true), 5000);

    return () => {
      clearTimeout(waveTimer);
      clearTimeout(textTimer);
      clearTimeout(formTimer);
    };
  }, []);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    const noErrors = Object.values(validationErrors).every(val => val === '');

    if (noErrors) {
      try {
        const res = await axios.post('http://localhost:3001/login', values);
        if (res.data.success) {
          navigate('/home');
        } else {
          setBackendError(res.data.message || 'Invalid email or password');
        }
      } catch (err) {
        console.error('Login request error:', err);
        setBackendError('Server error. Try again later.');
      }
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url("/stock.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative', // Ensures the text and waves are positioned above the background
      }}
    >
      {/* Red wave (bear) - positioned at the bottom left */}
      {showWaves && (
        <img
          src="/redwave.png"
          alt="Bear wave"
          style={{
            position: 'absolute',
            left: '0%',
            bottom: '70%',
            width: '250px',
            zIndex: 0,
          }}
        />
      )}

      {/* Green wave (bull) - positioned at the bottom right */}
      {showWaves && (
        <img
          src="/greenwave.png"
          alt="Bull wave"
          style={{
            position: 'absolute',
            right: '0%',
            bottom: '70%',
            width: '250px',
            zIndex: 0,
          }}
        />
      )}

      {/* StockWave text - displayed on top of the background image */}
      {showStockWave && (
        <div className="stockwave-text">
          <span className="stock-text">Stock</span>
          <span className="wave-text">Wave</span>
        </div>
      )}

      {/* Form section */}
      {showForm && (
        <div className="mt-3" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="text-white">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-white" htmlFor="email"><strong>Email</strong></label>
              <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control rounded-0 black-input"
                  name="email"
                  onChange={handleInput}
                />

              {errors.email && <span>{errors.email}</span>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="text-white"><strong>Password</strong></label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control rounded-0 black-input"
                name="password"
                onChange={handleInput}
              />
              {errors.password && <span>{errors.password}</span>}
            </div>
            {backendError && <span style={{ color: 'red' }}>{backendError}</span>}
            <button type="submit" className="btn btn-primary w-100 rounded-0">Login</button>
            <p className="text-white">You agree to our terms and policies to use this app.</p>
            <Link to="/signup" className="btn btn-primary w-100 rounded-0">Create Account</Link>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
