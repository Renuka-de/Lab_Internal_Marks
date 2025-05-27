// controllers/facultyController.js
const pool = require('../config/db');

const getFacultyDetails = async (req, res) => {
  const { facultyId } = req.query;

  if (!facultyId) {
    return res.status(400).json({ message: 'Faculty ID is required' });
  }

  try {
    const [facultyDetails] = await pool.execute(
      `SELECT faculty_id, faculty_name, dob, gender, house_name, place, city, f_phone_no, department_id 
       FROM faculty 
       WHERE faculty_id = ?`,
      [facultyId]
    );

    if (facultyDetails.length === 0) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(facultyDetails[0]); // Send back the first (and only) faculty record
  } catch (error) {
    console.error('Error in getFacultyDetails:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get courses handled by a faculty
const getCoursesByFaculty = async (req, res) => {
  const { facultyId } = req.query;

  try {
    const [courses] = await pool.execute(
      `SELECT course_code, course_name, semester_name 
       FROM course natural join teaches 
       WHERE faculty_id = ?`,
      [facultyId]
    );
    res.json(courses);
  } catch (error) {
    console.error('Error in getCoursesByFaculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStudentsInCourse = async (req, res) => {
  const { courseCode } = req.query;

  console.log('Fetching students for courseCode:', courseCode);  

  try {
      const [students] = await pool.execute(
          `
          SELECT 
          s.student_id,
          s.student_name,
          MAX(CASE WHEN lo.lab_no = 1 THEN lo.marks_out_of_25 ELSE 0 END) AS lab1,
          MAX(CASE WHEN lo.lab_no = 2 THEN lo.marks_out_of_25 ELSE 0 END) AS lab2,
          MAX(CASE WHEN lo.lab_no = 3 THEN lo.marks_out_of_25 ELSE 0 END) AS lab3,
          MAX(CASE WHEN lo.lab_no = 4 THEN lo.marks_out_of_25 ELSE 0 END) AS lab4,
          MAX(IFNULL(m.marks_out_of_25, 0)) AS mid_term
          FROM enrollment e
          JOIN student s ON e.student_id = s.student_id
          LEFT JOIN lab_observation lo ON lo.student_id = s.student_id AND lo.course_code = e.course_code
          LEFT JOIN mid_term_exam m ON m.student_id = s.student_id AND m.course_code = e.course_code
          WHERE e.course_code = ?
          GROUP BY s.student_id, s.student_name;
          `,
          [courseCode]
      );

      console.log('Fetched students:', students);  // Log students fetched

      res.json(students);
  } catch (error) {
      console.error('Error in getStudentsInCourse:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
// Update marks for a student in a course
const updateMarks = async (req, res) => {
    const { studentId, courseCode, lab_observations, mid_term_mark } = req.body;
  
    if (!Array.isArray(lab_observations)) {
      return res.status(400).json({ message: 'lab_observations must be an array' });
    }
  
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Update or insert each lab observation
      for (const lab of lab_observations) {
        const { lab_no, marks_out_of_25 } = lab;
        console.log('Inserting/updating lab observation:', studentId, courseCode, lab_no, marks_out_of_25);
  
        await connection.execute(
          `INSERT INTO lab_observation (student_id, course_code, lab_no, marks_out_of_25)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE marks_out_of_25 = ?`,
          [studentId, courseCode, lab_no, marks_out_of_25, marks_out_of_25]
        );
      }
  
      // Update or insert mid-term exam mark
      console.log('Inserting/updating mid-term exam:', studentId, courseCode, mid_term_mark);
      await connection.execute(
        `INSERT INTO mid_term_exam (student_id, course_code, marks_out_of_25)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE marks_out_of_25 = ?`,
        [studentId, courseCode, mid_term_mark, mid_term_mark]
      );
      
      await connection.commit();
      res.json({ message: 'Marks updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error in updateMarks:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      connection.release();
    }
  };

module.exports = { getCoursesByFaculty, getStudentsInCourse, updateMarks ,getFacultyDetails};
