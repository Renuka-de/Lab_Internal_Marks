import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StudentPerformance.css';

const StudentPerformance = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const studentId = localStorage.getItem('id');
  const [performanceDetails, setPerformanceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/student/performance-detail?studentId=${studentId}&courseCode=${courseCode}`
        );
        setPerformanceDetails(response.data);
      } catch (error) {
        console.error('Error fetching performance details:', error);
        setError('Failed to load performance details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceDetails();
  }, [studentId, courseCode]);

  return (
    <div className="performance-container">
      
      <nav className="performance-navbar">
        <button className="nav-back-button" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
        <div className="nav-title">Performance Details</div>
        <div className="nav-spacer"></div> 
      </nav>

      <div className="performance-content">
        <h2 className="performance-heading">
          Performance for Course: <span className="course-code">{courseCode}</span>
        </h2>
        
        {loading && <div className="loading-indicator">Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        {performanceDetails && performanceDetails.length > 0 ? (
          <div className="performance-table-container">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Lab Observations</th>
                  <th>Mid-term Exam</th>
                  <th>Total Marks</th>
                  <th>Generated Date</th>
                </tr>
              </thead>
              <tbody>
                {performanceDetails.map((row, index) => (
                  <tr key={index}>
                    <td data-label="Lab Observations">{row.lab_percentage}</td>
                    <td data-label="Mid-term Exam">{row.midterm_percentage}</td>
                    <td data-label="Total Marks" className="total-marks">
                      {row.total_marks}
                    </td>
                    <td data-label="Generated Date">
                      {new Date(row.generated_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <div className="no-data">No performance details available for this course.</div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformance;