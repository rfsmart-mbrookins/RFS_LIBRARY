import express from 'express';
import employeesRouter from './routes/employees.js';
import booksRouter from './routes/books.js';
import commentsRouter from './routes/comments.js';
import checkoutsRouter from './routes/checkouts.js'; 

const app = express();
const port = process.env.PORT || 8000;

// static files
app.use(express.static('public'));

// Middleware
app.use(express.json());

// employees router
app.use('/api/employees', employeesRouter);

// books router
app.use('/api/books', booksRouter);

// comments router
app.use('/api/comments', commentsRouter);

//  checkouts router
app.use('/api/checkouts', checkoutsRouter);

// server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
