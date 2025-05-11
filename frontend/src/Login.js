import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const navigate = useNavigate();

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
          // ✅ Login successful, redirect to homepage/dashboard
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
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder='Enter Email'
              className='form-control rounded-0'
              name='email'
              onChange={handleInput}
            />
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder='Enter Password'
              className='form-control rounded-0'
              name='password'
              onChange={handleInput}
            />
            {errors.password && <span>{errors.password}</span>}
          </div>
          {backendError && <span style={{ color: 'red' }}>{backendError}</span>}
          <button type='submit' className='btn btn-success w-100  rounded-0'>Login</button>
          <p>You are agreed to our terms and policies to use this app.</p>
          <Link to='/signup' className='btn btn-default border w-100 bg-light rounded-0'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
