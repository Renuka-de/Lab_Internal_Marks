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
    `SELECT DISTINCT
    c.course_code,
    c.course_name,
    f.faculty_name,
    v.total_marks,
    v.generated_date
    FROM enrollment e
    JOIN course c ON e.course_code = c.course_code
    JOIN teaches t ON c.course_code = t.course_code AND t.faculty_id = e.faculty_id
    JOIN faculty f ON f.faculty_id = t.faculty_id
    LEFT JOIN view_student_performance_detail v 
    ON v.student_id = e.student_id AND v.course_code = e.course_code
    WHERE e.student_id = ?
    ORDER BY c.course_code;

`,
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
     ) AND c.department_id IN(SELECT department_id FROM student WHERE student_id=?)`,
    [studentId,studentId]
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


const unenrollCourse = async (req, res) => {
  const { student_id, course_code } = req.body;

  if (!student_id || !course_code) {
    return res.status(400).json({ message: "Student ID and Course Code are required" });
  }

  try {
    const [result] = await pool.execute(
      `DELETE FROM enrollment WHERE student_id = ? AND course_code = ?`,
      [student_id, course_code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (error) {
    console.error('Error during unenrollment:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { unenrollCourse, enrollInCourse,getAvailableCourses,getStudentDetails,getStudentReport,getStudentPerformanceDetail  };
