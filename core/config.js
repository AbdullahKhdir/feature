const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    host:            process.env.HOST,
    port:            process.env.DB_PORT,
    user:            process.env.TEST_USERNAME ?? process.env.PRODUCTION_USERNAME ?? process.env.DEVELOPMENT_USERNAME,
    password:        process.env.TEST_PASSWORD ?? process.env.PRODUCTION_PASSWORD ?? process.env.DEVELOPMENT_PASSWORD,
    database:        process.env.DATABASE,
    connectionLimit: process.env.CONNECTION_LIMIT,
    environment:     process.env.NODE_ENV,
    server_port:     process.env.PORT,
    migration:       process.env.MIGRATION
};