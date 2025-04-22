import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css'; // Make sure the path is correct

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-heading">Welcome to the Lab Marks System</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
