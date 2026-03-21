const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            multipleStatements: true
        });
        const sql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        await connection.query(sql);
        console.log("Schema imported successfully!");
        process.exit(0);
    } catch(e) {
        console.error("Error setting up DB:", e.message);
        process.exit(1);
    }
}
run();
