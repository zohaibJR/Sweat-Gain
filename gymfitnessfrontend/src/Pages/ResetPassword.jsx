import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Pages/PageAssets/LogoW.png';
import './Style/Signup.css';
import { apiUrl } from '../config/api';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !token) {
      setError('This reset link is invalid or incomplete');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(apiUrl('/api/users/reset-password'), {
        email,
        token,
        password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
          <h1>Reset Password</h1>

          {error && <p style={{ color: 'red', fontSize: 14, marginBottom: 10 }}>{error}</p>}
          {message && <p style={{ color: '#16a34a', fontSize: 14, marginBottom: 10 }}>{message}</p>}

          <form onSubmit={handleSubmit} className="InputFeilds">
            <input type="email" value={email} disabled />

            <input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className='SignUpText'>
            <h4>
              Back to{' '}
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

export default ResetPassword;
