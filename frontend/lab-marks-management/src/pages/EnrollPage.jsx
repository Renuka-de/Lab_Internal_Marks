import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EnrollPage.css'

const EnrollPage = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const studentId = localStorage.getItem('id');

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/student/available-courses?studentId=${studentId}`);
        setAvailableCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchAvailableCourses();
  }, [studentId]);

  const handleEnroll = async (courseCode, facultyId) => {
    try {
      await axios.post(`http://localhost:5000/api/student/enroll`, {
        studentId,
        courseCode,
        facultyId,
      });
      alert("Enrolled successfully!");
      setAvailableCourses(prev => prev.filter(c => c.course_code !== courseCode));
    } catch (error) {
      alert("Enrollment failed.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      {availableCourses.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Faculty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableCourses.map((course, index) => (
              <tr key={index} className="text-center border-t">
                <td>{course.course_code}</td>
                <td>{course.course_name}</td>
                <td>{course.faculty_name}</td>
                <td>
                  <button
                    onClick={() => handleEnroll(course.course_code, course.faculty_id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Enroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No available courses for enrollment.</p>
      )}
    </div>
  );
};

export default EnrollPage;
