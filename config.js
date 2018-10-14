module.exports = {
    db: {
        database: process.env.DB_NAME || 'billboard_db',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'root'
    }
}