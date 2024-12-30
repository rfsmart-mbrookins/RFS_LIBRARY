import express from 'express';
import pool from '../config/database.js'; // Import database connection

const router = express.Router();

// Helper function to sanitize search inputs
const sanitizeInput = (input) => {
    return input ? `%${input.trim()}%` : '%';  // Return a wildcard if the input is empty
};

// Example route for fetching all comments, associated with books and employees
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT c.*, b.title AS Title, b.author AS Author, 
                   CONCAT(e.first_name, ' ', e.last_name) AS Reviewed_By
            FROM comments c
            LEFT JOIN books b ON c.book_id = b.id  
            LEFT JOIN employees e ON c.employee_id = e.id
        `;
        const [rows] = await pool.execute(query);
        res.json(rows);  // Return all comments along with book and employee data
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments from the database' });
    }
});

// Route to search comments by title, author, or reviewer (including book and employee data)
router.get('/search', async (req, res) => {
    const { title, author, reviewer } = req.query;

    let query = `
        SELECT c.*, b.title AS Title, b.author AS Author, 
               CONCAT(e.first_name, ' ', e.last_name) AS Reviewed_By
        FROM comments c
        LEFT JOIN books b ON c.book_id = b.id
        LEFT JOIN employees e ON c.employee_id = e.id
        WHERE 1=1  
    `;
    const queryParams = [];

    // Add conditions to the query if the parameters are provided
    if (title) {
        query += ' AND b.title LIKE ?';  // Search for book title with wildcards
        queryParams.push(sanitizeInput(title));
    }
    if (author) {
        query += ' AND b.author LIKE ?';  // Search for book author with wildcards
        queryParams.push(sanitizeInput(author));
    }
    if (reviewer) {
        query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ?)';  // Search for reviewer by first or last name
        const sanitizedReviewer = sanitizeInput(reviewer);
        queryParams.push(sanitizedReviewer, sanitizedReviewer);
    }

    // If no search criteria were provided, return a bad request error
    if (queryParams.length === 0) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    try {
        // Execute the query with parameters
        const [rows] = await pool.execute(query, queryParams);
        res.json(rows);  // Return search results with book and employee data
    } catch (error) {
        console.error('Error searching comments:', error);
        res.status(500).json({ error: 'Failed to search comments in the database' });
    }
});

export default router;
