import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css';

const Login = () => {
  return (
    <div className="lms-auth-container">
      <div className="lms-auth-card">
        <div className="lms-auth-header">
          <h1 className="lms-auth-title">Lab Management System</h1>
          <p className="lms-auth-subtitle">Secure Login Portal</p>
        </div>
        <LoginForm />
        <div className="lms-auth-footer">
          <p className="lms-auth-contact">Support : admin@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;