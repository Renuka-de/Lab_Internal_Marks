//controllers/studentController.js
const pool = require('../config/db');

const getStudentDetails = async (req, res) => {
  const { id } = req.query;
  const [[student]] = await pool.execute(
    `SELECT s.*, d.department_name FROM student s JOIN department d ON s.department_id = d.department_id WHERE s.student_id = ?`,
    [id]
  );
  res.json(student);
};

const getStudentReport = async (req, res) => {
  const { id } = req.query;
  const [rows] = await pool.execute(
    `SELECT * FROM view_student_report_summary WHERE student_id = ?`,
    [id]
  );
  res.json(rows);
};

const getStudentPerformanceDetail = async (req, res) => {
  const { studentId, courseCode } = req.query;
  try {
    const [details] = await pool.execute(
      `SELECT * FROM view_student_performance_detail WHERE student_id = ? AND course_code = ? limit 1`,
      [studentId, courseCode]
    );
    res.json(details);
  } catch (error) {
    console.error('Error fetching performance detail:', error);
    res.status(500).json({ message: 'Failed to fetch performance detail' });
  }
};


const getAvailableCourses = async (req, res) => {
  const { studentId } = req.query;
  const [courses] = await pool.execute(
    `SELECT t.course_code, c.course_name, f.faculty_name, f.faculty_id
     FROM teaches t
     JOIN course c ON t.course_code = c.course_code
     JOIN faculty f ON t.faculty_id = f.faculty_id
     WHERE t.course_code NOT IN (
       SELECT course_code FROM enrollment WHERE student_id = ?
     )`,
    [studentId]
  );
  res.json(courses);
};

const enrollInCourse = async (req, res) => {
  const { studentId, courseCode, facultyId } = req.body;
  try {
    await pool.query(`CALL enrollStudent(?, ?, ?)`, [studentId, courseCode, facultyId]);
    res.json({ message: 'Enrolled successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Enrollment failed.' });
  }
};


module.exports = { enrollInCourse,getAvailableCourses,getStudentDetails,getStudentReport,getStudentPerformanceDetail  };
