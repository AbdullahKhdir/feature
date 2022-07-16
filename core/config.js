const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    host:            process.env.HOST,
    port:            process.env.DB_PORT,
    user:            process.env.USER,
    database:        process.env.DATABASE,
    password:        process.env.PASSWORD,
    connectionLimit: process.env.CONNECTION_LIMIT,
    environment:     process.env.NODE_ENV
};