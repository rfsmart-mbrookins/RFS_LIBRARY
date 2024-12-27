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

// Function to fetch all readers
async function fetchReaders() {
  try {
    const [rows] = await pool.execute("SELECT * FROM employees WHERE is_reader = 1");
    console.log('Readers:', rows);
  } catch (err) {
    console.error('Error fetching readers:', err.message);
  }
}

// Function to fetch all donors
async function fetchDonors() {
  try {
    const [rows] = await pool.execute("SELECT * FROM employees WHERE is_donor = 1");
    console.log('Donors:', rows);
  } catch (err) {
    console.error('Error fetching donors:', err.message);  
  }
}

// Function to fetch all books
async function fetchBooks() {
    try {
      const [rows] = await pool.execute("SELECT * FROM books");
      console.log('Books:', rows);
    } catch (err) {
      console.error('Error fetching books:', err.message);  
    }
  }

  // Function to fetch all checkouts
async function fetchCheckouts() {
    try {
      const [rows] = await pool.execute("SELECT * FROM checkouts");
      console.log('Checkouts:', rows);
    } catch (err) {
      console.error('Error fetching checkouts:', err.message);  
    }
  }

  // Function to fetch all comments
async function fetchComments() {
    try {
      const [rows] = await pool.execute("SELECT * FROM comments");
      console.log('Comments:', rows);
    } catch (err) {
      console.error('Error fetching comments:', err.message);  
    }
  }

// Call the functions
fetchEmployees();
fetchReaders();
fetchDonors();
fetchBooks();
fetchCheckouts();
fetchComments();
