import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/EnrollPage.css';

const EnrollPage = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const studentId = localStorage.getItem('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/student/available-courses?studentId=${studentId}`);
        setAvailableCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load available courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableCourses();
  }, [studentId]);

  const handleEnroll = async (courseCode, facultyId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`http://localhost:5000/api/student/enroll`, {
        studentId,
        courseCode,
        facultyId,
      });
      setSuccess(`Successfully enrolled in ${courseCode}!`);
      setAvailableCourses(prev => prev.filter(c => c.course_code !== courseCode));
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-container">
      
      <nav className="enroll-navbar">
        <button className="nav-back-button" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
        <div className="nav-title">Course Enrollment</div>
        <div className="nav-spacer"></div>
      </nav>

      <div className="enroll-content">
        <h2 className="enroll-heading">Available Courses</h2>
        
       
        {loading && <div className="loading-indicator">Loading available courses...</div>}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {availableCourses.length > 0 ? (
          <div className="courses-table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Faculty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableCourses.map((course, index) => (
                  <tr key={index}>
                    <td data-label="Course Code">{course.course_code}</td>
                    <td data-label="Course Name">{course.course_name}</td>
                    <td data-label="Faculty">{course.faculty_name}</td>
                    <td data-label="Action">
                      <button
                        onClick={() => handleEnroll(course.course_code, course.faculty_id)}
                        className="enroll-button"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Enroll'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <div className="no-courses">No available courses for enrollment.</div>
        )}
      </div>
    </div>
  );
};

export default EnrollPage;