import express from 'express';
import pool from '../config/database.js'; 

const router = express.Router();

// all employees
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM employees');
        res.json(rows); // Send all employees as a JSON response
    } catch (error) {
        console.error('Error fetching all employees:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// search employees by id, first_name, or last_name
router.get('/search', async (req, res) => {
    const { id, first_name, last_name } = req.query;
    const conditions = [];
    const queryParams = [];
    if (id) {
        conditions.push('id = ?');
        queryParams.push(id);
    }
    if (first_name) {
        conditions.push('first_name LIKE ?');
        queryParams.push(`%${first_name}%`);
    }
    if (last_name) {
        conditions.push('last_name LIKE ?');
        queryParams.push(`%${last_name}%`);
    }


    // query
    const query = `SELECT * FROM employees WHERE ${conditions.join(' AND ')}`;

    try {
        const [rows] = await pool.execute(query, queryParams);
        res.json(rows); // Return the search results
    } catch (error) {
        console.error('Error searching employees:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
