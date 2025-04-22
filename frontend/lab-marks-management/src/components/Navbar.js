// components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav>
      <h3>Lab Internal Marks Management System</h3>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
