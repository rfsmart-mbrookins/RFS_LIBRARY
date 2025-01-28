import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Helper function to sanitize inputs
const sanitizeInput = (input) => {
    return input ? `%${input.trim()}%` : '%';
};

// Fetch all comments associated with books and employees
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT c.*, 
                   b.title AS book_title, 
                   b.author AS book_author,
                   CONCAT(e.first_name, ' ', e.last_name) AS reviewed_by
            FROM comments c
            JOIN books b ON c.book_id = b.id
            JOIN employees e ON c.employee_id = e.id;
        `;
        const [rows] = await pool.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments from the database' });
    }
});

// Search comments with filters
router.get('/search', async (req, res) => {
    const { title, author, employee_id, reviewer } = req.query;

    if (!title && !author && !employee_id && !reviewer) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    let query = `
        SELECT c.*, 
               b.title AS book_title, 
               b.author AS book_author, 
               CONCAT(e.first_name, ' ', e.last_name) AS reviewed_by
        FROM comments c
        LEFT JOIN books b ON c.book_id = b.id
        LEFT JOIN employees e ON c.employee_id = e.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (title) {
        query += ' AND b.title LIKE ?';
        queryParams.push(sanitizeInput(title));
    }
    if (author) {
        query += ' AND b.author LIKE ?';
        queryParams.push(sanitizeInput(author));
    }
    if (reviewer) {
        query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ?)';
        const sanitizedReviewer = sanitizeInput(reviewer);
        queryParams.push(sanitizedReviewer, sanitizedReviewer);
    }
    if (employee_id) {
        query += ' AND c.employee_id = ?';
        queryParams.push(employee_id);
    }

    try {
        const [rows] = await pool.execute(query, queryParams);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No comments found matching the criteria.' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error searching comments:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
