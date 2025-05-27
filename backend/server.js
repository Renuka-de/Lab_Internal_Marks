const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes); 
app.use('/api/student', studentRoutes); 
app.use('/api/faculty', facultyRoutes); 
app.use('/api/admin', adminRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
