const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MySQL connection pool setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // default to localhost if not specified
  user: process.env.DB_USER || 'root',      // replace with your DB username
  password: process.env.DB_PASSWORD || 'Renu@1803',  // replace with your DB password
  database: process.env.DB_NAME || 'lab_internal_marks', // replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to MySQL as ID ' + connection.threadId);
    connection.release(); // Release the connection after testing
  }
});

// Export the pool for use in other files
module.exports = pool.promise();
