// main.js
const pool = require('./database'); // Import the connection pool

async function fetchEmployees() {
  try {
    // Execute the query using pool.execute() and async/await
    const [rows, fields] = await pool.execute('SELECT * FROM employees');
    console.log('Query Results:', rows);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

// Call the function
fetchEmployees();
