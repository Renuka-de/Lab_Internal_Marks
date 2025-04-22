import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
//import './StudentPerformance.css';

const StudentPerformance = () => {
  const { courseCode } = useParams();
  const studentId = localStorage.getItem('id');
  const [performanceDetails, setPerformanceDetails] = useState(null);

  useEffect(() => {
    const fetchPerformanceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student/performance-detail?studentId=${studentId}&courseCode=${courseCode}`
        );
        setPerformanceDetails(response.data);
      } catch (error) {
        console.error('Error fetching performance details:', error);
      }
    };

    fetchPerformanceDetails();
  }, [studentId, courseCode]);

  return (
    <div className="performance-container">
      <h2 className="text-2xl font-bold mb-4">Performance Detail for Course: {courseCode}</h2>
      
      {performanceDetails ? (
        <table className="min-w-full table-auto border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th>Lab Observations</th>
              <th>Mid-term Exam Marks</th>
              <th>Total Marks</th>
              <th>Generated Date</th>
            </tr>
          </thead>
          <tbody>
            {performanceDetails.map((row, index) => (
              <tr key={index} className="text-center border-t">
                <td>{row.lab_percentage}</td>
                <td>{row.midterm_percentage}</td>
                <td>{row.total_marks}</td>
                <td>{new Date(row.generated_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No performance details available.</p>
      )}
    </div>
  );
};

export default StudentPerformance;
