// server.js
import express from 'express';
import employeesRouter from './routes/employees.js';
import booksRouter from './routes/books.js';
import commentsRouter from './routes/comments.js';
import checkoutsRouter from './routes/checkouts.js'; 

const app = express();
const port = process.env.PORT || 8000;

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Middleware for parsing JSON
app.use(express.json());

// Use the employees router
app.use('/api/employees', employeesRouter);

// Use the books router
app.use('/api/books', booksRouter);

// Use the comments router
app.use('/api/comments', commentsRouter);

// Use the checkouts router
app.use('/api/checkouts', checkoutsRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
