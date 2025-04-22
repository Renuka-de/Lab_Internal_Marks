import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css'; // Import new styles

const RegisterForm = () => {
  const [role, setRole] = useState('');
  const [extraInfo, setExtraInfo] = useState({});
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setExtraInfo({});
  };

  const handleExtraInfoChange = (e) => {
    const { name, value } = e.target;
    setExtraInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { role, ...extraInfo });
      alert('Registration successful!');
      navigate('/login'); // ✅ Navigate after success
    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }
  };

  const renderInput = (type, name, placeholder) => (
    <input
      className="w-full border px-3 py-2 rounded mb-2"
      type={type}
      name={name}
      placeholder={placeholder}
      value={extraInfo[name] || ''}
      onChange={handleExtraInfoChange}
      required
    />
  );

  return (
    <div className="register-form-container">
      <div className="register-box1">
        <h2 className="register-heading">Register as {role || '...'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Role:</label>
            <select
              className="w-full border px-3 py-2 rounded"
              name="role"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
          </div>

          {role === 'admin' && (
            <>
              {renderInput('number', 'admin_id', 'Admin ID')}
              {renderInput('text', 'username', 'Username')}
              {renderInput('email', 'email', 'Email')}
              {renderInput('password', 'password', 'Password')}
            </>
          )}

          {role === 'faculty' && (
            <>
              {renderInput('number', 'faculty_id', 'Faculty ID')}
              {renderInput('text', 'faculty_name', 'Faculty Name')}
              {renderInput('date', 'dob', 'Date of Birth')}
              <select
                name="gender"
                value={extraInfo.gender || ''}
                onChange={handleExtraInfoChange}
                className="w-full border px-3 py-2 rounded mb-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {renderInput('text', 'house_name', 'House Name')}
              {renderInput('text', 'place', 'Place')}
              {renderInput('text', 'city', 'City')}
              {renderInput('text', 'f_phone_no', 'Phone Number')}
              {renderInput('number', 'admin_id', 'Admin ID')}
              {renderInput('number', 'department_id', 'Department ID')}
            </>
          )}

          {role === 'student' && (
            <>
              {renderInput('number', 'student_id', 'Student ID')}
              {renderInput('text', 'student_name', 'Student Name')}
              {renderInput('date', 'dob', 'Date of Birth')}
              <select
                name="gender"
                value={extraInfo.gender || ''}
                onChange={handleExtraInfoChange}
                className="w-full border px-3 py-2 rounded mb-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {renderInput('text', 'house_name', 'House Name')}
              {renderInput('text', 'place', 'Place')}
              {renderInput('text', 'city', 'City')}
              {renderInput('text', 's_phone_no', 'Phone Number')}
              {renderInput('number', 'admin_id', 'Admin ID')}
              {renderInput('number', 'department_id', 'Department ID')}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
