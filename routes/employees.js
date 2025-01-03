import express from 'express';
import pool from '../config/database.js'; 

const router = express.Router();

// Fetch all employees
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM employees');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching all employees:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Search employees by ID, first_name, or last_name
router.get('/search', async (req, res) => {
    const { id, first_name, last_name } = req.query;

    if (!id && !first_name && !last_name) {
        return res.status(400).json({ error: 'No search criteria provided.' });
    }

    const conditions = [];
    const queryParams = [];

    if (id) {
        conditions.push('id = ?');
        queryParams.push(id);
    }

    if (first_name) {
        conditions.push('first_name LIKE ?');
        queryParams.push(`%${first_name.trim()}%`);
    }

    if (last_name) {
        conditions.push('last_name LIKE ?');
        queryParams.push(`%${last_name.trim()}%`);
    }

    const query = `SELECT * FROM employees WHERE ${conditions.join(' AND ')}`;

    try {
        const [rows] = await pool.execute(query, queryParams);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No employees found matching the criteria.' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error searching employees:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
