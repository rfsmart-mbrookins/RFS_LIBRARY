import express from 'express';
import pool from '../config/database.js';  // Importing MySQL connection pool

const router = express.Router();

// Route to get all books
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM books');
        res.json(rows);  // Return all books
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to search books by title, author, or genre
router.get('/search', async (req, res) => {
    const { title, author, genre } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';  // Default query that always returns true
    const queryParams = [];

    // Add conditions to the query if the parameters are provided
    if (title) {
        query += ' AND title LIKE ?';  // Search for title with wildcards
        queryParams.push(`%${title}%`);
    }
    if (author) {
        query += ' AND author LIKE ?';  // Search for author with wildcards
        queryParams.push(`%${author}%`);
    }
    if (genre) {
        query += ' AND genre LIKE ?';  // Search for genre with wildcards
        queryParams.push(`%${genre}%`);
    }

    // If no search criteria were provided, return a bad request error
    if (queryParams.length === 0) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    try {
        // Execute the query with parameters
        const [rows] = await pool.execute(query, queryParams);
        res.json(rows);  // Return search results
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
