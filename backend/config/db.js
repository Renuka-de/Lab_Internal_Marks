const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',     
  password: process.env.DB_PASSWORD || 'Renu@1803',  
  database: process.env.DB_NAME || 'lab_internal_marks', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to MySQL as ID ' + connection.threadId);
    connection.release(); 
  }
});


module.exports = pool.promise();
