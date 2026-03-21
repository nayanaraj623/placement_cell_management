const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('Seeding database...');
  try {
    const hashedPass = await bcrypt.hash('password123', 10);

    // 1. Ensure Roles exist
    await pool.query("INSERT IGNORE INTO ROLES (role_name) VALUES ('Admin'), ('Student'), ('Company')");

    // 2. Fetch Role IDs
    const [roles] = await pool.query("SELECT * FROM ROLES");
    const roleMap = {};
    roles.forEach(r => roleMap[r.role_name] = r.id);

    // 3. Create Admin
    try {
        await pool.query(
            "INSERT INTO USERS (username, password_hash, role_id) VALUES (?, ?, ?)",
            ['admin', hashedPass, roleMap['Admin']]
        );
        console.log('Admin user created (admin / password123)');
    } catch(e) { if(e.code !== 'ER_DUP_ENTRY') throw e; }

    // 4. Create Company
    try {
        const [compUser] = await pool.query(
            "INSERT INTO USERS (username, password_hash, role_id) VALUES (?, ?, ?)",
            ['google', hashedPass, roleMap['Company']]
        );
        await pool.query(
            "INSERT INTO COMPANY (user_id, company_name, location, industry) VALUES (?, ?, ?, ?)",
            [compUser.insertId, 'Google', 'Mountain View', 'Technology']
        );
        console.log('Company user created (google / password123)');
    } catch(e) { if(e.code !== 'ER_DUP_ENTRY') throw e; }

    // 5. Create Student
    try {
        const [stuUser] = await pool.query(
            "INSERT INTO USERS (username, password_hash, role_id) VALUES (?, ?, ?)",
            ['student1', hashedPass, roleMap['Student']]
        );
        await pool.query(
            "INSERT INTO STUDENT (user_id, name, dept, cgpa, email, skills) VALUES (?, ?, ?, ?, ?, ?)",
            [stuUser.insertId, 'John Doe', 'Computer Science', 8.5, 'john@example.com', 'React, Node, MySQL']
        );
        console.log('Student user created (student1 / password123)');
    } catch(e) { if(e.code !== 'ER_DUP_ENTRY') throw e; }

    // 6. Create Job (if not exists)
    try {
        const [companies] = await pool.query("SELECT id FROM COMPANY WHERE company_name = 'Google'");
        if(companies.length > 0) {
            await pool.query(
                "INSERT INTO JOB (company_id, role, description, salary, vacancy, criteria_cgpa) VALUES (?, ?, ?, ?, ?, ?)",
                [companies[0].id, 'Frontend Engineer', 'Looking for React experts.', 120000, 3, 8.0]
            );
            console.log('Sample Job created.');
        }
    } catch(e) { console.error(e.message); }

    console.log('Seeding complete. You can now login with the created accounts.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
