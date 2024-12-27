// database.js
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SDET3Password',
  database: 'rfs_library',
  waitForConnections: true,
  connectionLimit: 10,  // Adjust based on your needs
  queueLimit: 0
});

// Export the pool
module.exports = pool;