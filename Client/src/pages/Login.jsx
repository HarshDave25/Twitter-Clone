import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from "react-bootstrap/Image";
import axios from 'axios'
import '../sass/Auth.scss';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';




const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with email and password to get token
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
  
      if (response.data && response.data.token) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));  // Store user data
  
        // After successful login, fetch user profile using the token
        const token = localStorage.getItem('token');
        if (token) {
          const profileResponse = await axios.get(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,  // Include token in Authorization header
            }
          });
          console.log(profileResponse.data);
          // If the response contains profile data, store it and navigate
          if (profileResponse.data) {
            localStorage.setItem('user', JSON.stringify(profileResponse.data));
            navigate('/');  // Redirect to homepage
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to login. Please check your credentials.');
    }
  };
  
  
  

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-cover">
          <Image src="assets/logo_white.svg" className="auth-logo" />
          <h2>Welcome back</h2>
        </div>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
