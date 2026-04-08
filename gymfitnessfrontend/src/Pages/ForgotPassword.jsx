import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Pages/PageAssets/LogoW.png';
import './Style/Signup.css';
import { apiUrl } from '../config/api';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(apiUrl('/api/users/forgot-password'), {
        email: email.trim(),
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='LoginMainDiv'>
      <div className='InnerDiv'>
        <div className='LeftSide' />

        <div className='RightSide'>
          <img src={Logo} alt="SweatAndGain Logo" className="rightLogo" />
          <h1>Forgot Password</h1>

          {error && <p style={{ color: 'red', fontSize: 14, marginBottom: 10 }}>{error}</p>}
          {message && <p style={{ color: '#16a34a', fontSize: 14, marginBottom: 10 }}>{message}</p>}

          <form onSubmit={handleSubmit} className="InputFeilds">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className='SignUpText'>
            <h4>
              Remembered your password?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                Login
              </a>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
