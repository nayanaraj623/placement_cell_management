const pool = require('../config/db');

// Simple heuristic string matching for skills/dept and job description
const calculateEligibilityScore = (student, job) => {
    let score = 0;
    const maxScore = 100;

    // 1. CGPA criteria Check (50% weight)
    if (student.cgpa >= job.criteria_cgpa) {
        score += 50; 
        // Bonus for higher CGPA
        const diff = student.cgpa - job.criteria_cgpa;
        if (diff > 0) {
            score += Math.min(20, diff * 10); // up to 20 extra points
        }
    } else {
        // Penalty for lower CGPA
        score += Math.max(0, 50 - (job.criteria_cgpa - student.cgpa) * 20);
    }

    // 2. Keyword matching (30% weight)
    const skills = student.skills ? student.skills.toLowerCase() : '';
    const dept = student.dept ? student.dept.toLowerCase() : '';
    const desc = job.description ? job.description.toLowerCase() : '';
    const role = job.role ? job.role.toLowerCase() : '';

    let matchCount = 0;
    const targetWords = [...new Set([...desc.split(/[\s,]+/), ...role.split(/[\s,]+/)])].filter(w => w.length > 2);
    
    // Check if skills or dept are mentioned in job description
    targetWords.forEach(word => {
        if (skills.includes(word) || dept.includes(word)) {
            matchCount++;
        }
    });

    score += Math.min(30, matchCount * 5); // caps at 30 points

    return Math.min(maxScore, Math.round(score));
};

exports.applyForJob = async (req, res) => {
    try {
        let student_id = req.body.student_id;
        
        if (req.user.role === 'Student') {
            const [student] = await pool.query('SELECT id FROM STUDENT WHERE user_id = ?', [req.user.id]);
            if (student.length === 0) return res.status(403).json({ message: 'Student profile missing' });
            student_id = student[0].id;
        }

        const job_id = req.body.job_id;

        // Fetch student and job for AI scoring
        const [students] = await pool.query('SELECT * FROM STUDENT WHERE id = ?', [student_id]);
        const [jobs] = await pool.query('SELECT * FROM JOB WHERE id = ?', [job_id]);

        if (students.length === 0 || jobs.length === 0) {
            return res.status(404).json({ message: 'Student or Job not found' });
        }

        const score = calculateEligibilityScore(students[0], jobs[0]);
        const descStr = `AI Screening Score: ${score}/100`;

        await pool.query(
            'INSERT INTO PLACEMENTS (student_id, job_id, status, description) VALUES (?, ?, ?, ?)',
            [student_id, job_id, 'Applied', descStr]
        );

        res.status(201).json({ message: 'Applied successfully', ai_score: score });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already applied for this job' });
        }
        res.status(500).json({ message: 'Error applying for job', error });
    }
};

exports.getApplicantsForJob = async (req, res) => {
    try {
        const job_id = req.params.jobId;

        // Check if company owns this job
        if (req.user.role === 'Company') {
            const [company] = await pool.query('SELECT id FROM COMPANY WHERE user_id = ?', [req.user.id]);
            const [job] = await pool.query('SELECT company_id FROM JOB WHERE id = ?', [job_id]);
            if (company.length === 0 || job.length === 0 || company[0].id !== job[0].company_id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }

        const [applicants] = await pool.query(
            `SELECT p.*, s.name, s.dept, s.cgpa, s.email, s.skills 
             FROM PLACEMENTS p 
             JOIN STUDENT s ON p.student_id = s.id 
             WHERE p.job_id = ?`,
            [job_id]
        );
        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving applicants', error });
    }
};

exports.getStudentApplications = async (req, res) => {
    try {
        let student_id = req.params.studentId;
        
        if (req.user.role === 'Student') {
            const [student] = await pool.query('SELECT id FROM STUDENT WHERE user_id = ?', [req.user.id]);
            if (student.length === 0 || student[0].id != student_id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }

        const [applications] = await pool.query(
            `SELECT p.*, j.role, j.salary, c.company_name, c.location 
             FROM PLACEMENTS p 
             JOIN JOB j ON p.job_id = j.id 
             JOIN COMPANY c ON j.company_id = c.id 
             WHERE p.student_id = ?`,
            [student_id]
        );
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving applications', error });
    }
};

exports.updatePlacementStatus = async (req, res) => {
    const { status, description } = req.body;
    try {
        const placement_id = req.params.id;

        if (req.user.role === 'Company') {
            const [company] = await pool.query('SELECT id FROM COMPANY WHERE user_id = ?', [req.user.id]);
            const [placement] = await pool.query('SELECT j.company_id FROM PLACEMENTS p JOIN JOB j ON p.job_id = j.id WHERE p.id = ?', [placement_id]);
            
            if (company.length === 0 || placement.length === 0 || company[0].id !== placement[0].company_id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }

        await pool.query(
            'UPDATE PLACEMENTS SET status=?, description=? WHERE id=?',
            [status, description, placement_id]
        );
        res.status(200).json({ message: 'Placement status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating placement status', error });
    }
};

exports.getAllPlacements = async (req, res) => {
    try {
        const [placements] = await pool.query(
            `SELECT p.*, s.name as student_name, s.dept, s.cgpa, j.role as job_role, c.company_name 
             FROM PLACEMENTS p 
             JOIN STUDENT s ON p.student_id = s.id 
             JOIN JOB j ON p.job_id = j.id 
             JOIN COMPANY c ON j.company_id = c.id`
        );
        res.status(200).json(placements);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving placements', error });
    }
};
