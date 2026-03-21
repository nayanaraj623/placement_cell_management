const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        const [rows] = await pool.query("SELECT 1+1 AS result");
        console.log("DB_SUCCESS:", rows[0].result);
        process.exit(0);
    } catch (e) {
        console.error("DB_ERROR:", e.message);
        process.exit(1);
    }
}
test();
