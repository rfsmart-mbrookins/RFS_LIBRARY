// database.js
import mysql from 'mysql2/promise';

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SDET3Password',
  database: 'rfs_library',
  waitForConnections: true,
  connectionLimit: 10,  
  queueLimit: 0
});

// Export pool
export default pool;