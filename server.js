// server.js (or app.js)
import express from 'express';
import employeesRouter from './routes/employees.js'; // Adjust the import path

const app = express();
const port = process.env.PORT || 8000;

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Use the employees router
app.use('/api/employees', employeesRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
