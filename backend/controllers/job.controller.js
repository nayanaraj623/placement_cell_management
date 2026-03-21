const pool = require('../config/db');

// Get all jobs with optional search and filter
exports.getAllJobs = async (req, res) => {
    const { search, company_id } = req.query;
    try {
        let query = 'SELECT j.*, c.company_name, c.location FROM JOB j JOIN COMPANY c ON j.company_id = c.id WHERE 1=1';
        let queryParams = [];

        if (search) {
            query += ' AND (j.role LIKE ? OR j.description LIKE ? OR c.company_name LIKE ?)';
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern);
        }
        
        if (company_id) {
            query += ' AND j.company_id = ?';
            queryParams.push(company_id);
        }

        query += ' ORDER BY j.created_at DESC';

        const [jobs] = await pool.query(query, queryParams);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving jobs', error });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const [job] = await pool.query('SELECT j.*, c.company_name, c.location FROM JOB j JOIN COMPANY c ON j.company_id = c.id WHERE j.id = ?', [req.params.id]);
        if (job.length === 0) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving job', error });
    }
};

exports.createJob = async (req, res) => {
    const { role, description, salary, vacancy, criteria_cgpa } = req.body;
    try {
        let company_id = req.body.company_id;
        
        if (req.user.role === 'Company') {
            const [company] = await pool.query('SELECT id FROM COMPANY WHERE user_id = ?', [req.user.id]);
            if (company.length === 0) return res.status(403).json({ message: 'Company profile missing' });
            company_id = company[0].id;
        }

        const [result] = await pool.query(
            'INSERT INTO JOB (company_id, role, description, salary, vacancy, criteria_cgpa) VALUES (?, ?, ?, ?, ?, ?)',
            [company_id, role, description, salary, vacancy, criteria_cgpa]
        );
        res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};

exports.updateJob = async (req, res) => {
    const { role, description, salary, vacancy, criteria_cgpa } = req.body;
    try {
        const [job] = await pool.query('SELECT company_id FROM JOB WHERE id = ?', [req.params.id]);
        if (job.length === 0) return res.status(404).json({ message: 'Job not found' });

        if (req.user.role === 'Company') {
            const [company] = await pool.query('SELECT id FROM COMPANY WHERE user_id = ?', [req.user.id]);
            if (company.length === 0 || company[0].id !== job[0].company_id) {
                return res.status(403).json({ message: 'Unauthorized to update this job' });
            }
        }

        await pool.query(
            'UPDATE JOB SET role=?, description=?, salary=?, vacancy=?, criteria_cgpa=? WHERE id=?',
            [role, description, salary, vacancy, criteria_cgpa, req.params.id]
        );
        res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const [job] = await pool.query('SELECT company_id FROM JOB WHERE id = ?', [req.params.id]);
        if (job.length === 0) return res.status(404).json({ message: 'Job not found' });

        if (req.user.role === 'Company') {
            const [company] = await pool.query('SELECT id FROM COMPANY WHERE user_id = ?', [req.user.id]);
            if (company.length === 0 || company[0].id !== job[0].company_id) {
                return res.status(403).json({ message: 'Unauthorized to delete this job' });
            }
        }

        await pool.query('DELETE FROM JOB WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
};
