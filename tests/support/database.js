const {Pool} = require ('pg')

const DbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'zombieplus',
    password: 'pwd123',
    port: 5432
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
