import express from 'express';
import pool from '../config/database.js';  

const router = express.Router();

// Fetch all books
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM books');
        res.json(rows);  
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).json({ error: 'Failed to fetch books from the database' });
    }
});

// Search books with filters
router.get('/search', async (req, res) => {
    const { title, author, genre } = req.query;

    if (!title && !author && !genre) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    let query = 'SELECT * FROM books WHERE 1=1';  
    const queryParams = [];

    if (title) {
        query += ' AND title LIKE ?';  
        queryParams.push(`%${title.trim()}%`);
    }
    if (author) {
        query += ' AND author LIKE ?';  
        queryParams.push(`%${author.trim()}%`);
    }
    if (genre) {
        query += ' AND genre LIKE ?';  
        queryParams.push(`%${genre.trim()}%`);
    }

    try {
        const [rows] = await pool.execute(query, queryParams);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No books found matching the criteria.' });
        }

        res.json(rows);  
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Failed to search books in the database' });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const { title, author, genre, status, notes } = req.body;

    if (!title || !author || !genre || !status) {
        return res.status(400).json({ error: 'Title, author, genre, and status are required.' });
    }

    try {
        // Insert new book into the database
        const [result] = await pool.execute(
            'INSERT INTO books (title, author, genre, status, notes) VALUES (?, ?, ?, ?, ?)', 
            [title.trim(), author.trim(), genre.trim(), status, notes ? notes.trim() : null]
        );

        // Return the newly created book with ID
        const newBook = { id: result.insertId, title, author, genre, status, notes };
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Failed to add the book to the database' });
    }
});

export default router;
