// controllers/adminController.js
const db = require('../config/db');

// GET all departments
exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Department");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departments" });
  }
};

exports.addDepartment = async (req, res) =>  {
  console.log('Received department data:', req.body); 
  try {
    const { department_id, department_name, department_head, location } = req.body;
    
    const result = await db.query(
      'INSERT INTO department (department_id, department_name, department_head, location) VALUES (?, ?, ?, ?)',
      [department_id, department_name, department_head, location]
    );

    res.status(201).json({ message: 'Department added' });
  } catch (err) {
    console.error('Error adding department:', err); 
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// DELETE a department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM Department WHERE department_id = ?", [id]);
    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting department" });
  }
};

// GET all courses
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Course");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses" });
  }
};

exports.getFaculties = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT faculty_id, faculty_name, dob, gender, department_id FROM Faculty'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ error: 'Error fetching faculties' });
  }
};

// GET all students (selected fields)
exports.getStudents = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT student_id, student_name, department_id FROM Student'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
};

// POST a new course
exports.addCourse = async (req, res) => {
  const { course_code, course_name, semester_name, department_id, faculty_id } = req.body;
  try {
    await db.execute(
      "INSERT INTO Course (course_code, course_name, semester_name, department_id) VALUES (?, ?, ?, ?)",
      [course_code, course_name, semester_name, department_id || null]
    );
    res.json({ message: "Course added" });
  } catch (error) {
    res.status(500).json({ error: "Error adding course" });
  }
};

// DELETE a course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM Course WHERE course_code = ?", [id]);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting course" });
  }
};

exports.deleteFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM Faculty WHERE faculty_id = ?", [id]);
    res.json({ message: "Faculty deleted" });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: "Error deleting faculty" });
  }
};
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM Student WHERE student_id = ?", [id]);
    res.json({ message: "Student deleted" });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: "Error deleting student" });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const [rows] = await db.execute('CALL InsertorUpdateReport()');
    res.json({ message: 'Report generated successfully', data: rows });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating report' });
  }
};
