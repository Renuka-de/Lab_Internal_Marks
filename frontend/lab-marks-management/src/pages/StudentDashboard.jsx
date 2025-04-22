//pages/StudentDashboard
/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const [report, setReport] = useState([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem('id');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [studentRes, reportRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/student/details?id=${studentId}`),
          axios.get(`http://localhost:5000/api/student/report?id=${studentId}`)
        ]);
        setStudentDetails(studentRes.data);
        setReport(reportRes.data);
      } catch (error) {
        console.error('Error fetching dashboard info:', error);
      }
    };
    fetchStudentData();
  }, [studentId]);

  return (
    <div className="student-dashboard-container">
      <h2 className="text-2xl font-bold mb-4">Welcome, {studentDetails.student_name}</h2>
      <div className="student-details border p-4 mb-4 rounded bg-gray-100">
        <p><strong>ID:</strong> {studentDetails.student_id}</p>
        <p><strong>Department:</strong> {studentDetails.department_name}</p>
        <p><strong>Phone:</strong> {studentDetails.s_phone_no}</p>
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700"
        onClick={() => navigate('/enroll')}
      >
        Enroll in New Course
      </button>

      <h3 className="text-xl font-semibold mb-2">Report Summary</h3>
      {report.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Faculty</th>
              <th>Total Marks</th>
              <th>Generated Date</th>
            </tr>
          </thead>
          <tbody>
            {report.map((row, i) => (
              <tr key={i} className="text-center border-t">
                <td>{row.course_code}</td>
                <td>{row.course_name}</td>
                <td>{row.course_faculty}</td>
                <td>{row.total_marks}</td>
                <td>{new Date(row.generated_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No reports available.</p>}
    </div>
  );
};

export default StudentDashboard;*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const [report, setReport] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const studentId = localStorage.getItem('id');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [studentRes, reportRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/student/details?id=${studentId}`),
          axios.get(`http://localhost:5000/api/student/report?id=${studentId}`)
        ]);
        setStudentDetails(studentRes.data);
        setReport(reportRes.data);
      } catch (error) {
        console.error('Error fetching dashboard info:', error);
      }
    };
    fetchStudentData();
  }, [studentId]);

  return (
    <div className="student-dashboard-container relative">
      {/* Info Button */}
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        onClick={() => setShowInfo(!showInfo)}
      >
        Info
      </button>

      {showInfo && (
        <div className="absolute top-14 left-4 bg-white border p-4 rounded shadow-lg z-10">
          <h4 className="text-lg font-semibold mb-2">Student Personal Information</h4>
          <p><strong>Name:</strong> {studentDetails.student_name}</p>
          <p><strong>DOB:</strong> {studentDetails.dob}</p>
          <p><strong>Gender:</strong> {studentDetails.gender}</p>
          <p><strong>Phone:</strong> {studentDetails.s_phone_no}</p>
          <p><strong>Address:</strong> {studentDetails.house_name}, {studentDetails.place}, {studentDetails.city}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center">Welcome, {studentDetails.student_name}</h2>
      <div className="student-details border p-4 mb-4 rounded bg-gray-100">
        <p><strong>ID:</strong> {studentDetails.student_id}</p>
        <p><strong>Department:</strong> {studentDetails.department_name}</p>
        <p><strong>Phone:</strong> {studentDetails.s_phone_no}</p>
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700"
        onClick={() => navigate('/enroll')}
      >
        Enroll in New Course
      </button>

      <h3 className="text-xl font-semibold mb-2">Report Summary</h3>
      {report.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Faculty</th>
              <th>Total Marks</th>
              <th>Generated Date</th>
            </tr>
          </thead>
          <tbody>
            {report.map((row, i) => (
              <tr key={i} className="text-center border-t">
                <td>{row.course_code}</td>
                <td
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => navigate(`/performance/${row.course_code}`)}
                >
                  {row.course_name}
                </td>
                <td>{row.course_faculty}</td>
                <td>{row.total_marks}</td>
                <td>{new Date(row.generated_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No reports available.</p>}
    </div>
  );
};

export default StudentDashboard;


