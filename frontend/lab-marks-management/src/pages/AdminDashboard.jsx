// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [view, setView] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({});

  const adminId = localStorage.getItem('id');
  const fetchDepartments = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/departments', {
      params: { admin_id: formData.admin_id || 1 }  // or use hardcoded admin_id for now
    });
    setDepartments(res.data);
    setView('departments');
  };
  
  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/courses', {
      params: { admin_id: formData.admin_id || 1 }  // use default or input value
    });
    setCourses(res.data);
    setView('courses');
  };
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/student/courses?admin_Id=${adminId}`);
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [adminId]);
  
  const handleDelete = async (type, id) => {
    await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`);
    type === 'departments' ? fetchDepartments() : fetchCourses();
  };
  
  const handleAdd = async (type) => {
    await axios.post(`http://localhost:5000/api/admin/${type}`, formData);
    setFormData({});
    type === 'departments' ? fetchDepartments() : fetchCourses();
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={fetchDepartments} className="bg-blue-500 text-white px-4 py-2 rounded">Departments</button>
        <button onClick={fetchCourses} className="bg-green-500 text-white px-4 py-2 rounded">Courses</button>
      </div>

      {view === 'departments' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Departments</h2>
          <input name="department_id" placeholder="ID" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="department_name" placeholder="Name" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="department_head" placeholder="Head (Faculty ID)" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="location" placeholder="Location" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="admin_id" placeholder="Admin ID" onChange={handleChange} className="border p-1 mr-2"/>
          <button onClick={() => handleAdd('departments')} className="bg-purple-600 text-white px-2 py-1">Add</button>

          <table className="table-auto w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Department ID</th>
                <th className="p-2 border">Department Name</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.department_id}>
                  <td className="p-2 border">{d.department_id}</td>
                  <td className="p-2 border">{d.department_name}</td>
                  <td className="p-2 border">{d.location}</td>
                  <td className="p-2 border">
                    <button onClick={() => handleDelete('departments', d.department_id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'courses' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <input name="course_code" placeholder="Code" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="course_name" placeholder="Name" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="semester_name" placeholder="Semester" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="admin_id" placeholder="Admin ID" onChange={handleChange} className="border p-1 mr-2"/>
          <input name="Faculty_id" placeholder="Faculty ID" onChange={handleChange} className="border p-1 mr-2"/>
          <button onClick={() => handleAdd('courses')} className="bg-purple-600 text-white px-2 py-1">Add</button>

          <table className="table-auto w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Course Code</th>
                <th className="p-2 border">Course Name</th>
                <th className="p-2 border">Semester</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.course_code}>
                  <td className="p-2 border">{c.course_code}</td>
                  <td className="p-2 border">{c.course_name}</td>
                  <td className="p-2 border">{c.semester_name}</td>
                  <td className="p-2 border">
                    <button onClick={() => handleDelete('courses', c.course_code)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
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
