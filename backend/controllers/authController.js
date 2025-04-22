//controllers/authController.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
  const { role, ...data } = req.body;

  console.log('🔵 Register Request Body:', req.body);

  if (!role) {
    console.log('🔴 Missing role');
    return res.status(400).json({ error: 'Role is required' });
  }

  let tableName;
  let columns = [];
  let values = [];

  if (role === 'admin') {
    tableName = 'admin';
    columns = ['admin_id', 'username', 'email', 'password'];
    values = [data.admin_id, data.username, data.email, data.password];
  } else if (role === 'faculty') {
    tableName = 'faculty';
    columns = ['faculty_id', 'faculty_name', 'dob', 'gender', 'house_name', 'place', 'city', 'f_phone_no', 'admin_id', 'department_id'];
    values = [
      data.faculty_id, data.faculty_name, data.dob, data.gender, data.house_name, data.place,
      data.city, data.f_phone_no, data.admin_id, data.department_id
    ];
  } else if (role === 'student') {
    tableName = 'student';
    columns = ['student_id', 'student_name', 'dob', 'gender', 'house_name', 'place', 'city', 's_phone_no', 'admin_id', 'department_id'];
    values = [
      data.student_id, data.student_name, data.dob, data.gender, data.house_name, data.place,
      data.city, data.s_phone_no, data.admin_id, data.department_id
    ];
  } else {
    console.log('🔴 Invalid role');
    return res.status(400).json({ error: 'Invalid role' });
  }

  const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
  console.log('🟡 SQL Query:', query);
  console.log('🟢 Values:', values);

  try {
    const [result] = await pool.execute(query, values);
    console.log('✅ Insert Result:', result);

    return res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    return res.status(500).json({
      error: `${role.charAt(0).toUpperCase() + role.slice(1)} registration failed`,
      details: err
    });
  }
};

// Login user
exports.login = async (req, res) => {
  const { id, role } = req.body;
  console.log('🔵 Login Request Received');
  console.log('🟢 Login Body:', req.body);

  if (!id || !role) {
    console.log('🔴 Missing id or role');
    return res.status(400).json({ error: 'User ID and Role are required' });
  }

  let tableName;
  if (role === 'admin') {
    tableName = 'admin';
  } else if (role === 'faculty') {
    tableName = 'faculty';
  } else if (role === 'student') {
    tableName = 'student';
  } else {
    console.log('🔴 Invalid role');
    return res.status(400).json({ error: 'Invalid role' });
  }

  const query = `SELECT * FROM ${tableName} WHERE ${role}_id = ?`;
  console.log('🟡 SQL Query:', query);
  console.log('🟢 ID:', id);

  try {
    const [result] = await pool.execute(query, [id]);
    console.log('🟢 Query Result:', result);

    if (result.length === 0) {
      console.log('🔴 No user found');
      return res.status(401).json({ message: 'Invalid ID or Role' });
    }

    const user = result[0];
    console.log('✅ User Found:', user);

    return res.status(200).json({
      message: 'Login successful',
      role,
      userId: user[`${role}_id`],
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};
