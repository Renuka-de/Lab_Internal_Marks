//controllers/adminController.js
const db = require('../config/db');

// GET Departments
exports.getDepartments = async (req, res) => {
  const admin_id = req.query.admin_id; // Now taken from query string
  console.log(admin_id);
  if (!admin_id) return res.status(400).json({ error: "admin_id is required" });

  const [rows] = await db.query("SELECT * FROM Department WHERE admin_id = ?", [admin_id]);
  res.json(rows);
};

// POST Add Department
exports.addDepartment = async (req, res) => {
  const { department_id, department_name, department_head, location, admin_id } = req.body;
  if (!admin_id) return res.status(400).json({ error: "admin_id is required" });

  await db.query(
    "INSERT INTO Department (department_id, department_name, department_head, location, admin_id) VALUES (?, ?, ?, ?, ?)",
    [department_id, department_name, department_head || null, location, admin_id]
  );
  res.json({ message: "Department added" });
};

// GET Courses
exports.getCourses = async (req, res) => {
  const admin_id = req.query.admin_id;
  if (!admin_id) return res.status(400).json({ error: "admin_id is required" });

  const [rows] = await db.query("SELECT * FROM Course WHERE admin_id = ?", [admin_id]);
  res.json(rows);
};

// POST Add Course
exports.addCourse = async (req, res) => {
  const { course_code, course_name, semester_name, Faculty_id, admin_id } = req.body;
  if (!admin_id) return res.status(400).json({ error: "admin_id is required" });

  await db.query(
    "INSERT INTO Course (course_code, course_name, semester_name, admin_id, Faculty_id) VALUES (?, ?, ?, ?, ?)",
    [course_code, course_name, semester_name, admin_id, Faculty_id || null]
  );
  res.json({ message: "Course added" });
};

// DELETE Department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM Department WHERE department_id = ?", [id]);
  res.json({ message: "Department deleted" });
};

// DELETE Course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM Course WHERE course_code = ?", [id]);
  res.json({ message: "Course deleted" });
};
