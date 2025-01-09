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

// Add a new employee
router.post('/', async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        job_title,
        department,
        hire_date = new Date(), // Default to current date if not provided
        age = null,
        is_rf_smart_employee = false,
        is_reader = false,
        is_donor = false,
        pet_type_1 = null,
        pet_name_1 = null,
        pet_type_2 = null,
        pet_name_2 = null,
        fav_color = null,
        fav_music = null,
        less_fav_music = null,
    } = req.body;

    if (!first_name || !last_name || !email || !job_title) {
        return res.status(400).json({ error: 'First name, last name, email, and job title are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        // Insert new employee into the database
        const [result] = await pool.execute(
            `INSERT INTO employees 
            (first_name, last_name, email, job_title, department, hire_date, age, is_rf_smart_employee, is_reader, is_donor, pet_type_1, pet_name_1, pet_type_2, pet_name_2, fav_color, fav_music, less_fav_music) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name.trim(),
                last_name.trim(),
                email.trim(),
                job_title.trim(),
                department ? department.trim() : null,
                hire_date,
                age,
                is_rf_smart_employee,
                is_reader,
                is_donor,
                pet_type_1,
                pet_name_1,
                pet_type_2,
                pet_name_2,
                fav_color,
                fav_music,
                less_fav_music,
            ]
        );

        // Return the newly created employee with ID
        const newEmployee = {
            id: result.insertId,
            first_name,
            last_name,
            email,
            job_title,
            department,
            hire_date,
            age,
            is_rf_smart_employee,
            is_reader,
            is_donor,
            pet_type_1,
            pet_name_1,
            pet_type_2,
            pet_name_2,
            fav_color,
            fav_music,
            less_fav_music,
        };

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Failed to add the employee to the database' });
    }
});

export default router;
