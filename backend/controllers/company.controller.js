const pool = require('../config/db');

exports.getAllCompanies = async (req, res) => {
    try {
        const [companies] = await pool.query('SELECT c.*, u.username FROM COMPANY c JOIN USERS u ON c.user_id = u.id');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving companies', error });
    }
};

exports.getCompanyById = async (req, res) => {
    try {
        const [company] = await pool.query('SELECT c.*, u.username FROM COMPANY c JOIN USERS u ON c.user_id = u.id WHERE c.id = ?', [req.params.id]);
        if (company.length === 0) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json(company[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving company', error });
    }
};

exports.updateCompany = async (req, res) => {
    const { company_name, location, industry } = req.body;
    try {
        if (req.user.role === 'Company') {
            const [company] = await pool.query('SELECT id FROM COMPANY WHERE user_id = ?', [req.user.id]);
            if (company.length === 0 || company[0].id != req.params.id) {
                return res.status(403).json({ message: 'Unauthorized to update this company' });
            }
        }
        
        await pool.query(
            'UPDATE COMPANY SET company_name=?, location=?, industry=? WHERE id=?',
            [company_name, location, industry, req.params.id]
        );
        res.status(200).json({ message: 'Company updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const [company] = await pool.query('SELECT user_id FROM COMPANY WHERE id = ?', [req.params.id]);
        if (company.length === 0) return res.status(404).json({ message: 'Company not found' });
        
        await pool.query('DELETE FROM USERS WHERE id = ?', [company[0].user_id]);
        res.status(200).json({ message: 'Company and related user account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error });
    }
};
