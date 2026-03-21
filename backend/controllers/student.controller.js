const pool = require('../config/db');

// Get all students (Admin)
exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await pool.query('SELECT s.*, u.username FROM STUDENT s JOIN USERS u ON s.user_id = u.id');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students', error });
    }
};

// Get single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const [student] = await pool.query('SELECT s.*, u.username FROM STUDENT s JOIN USERS u ON s.user_id = u.id WHERE s.id = ?', [req.params.id]);
        if (student.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving student', error });
    }
};

// Update student profile (Admin or the Student themselves)
exports.updateStudent = async (req, res) => {
    const { name, dept, cgpa, email, skills } = req.body;
    try {
        // If student, can only update their own profile
        if (req.user.role === 'Student') {
            const [student] = await pool.query('SELECT id FROM STUDENT WHERE user_id = ?', [req.user.id]);
            if (student.length === 0 || student[0].id != req.params.id) {
                return res.status(403).json({ message: 'Unauthorized to update this profile' });
            }
        }
        
        await pool.query(
            'UPDATE STUDENT SET name=?, dept=?, cgpa=?, email=?, skills=? WHERE id=?',
            [name, dept, cgpa, email, skills, req.params.id]
        );
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
};

// Delete student (Admin only)
exports.deleteStudent = async (req, res) => {
    try {
        // Find user_id first to delete from USERS table (cascade will handle STUDENT delete)
        const [student] = await pool.query('SELECT user_id FROM STUDENT WHERE id = ?', [req.params.id]);
        if (student.length === 0) return res.status(404).json({ message: 'Student not found' });
        
        await pool.query('DELETE FROM USERS WHERE id = ?', [student[0].user_id]);
        res.status(200).json({ message: 'Student and related user account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
};
