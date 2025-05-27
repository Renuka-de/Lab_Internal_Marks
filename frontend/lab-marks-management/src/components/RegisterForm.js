import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.css';

const RegisterForm = () => {
  const [role, setRole] = useState('student');
  const [departmentNames, setDepartmentNames] = useState([]);
  const [formData, setFormData] = useState({
    faculty_name: '',
    student_name: '',
    dob: '',
    gender: '',
    house_name: '',
    place: '',
    city: '',
    phone_no: '',
    department_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch('http://localhost:5000/api/auth/departments');
        const data = await response.json();
        setDepartmentNames(data);
      } catch (error) {
        setError('Failed to fetch departments');
      }
    }
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!role) {
      setError('Please select a role');
      return;
    }

    const requestData = { 
      role, 
      ...formData,
      ...(role === 'faculty' && { f_phone_no: formData.phone_no }),
      ...(role === 'student' && { s_phone_no: formData.phone_no })
    };
    delete requestData.phone_no;

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message || 'Registration successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Error during registration');
    }
  };

  return (
    <div className="lms-auth-container">
      <button className="go-back-button" onClick={() => navigate(-1)}>
        ← Go Back
      </button>
      
      <div className="lms-auth-card">
        <div className="lms-auth-header">
          <h1 className="lms-auth-title">Create Account</h1>
          <p className="lms-auth-subtitle">Join our learning community</p>
        </div>

        <form className="lms-auth-form" onSubmit={handleSubmit}>
          {error && <div className="lms-form-error">{error}</div>}
          {success && <div className="lms-form-success">{success}</div>}

          <div className="role-selection">
            <div 
              className={`role-option ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </div>
            <div 
              className={`role-option ${role === 'faculty' ? 'active' : ''}`}
              onClick={() => setRole('faculty')}
            >
              Faculty
            </div>
          </div>

          {role === 'faculty' && (
            <div className="lms-form-group">
              <label className="lms-form-label">Faculty Name</label>
              <input
                type="text"
                name="faculty_name"
                value={formData.faculty_name}
                onChange={handleChange}
                className="lms-form-control"
                required
              />
            </div>
          )}

          {role === 'student' && (
            <div className="lms-form-group">
              <label className="lms-form-label">Student Name</label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                className="lms-form-control"
                required
              />
            </div>
          )}

          <div className="lms-form-group">
            <label className="lms-form-label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="lms-form-control"
              required
            />
          </div>

          <div className="lms-form-group">
            <label className="lms-form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="lms-form-control lms-form-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="lms-form-group">
            <label className="lms-form-label">House Name</label>
            <input
              type="text"
              name="house_name"
              value={formData.house_name}
              onChange={handleChange}
              className="lms-form-control"
              required
            />
          </div>

          <div className="lms-form-group">
            <label className="lms-form-label">Place</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="lms-form-control"
              required
            />
          </div>

          <div className="lms-form-group">
            <label className="lms-form-label">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="lms-form-control"
              required
            />
          </div>

          <div className="lms-form-group">
            <label className="lms-form-label">Phone Number</label>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              className="lms-form-control"
              required
            />
          </div>

          <div className="lms-form-group">
            <label className="lms-form-label">Department</label>
            <select
              name="department_name"
              value={formData.department_name}
              onChange={handleChange}
              className="lms-form-control lms-form-select"
              required
            >
              <option value="">Select Department</option>
              {departmentNames.map(dept => (
                <option key={dept.department_id} value={dept.department_name}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>

          <div className="lms-form-actions">
            <button type="submit" className="lms-primary-btn">
              Register
            </button>
          </div>
        </form>

        <div className="lms-auth-footer">
          Already have an account?{' '}
          <a className="lms-auth-link" onClick={() => navigate('/login')}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;