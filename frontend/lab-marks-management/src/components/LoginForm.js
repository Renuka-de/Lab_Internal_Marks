import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import custom styles

const LoginForm = () => {
  const [role, setRole] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!role || !id) {
      setError('Please fill in both role and ID');
      return;
    }
  
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/login`, {
        id,
        role
      });
  
      if (res.data.message === 'Login successful') {
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('id', res.data.userId);
  
        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'faculty') navigate('/faculty/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('User not found! Redirecting to register page...');
        navigate('/register');
      } else {
        console.error('Login error:', error);
        setError('Something went wrong, please try again.');
      }
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your ID"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="footer-container">
        <p className="text-sm">Don’t have an account?</p>
        <button
          onClick={() => navigate('/register')}
          className="mt-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
