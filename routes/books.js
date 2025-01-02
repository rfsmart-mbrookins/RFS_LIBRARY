import express from 'express';
import pool from '../config/database.js';  

const router = express.Router();

// Route to get all books
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM books');
        res.json(rows);  
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to search books by title, author, or genre
router.get('/search', async (req, res) => {
    const { title, author, genre } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';  
    const queryParams = [];

    if (title) {
        query += ' AND title LIKE ?';  
        queryParams.push(`%${title}%`);
    }
    if (author) {
        query += ' AND author LIKE ?';  
        queryParams.push(`%${author}%`);
    }
    if (genre) {
        query += ' AND genre LIKE ?';  
        queryParams.push(`%${genre}%`);
    }

    // no search criteria were provided
    if (queryParams.length === 0) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }


    try {
        const [rows] = await pool.execute(query, queryParams);
        res.json(rows);  
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
