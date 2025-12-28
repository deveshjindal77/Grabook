const mysql = require('mysql2');
// Load environment variables from .env file if it exists
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'ecommerce',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '07022003'
});

connection.connect(function (err) {
    if(err){
        console.error('❌ Database connection failed!');
        console.error('Error:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1); // Exit if database connection fails
    }
    else{
        console.log('✅ Database connection established successfully!');
        console.log('📊 Database:', process.env.DB_NAME || 'ecommerce');
        console.log('🖥️  Host:', process.env.DB_HOST || 'localhost');
        console.log('🔌 Port:', process.env.DB_PORT || 3306);
        console.log('👤 User:', process.env.DB_USER || 'root');
        
        // Test the connection with a simple query
        connection.query('SELECT 1 as test', function (queryErr, results) {
            if (queryErr) {
                console.error('⚠️  Database connection test query failed:', queryErr.message);
            } else {
                console.log('✅ Database connection verified - ready to accept queries');
            }
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
    }
});

module.exports = connection;

 