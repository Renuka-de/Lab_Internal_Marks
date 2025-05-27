import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../styles/Register.css'; // Import custom styles

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
