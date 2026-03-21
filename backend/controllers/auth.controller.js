const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role_name, ...profileData } = req.body;
    
    try {
        // Find role_id
        const [roles] = await pool.query('SELECT id FROM ROLES WHERE role_name = ?', [role_name]);
        if (roles.length === 0) return res.status(400).json({ message: 'Invalid role' });
        
        const role_id = roles[0].id;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            const [userResult] = await connection.query(
                'INSERT INTO USERS (username, password_hash, role_id) VALUES (?, ?, ?)',
                [username, hashedPassword, role_id]
            );
            const userId = userResult.insertId;
            
            if (role_name === 'Student') {
                await connection.query(
                    'INSERT INTO STUDENT (user_id, name, dept, cgpa, email) VALUES (?, ?, ?, ?, ?)',
                    [userId, profileData.name, profileData.dept, profileData.cgpa, profileData.email]
                );
            } else if (role_name === 'Company') {
                await connection.query(
                    'INSERT INTO COMPANY (user_id, company_name, location, industry) VALUES (?, ?, ?, ?)',
                    [userId, profileData.company_name, profileData.location, profileData.industry]
                );
            }
            
            await connection.commit();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await pool.query(
            `SELECT u.*, r.role_name 
             FROM USERS u 
             JOIN ROLES r ON u.role_id = r.id 
             WHERE u.username = ?`, 
            [username]
        );
        
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const user = users[0];
        
        const passwordIsValid = await bcrypt.compare(password, user.password_hash);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: 86400 } // 24 hours
        );
        
        let profileDetails = null;
        if (user.role_name === 'Student') {
            const [student] = await pool.query('SELECT * FROM STUDENT WHERE user_id = ?', [user.id]);
            profileDetails = student[0];
        } else if (user.role_name === 'Company') {
            const [company] = await pool.query('SELECT * FROM COMPANY WHERE user_id = ?', [user.id]);
            profileDetails = company[0];
        } else if (user.role_name === 'Admin') {
            profileDetails = { name: 'Admin User' };
        }
        
        res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role_name,
            accessToken: token,
            profile: profileDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
