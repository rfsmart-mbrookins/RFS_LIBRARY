import express from 'express';
import pool from '../config/database.js'; // Import database connection

const router = express.Router();

// Example route for checkouts
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM checkouts');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
