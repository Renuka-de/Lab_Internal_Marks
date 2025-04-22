const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pool = require('./config/db'); // Import MySQL connection

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes); // Auth routes (login, register)
app.use('/api/student', studentRoutes); // Student routes
app.use('/api/faculty', facultyRoutes); // Faculty routes
app.use('/api/admin', adminRoutes); // Admin routes
const query = 'SELECT * FROM student';
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
