import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Sanitize inputs
const sanitizeInput = (input) => input ? `%${input.trim()}%` : '%';

// Get all checkouts
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT c.*, 
                   b.title AS book_title,    
                   CONCAT(e.first_name, ' ', e.last_name) AS reader
            FROM checkouts c
            JOIN books b ON c.book_id = b.id
            JOIN employees e ON c.employee_id = e.id;
        `;
        const [rows] = await pool.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Search checkouts
router.get('/search', async (req, res) => {
    const { title, reader, checkout_date, due_date } = req.query;

    let query = `
        SELECT c.*, 
               b.title AS book_title,  
               CONCAT(e.first_name, ' ', e.last_name) AS reader
        FROM checkouts c
        LEFT JOIN books b ON c.book_id = b.id
        LEFT JOIN employees e ON c.employee_id = e.id
        WHERE 1=1
    `;

    const queryParams = [];

    if (title) {
        query += ' AND b.title LIKE ?';
        queryParams.push(sanitizeInput(title));
    }

    if (reader) {
        query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ?)';
        const sanitizedReader = sanitizeInput(reader);
        queryParams.push(sanitizedReader, sanitizedReader);
    }

    if (checkout_date) {
        query += ' AND DATE(c.checkout_date) = ?';
        queryParams.push(checkout_date);
    }

    if (due_date) {
        query += ' AND DATE(c.due_date) = ?';
        queryParams.push(due_date);
    }

    if (queryParams.length === 0) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    try {
        const [rows] = await pool.execute(query, queryParams);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No Checkouts found matching the criteria.' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error searching Checkouts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
