import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';

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

  const shouldShowAction = report.some(row => !row.total_marks && !row.generated_date);


  return (
    <div className="student-dashboard-container">
      
      <div className="dashboard-navbar">
        <button className="go-back-button1" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
        <h2 className="dashboard-title">Welcome, {studentDetails.student_name}</h2>
        <button
          className="info-button1"
          onClick={() => setShowInfo(!showInfo)}
        >
          Info
        </button>
        {showInfo && (
          <div className="info-panel">
            <h4>Student Personal Information</h4>
            <p><strong>Name:</strong> {studentDetails.student_name}</p>
            <p><strong>DOB:</strong> {studentDetails.dob}</p>
            <p><strong>Gender:</strong> {studentDetails.gender}</p>
            <p><strong>Phone:</strong> {studentDetails.s_phone_no}</p>
            <p><strong>Address:</strong> {studentDetails.house_name}, {studentDetails.place}, {studentDetails.city}</p>
            <button onClick={() => setShowInfo(!showInfo)}>Close</button>
          </div>
        )}
      </div>

      <div className="student-details-card">
        <p><strong>ID:</strong> {studentDetails.student_id}</p>
        <p><strong>Department:</strong> {studentDetails.department_name}</p>
        <p><strong>Phone:</strong> {studentDetails.s_phone_no}</p>
      </div>

      <button
        className="action-button"
        onClick={() => navigate('/enroll')}
      >
        Enroll in New Course
      </button>

      <div className="report-section">
        <h3 className="section-title">Report Summary</h3>
        {report.length > 0 ? (
          <table className="report-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                <th>Total Marks</th>
                <th>Generated Date</th>
                {shouldShowAction && <th>Action</th>}

              </tr>
            </thead>
            <tbody>
              {report.map((row, i) => (
                <tr key={i}>
                  <td>{row.course_code}</td>
                  <td
                    className="course-link"
                    onClick={() => navigate(`/performance/${row.course_code}`)}
                  >
                    {row.course_name}
                  </td>
                  <td>{row.faculty_name}</td>
                  <td>{row.total_marks}</td>
                  <td>{row.generated_date ? new Date(row.generated_date).toLocaleDateString() : ''}</td>
                  <td>
                    {(!row.total_marks && !row.generated_date) && (
                      <button
                        className="unenroll-button"
                        onClick={async () => {
                          try {
                            await axios.delete(`http://localhost:5000/api/student/unenroll`, {
                              data: {
                                student_id: studentId,
                                course_code: row.course_code
                              }
                            });
                            // Refresh report after unenroll
                            const updatedReport = await axios.get(`http://localhost:5000/api/student/report?id=${studentId}`);
                            setReport(updatedReport.data);
                          } catch (error) {
                            console.error('Error unenrolling:', error);
                          }
                        }}
                      >
                        Unenroll
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="no-data-message">No reports available.</p>}
      </div>
    </div>
  );
};

export default StudentDashboard;


