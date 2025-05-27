import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const LoginForm = () => {
  const [role, setRole] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!role || !id) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { id, role });
      
      if (res.data.message === 'Login successful') {
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('id', res.data.userId);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'faculty') navigate('/faculty/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
        console.error('Login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="lms-auth-form">
      <div className="lms-form-group">
        <label className="lms-form-label">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="lms-form-control"
          required
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="lms-form-group">
        <label className="lms-form-label">ID Number</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="lms-form-control"
          placeholder="Enter your ID"
          required
        />
      </div>

      {error && <div className="lms-form-error">{error}</div>}

      <div className="lms-form-actions">
        <button
          type="submit"
          className="lms-primary-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="lms-secondary-btn"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default LoginForm;