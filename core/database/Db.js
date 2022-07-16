'use strict';

const {host, port, user, database, password, connectionLimit} = require('../config');
const Constants           = require('../../app/utils/Constants');
const ExpressMysqlSession = require('../framework/ExpressMysqlSession');
const FileSystem          = require('../node/FileSystem');
const Path                = require('../node/Path');
const mysql               = require('mysql2');

/**
 * @class Db
 * @constructor Mysql2
 * @description Class Db is used to prepare suitable environment to execute queries
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Db extends ExpressMysqlSession {
    
    constructor() {
        const _mysql_session = super().mysql_session;
        this.MysqlStore = _mysql_session;
        this.mysql      = mysql;
    }

    /**
     * @function getDbInstance
     * @description returns an instance of the initiated database object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {void}
     */
    getDbInstance () {
        return this.mysql;
    }

     /**
     * @function readMigrations
     * @description  
       reads all generated migrations and writes them to the db.
       For logger coloring see https://github.com/mochajs/mocha/blob/9e95d36e4b715380cef573014dec852bded3f8e1/lib/reporters/base.js#L48
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {void}
     */
    readMigrations() {
        let _path        = Object.assign(new Path().path);
        let _file_system = Object.assign(new FileSystem().fs);
        let directory_routes = _path.join(__dirname, '..', '..', 'core', 'database', 'migrations', 'sql');
        _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            files.forEach((file) => {
                let is_file = file.isFile(); 
                if (is_file) {
                    const sql_migration_path = directory_routes + '/' + file.name;                    
                    let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                    console.log('\u001b[' + 36 + 'm' + 'Reading SQL-FIle ' + file.name + '\u001b[0m');
                    let query = this.mysql.execute(sql_content)
                        .then(() => {
                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfuly writen in the database' + '\u001b[0m');
                        })
                        .catch(err, function() {
                            if (err) {
                                console.log(
                                    '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error accoured while reading the sql file: ' + err + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                );
                                process.exit(1);
                            }
                        })
                        .finally(function(err) {
                            if (!err) {
                                console.log(
                                    '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration has been read successfuly ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                );
                            }
                        });
                }
            });
        });
    }

    async executeModelQuery(sql, arr = []) {
        return (async () => {
            let connection = this.mysql.createPool(
                {
                    host,
                    port,
                    user,
                    database,
                    password,
                    connectionLimit
                }
            );
            let mysql_connection = connection.promise();
        
            const constants       = Object.assign(new Constants().getConstants());
            const session_options = {
                // Host name for database connection:
                host,
                // Port number for database connection:
                port,
                // Database user:
                user,
                // Password for the above database user:
                password,
                // Database name:
                database,
                // Whether or not to automatically check for and clear expired sessions:
                clearExpired: constants.SESSION.DB_CONNECTION_SESSION_CLEAR_EXPIRED,
                // How frequently expired sessions will be cleared; milliseconds:
                checkExpirationInterval: constants.SESSION.DB_CONNECTION_SESSION_EXPIRATION_INTERVAL,
                // The maximum age of a valid session; milliseconds:
                expiration: constants.SESSION.DB_CONNECTION_SESSION_TIME_OUT,
                // Whether or not to create the sessions database table, if one does not already exist:
                createDatabaseTable: constants.SESSION.DB_CONNECTION_CREATE_SESSION_TABLE_IF_NOT_EXISTS,
                // Number of connections when creating a connection pool:
                connectionLimit: constants.SESSION.DB_SESSION_MAX_CONNECTIONS,
                // Whether or not to end the database connection when the store is closed.
                // The default value of this option depends on whether or not a connection was passed to the constructor.
                // If a connection object is passed to the constructor, the default value for this option is false.
                endConnectionOnClose: constants.SESSION.DB_SESSION_END_CONNECTION_ON_CLOSE,
                charset: constants.SESSION.DB_CONNECTION_SESSION_CHARSET,
                schema: {
                    tableName: constants.SESSION.DB_SESSION_TABLE,
                    columnNames: {
                        session_id: constants.SESSION.DB_CONNECTION_SESSION_ID,
                        expires: constants.SESSION.DB_CONNECTION_SESSION_EXPIRATION,
                        data: constants.SESSION.DB_CONNECTION_SESSION_DATA
                    }
                }
            };
            this.db_session       = new this.MysqlStore({session_options}, mysql_connection);
        
            return await mysql_connection.query(sql, arr).then(result => {
                mysql_connection.end();
                return result;
            });
        })();
    }
}