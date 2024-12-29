// routes/employees.js
import express from 'express';
import pool from '../config/database.js'; // Adjust path if necessary

const router = express.Router();

// Route to get all employees
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM employees');
        res.json(rows); // Send all employees as a JSON response
    } catch (error) {
        console.error('Error fetching all employees:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to search employees by id, first_name, or last_name
router.get('/search', async (req, res) => {
    const { id, first_name, last_name } = req.query;
    let query = 'SELECT * FROM employees WHERE';
    const queryParams = [];

    if (id) {
        query += ' id = ?';
        queryParams.push(id);
    } else if (first_name) {
        query += ' first_name LIKE ?';
        queryParams.push(`%${first_name}%`);
    } else if (last_name) {
        query += ' last_name LIKE ?';
        queryParams.push(`%${last_name}%`);
    } else {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    try {
        const [rows] = await pool.execute(query, queryParams);
        res.json(rows); // Return the search results
    } catch (error) {
        console.error('Error searching employees:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
