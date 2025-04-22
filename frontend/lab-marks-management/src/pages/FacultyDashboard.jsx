import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [facultyDetails, setFacultyDetails] = useState(null); // To store faculty's personal details
  const [showInfoModal, setShowInfoModal] = useState(false); // To toggle modal visibility

  const facultyId = localStorage.getItem('id');
  const adminId = localStorage.getItem('adminId') || 1; // Default admin ID

  // Fetch faculty details
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/faculty/details?facultyId=${facultyId}`);
        setFacultyDetails(res.data);
      } catch (err) {
        console.error('Error fetching faculty details:', err);
        setError('Failed to load faculty details.');
      }
    };
    fetchFacultyDetails();
  }, [facultyId]);

  // Fetch courses handled by faculty
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5000/api/faculty/courses?facultyId=${facultyId}`);
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching faculty courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [facultyId]);

  const handleCourseClick = async (course) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setSelectedCourse(course);
      
      const res = await axios.get(`http://localhost:5000/api/faculty/course-students?courseCode=${course.course_code}`);
      
      // Transform data to match expected format
      const transformedStudents = res.data.map(student => ({
        student_id: student.student_id,
        student_name: student.student_name,
        lab1: student.lab1 !== undefined ? student.lab1 : '',
        lab2: student.lab2 !== undefined ? student.lab2 : '',
        lab3: student.lab3 !== undefined ? student.lab3 : '',
        lab4: student.lab4 !== undefined ? student.lab4 : '',
        mid_term: student.mid_term !== undefined ? student.mid_term : ''
      }));
      
      setStudents(transformedStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (studentIndex, field, value) => {
    // Validate input (numbers between 0-25 or empty)
    const validatedValue = value === '' ? '' : 
      Math.min(25, Math.max(0, parseInt(value) || 0));
    
    setStudents(prev => {
      const updated = [...prev];
      updated[studentIndex][field] = validatedValue;
      return updated;
    });
  };

  const handleSaveMarks = async (student) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
  
      // Prepare lab observations - filter out empty values and ensure proper format
      const lab_observations = [1, 2, 3, 4]
        .map(labNo => ({
          lab_no: labNo,
          marks_out_of_25: student[`lab${labNo}`] || 0
        }))
        .filter(lab => lab.marks_out_of_25 !== '' && lab.marks_out_of_25 !== null);
  
      // Prepare mid-term mark (default to 0 if empty)
      const mid_term_mark = student.mid_term || 0;
  
      // Validate at least one mark is entered
      if (lab_observations.length === 0 && mid_term_mark === 0) {
        throw new Error('Please enter at least one mark');
      }
  
      const response = await axios.post(`http://localhost:5000/api/faculty/update-marks`, {
        studentId: student.student_id,
        courseCode: selectedCourse.course_code,
        lab_observations,
        mid_term_mark
      });
  
      setSuccess(response.data.message || 'Marks updated successfully!');
    } catch (err) {
      console.error('Error saving marks:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update marks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
  };

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>

      {/* Info Button */}
      <button className="info-button" onClick={toggleInfoModal}>
        Info
      </button>

      {/* Info Modal */}
      {showInfoModal && facultyDetails && (
        <div className="info-modal">
          <div className="modal-content">
            <h3>Faculty Details</h3>
            <p><strong>Name:</strong> {facultyDetails.faculty_name}</p>
            <p><strong>Date of Birth:</strong> {facultyDetails.dob}</p>
            <p><strong>Gender:</strong> {facultyDetails.gender}</p>
            <p><strong>Phone Number:</strong> {facultyDetails.f_phone_no}</p>
            <p><strong>Address:</strong> {facultyDetails.house_name}, {facultyDetails.place}, {facultyDetails.city}</p>
            <button onClick={toggleInfoModal}>Close</button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading && <div className="loading-overlay">Loading...</div>}

      {/* Course Selection */}
      <div className="course-selection">
        <h3>Your Courses</h3>
        {courses.length > 0 ? (
          <div className="course-buttons">
            {courses.map(course => (
              <button
                key={course.course_code}
                onClick={() => handleCourseClick(course)}
                className={selectedCourse?.course_code === course.course_code ? 'active' : ''}
                disabled={loading}
              >
                {course.course_name} ({course.course_code})
              </button>
            ))}
          </div>
        ) : (
          <p>No courses assigned</p>
        )}
      </div>

      {/* Student Marks Table */}
      {selectedCourse && (
        <div className="marks-table-container">
          <h3>Students in {selectedCourse.course_name}</h3>
          
          {students.length > 0 ? (
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  {[1, 2, 3, 4].map(labNo => (
                    <th key={labNo}>Lab {labNo} (25)</th>
                  ))}
                  <th>Mid Term (25)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={`${student.student_id}-${idx}`}>
                    <td>{student.student_id}</td>
                    <td>{student.student_name}</td>
                    
                    {/* Lab Inputs */}
                    {[1, 2, 3, 4].map(labNo => (
                      <td key={labNo}>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={student[`lab${labNo}`]}
                          onChange={(e) => handleInputChange(idx, `lab${labNo}`, e.target.value)}
                          disabled={loading}
                        />
                      </td>
                    ))}
                    
                    {/* Mid Term Input */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={student.mid_term}
                        onChange={(e) => handleInputChange(idx, 'mid_term', e.target.value)}
                        disabled={loading}
                      />
                    </td>
                    
                    {/* Save Button */}
                    <td>
                      <button
                        onClick={() => handleSaveMarks(student)}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No students enrolled in this course</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
