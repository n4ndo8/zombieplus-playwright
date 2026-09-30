require('dotenv').config()

const { Pool } = require('pg')

const DbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

export async function executeSQL(sqlScript) {
    const pool = new Pool(DbConfig)
    try {
        const result = await pool.query(sqlScript)
        return result.rows
    } finally {
        await pool.end()
    }
}
