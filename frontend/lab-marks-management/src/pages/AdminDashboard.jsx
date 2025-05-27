import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [view, setView] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/departments');
      setDepartments(res.data);
      setView('departments');
      setError('');
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/courses');
      setCourses(res.data);
      setView('courses');
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/faculties');
      setFaculties(res.data);
      setView('faculties');
      setError('');
    } catch (err) {
      console.error('Error fetching faculties:', err);
      setError('Failed to load faculties');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/students');
      setStudents(res.data);
      setView('students');
      setError('');
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`);
        switch(type) {
          case 'departments': fetchDepartments(); break;
          case 'courses': fetchCourses(); break;
          case 'faculties': fetchFaculties(); break;
          case 'students': fetchStudents(); break;
          default: break;
        }
      } catch (err) {
        console.error(`Error deleting ${type}:`, err);
        setError(`Failed to delete ${type.slice(0, -1)}`);
      }
    }
  };

  const handleAdd = async (type) => {
    try {
      let payload = { ...formData };
  
      if (type === 'departments') {
        payload.department_id = parseInt(formData.department_id);
        payload.department_head = formData.department_head === '' ? null : parseInt(formData.department_head);
      }
  
      if (type === 'courses') {
        payload.department_id = parseInt(formData.department_id);
        payload.faculty_id = formData.faculty_id === '' ? null : parseInt(formData.faculty_id);
      }

      if (type === 'faculties') {
        payload.faculty_id = parseInt(formData.faculty_id);
        payload.department_id = parseInt(formData.department_id);
      }

      if (type === 'students') {
        payload.student_id = parseInt(formData.student_id);
        payload.department_id = parseInt(formData.department_id);
      }
  
      await axios.post(`http://localhost:5000/api/admin/${type}`, payload);
      setFormData({});
      setError('');
      setSuccess(`${type.slice(0, -1)} added successfully`);
      setTimeout(() => setSuccess(''), 3000);
      switch(type) {
        case 'departments': fetchDepartments(); break;
        case 'courses': fetchCourses(); break;
        case 'faculties': fetchFaculties(); break;
        case 'students': fetchStudents(); break;
        default: break;
      }
    } catch (err) {
      console.error(`Error adding ${type}:`, err);
      setSuccess('');
      setError(err.response?.data?.error || `Failed to add ${type.slice(0, -1)}`);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/admin/generate-report');
      setSuccess('Report generated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>
      <div className="admin-header">
             <button 
         onClick={handleGenerateReport} 
         className="admin-add-btn"
       >
         Generate Report
       </button></div>

      <div className="admin-nav-buttons">
        <button 
          onClick={fetchDepartments} 
          className={`admin-nav-btn departments ${view === 'departments' ? 'active' : ''}`}
        >
          Departments
        </button>
        <button 
          onClick={fetchCourses} 
          className={`admin-nav-btn courses ${view === 'courses' ? 'active' : ''}`}
        >
          Courses
        </button>
        <button 
          onClick={fetchFaculties} 
          className={`admin-nav-btn faculties ${view === 'faculties' ? 'active' : ''}`}
        >
          Faculties
        </button>
        <button 
          onClick={fetchStudents} 
          className={`admin-nav-btn students ${view === 'students' ? 'active' : ''}`}
        >
          Students
        </button>
      </div>

      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {view === 'departments' && (
        <div className="admin-view-container">
          <h2 className="admin-view-title">Departments</h2>
          
          <div className="admin-form-row">
            <input 
              name="department_id" 
              placeholder="Department ID" 
              onChange={handleChange} 
              className="admin-form-input" 
              type="number"
            />
            <input 
              name="department_name" 
              placeholder="Department Name" 
              onChange={handleChange} 
              className="admin-form-input" 
            />
            <input 
              name="department_head" 
              placeholder="Head (Faculty ID)" 
              onChange={handleChange} 
              className="admin-form-input" 
              type="number"
            />
            <input 
              name="location" 
              placeholder="Location" 
              onChange={handleChange} 
              className="admin-form-input" 
            />
            <button 
              onClick={() => handleAdd('departments')} 
              className="admin-add-btn"
            >
              Add Department
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Department Name</th>
                <th>Location</th>
                <th>Head Faculty ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.department_id}>
                  <td>{d.department_id}</td>
                  <td>{d.department_name}</td>
                  <td>{d.location}</td>
                  <td>{d.department_head || '-'}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete('departments', d.department_id)} 
                      className="admin-action-btn admin-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'courses' && (
        <div className="admin-view-container">
          <h2 className="admin-view-title">Courses</h2>
          
          <div className="admin-form-row">
            <input 
              name="course_code" 
              placeholder="Course Code" 
              onChange={handleChange} 
              className="admin-form-input" 
            />
            <input 
              name="course_name" 
              placeholder="Course Name" 
              onChange={handleChange} 
              className="admin-form-input" 
            />
            <input 
              name="semester_name" 
              placeholder="Semester" 
              onChange={handleChange} 
              className="admin-form-input" 
            />
            <input 
              name="department_id" 
              placeholder="Department ID" 
              onChange={handleChange} 
              className="admin-form-input" 
              type="number"
            />
            <button 
              onClick={() => handleAdd('courses')} 
              className="admin-add-btn"
            >
              Add Course
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Semester</th>
                <th>Department ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.course_code}>
                  <td>{c.course_code}</td>
                  <td>{c.course_name}</td>
                  <td>{c.semester_name}</td>
                  <td>{c.department_id}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete('courses', c.course_code)} 
                      className="admin-action-btn admin-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'faculties' && (
        <div className="admin-view-container">
          <h2 className="admin-view-title">Faculties</h2>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Faculty Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Department ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((f) => (
                <tr key={f.faculty_id}>
                  <td>{f.faculty_id}</td>
                  <td>{f.faculty_name}</td>
                  <td>{f.dob?.substring(0, 10)}</td>
                  <td>{f.gender}</td>
                  <td>{f.department_id}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete('faculties', f.faculty_id)} 
                      className="admin-action-btn admin-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'students' && (
        <div className="admin-view-container">
          <h2 className="admin-view-title">Students</h2>
          
          

          <table className="admin-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Department ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.student_id}>
                  <td>{s.student_id}</td>
                  <td>{s.student_name}</td>
                  <td>{s.department_id}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete('students', s.student_id)} 
                      className="admin-action-btn admin-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;