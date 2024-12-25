const pool = require('./database'); // Import the connection pool

// Function to fetch all employees
async function fetchEmployees() {
  try {
    const [rows] = await pool.execute('SELECT * FROM employees');
    console.log('All Employees:', rows);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
  }
}

// Function to fetch employees with role = 'reader'
async function fetchReaders() {
  try {
    const [rows] = await pool.execute("SELECT * FROM employees WHERE role = 'reader'");
    console.log('Readers:', rows);
  } catch (err) {
    console.error('Error fetching readers:', err.message);
  }
}

// Function to fetch employees with role = 'donor'
async function fetchDonors() {
  try {
    const [rows] = await pool.execute("SELECT * FROM employees WHERE role = 'donor'");
    console.log('Donors:', rows);
  } catch (err) {
    console.error('Error fetching readers:', err.message);
  }
}

// Call the functions
fetchEmployees();
fetchReaders();
fetchDonors();

