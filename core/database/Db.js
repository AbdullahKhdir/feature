'use strict';

const {host, port, user, database, password, connectionLimit} = require('../config');
const Constants           = require('../../app/utils/Constants');
const ExpressMysqlSession = require('../framework/ExpressMysqlSession');
const FileSystem          = require('../node/FileSystem');
const Path                = require('../node/Path');
const mysql               = require('mysql2');
const Lodash              = require('../../app/utils/Lodash');

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
        this._          = new Lodash()._;
        this.connection_configurations = {
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
            // Number of connections when creating a connection pool:
            connectionLimit
        };
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
        let _path            = Object.assign(new Path().path);
        let _file_system     = Object.assign(new FileSystem().fs);
        let directory_routes = _path.join(__dirname, '..', '..', 'core', 'database', 'migrations', 'sql');

        const _sql           = `SHOW DATABASES LIKE '${database}';`;
        const _create_sql    = `CREATE DATABASE IF NOT EXISTS ${database};`;
        
        return (async () => {
            return await this.executeSql(_sql)
            .then(([rows, fields]) => {
                if (rows) {
                    const _db = Object.values(rows[0])[0];
                    console.log('\u001b[' + 94 + 'm' + 'Database: "' + _db + '" is loading, please wait! ' + '\u001b[0m');
                    console.log('\r');
                    setTimeout(() => {
                        _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
                            if (err) {
                                return console.log('Unable to scan directory: ' + err);
                            } 
                            files.forEach((file) => {
                                let is_file = file.isFile(); 
                                if (is_file) {
                                    const sql_migration_path = directory_routes + '/' + file.name;                    
                                    let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                    return (async () => {
                                        return await this.executeSql(sql_content)
                                        .then(() => {
                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfully written in the database' + '\u001b[0m');
                                        })
                                        .catch(err, () => {
                                            if (err) {
                                                console.log(
                                                    '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + err + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                );
                                                process.exit(0);
                                            }
                                        })
                                        .finally((err) => {
                                            if (!err) {
                                                console.log(
                                                    '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration: "'+ file.name +'" has been read successfully ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                                );
                                            }
                                        });
                                    })()
                                }
                            });
                        });
                    }, 3000);
                }
            })
            .catch((err) => {
                if (err) {
                    console.log('\u001b[' + 31 + 'm' + 'Database: "' + database.toString() + '" does not exist!' + '\u001b[0m');
                    console.log('\r');
                    const readline = require('readline');
                    const prompt_user = readline.createInterface({
                        input:  process.stdin,
                        output: process.stdout
                    });
                    const _question = '\u001b[' + 33 + 'm' + 'Would you like to create the database "' + database.toString() + '"? (Y / N)  ' + '\u001b[0m';
                    prompt_user.question(_question, (answer) => {
                        if (this._.isEmpty(answer) || this._.isEqual(answer, 'Y') || this._.isEqual(answer, 'y')) {
                            console.log('\r');
                            console.log('\u001b[' + 21 + 'm' + 'Creating database '+ database.toString() +', please wait!' + '\u001b[0m');
                            var _mysql = require('mysql');
                            var con = _mysql.createConnection({
                                host,
                                user,
                                password
                            });
                            con.connect((err) => {
                                if (err) {
                                    console.log(err)
                                    console.log('\r');
                                    console.log('\u001b[' + 41 + 'm' + 'Connection could not be established!' + '\u001b[0m');
                                    console.log('\u001b[' + 41 + 'm' + 'Database could not be created!' + '\u001b[0m');
                                    prompt_user.close();
                                } else {
                                    console.log('\u001b[' + 21 + 'm' + 'connecting... ' + '\u001b[0m');
                                    con.query(_create_sql, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            console.log('\r');
                                            console.log('\u001b[' + 41 + 'm' + 'Database: "' + database.toString() + '" could not be created!' + '\u001b[0m');
                                            console.log('\u001b[' + 41 + 'm' + 'Please check the connection!' + '\u001b[0m');
                                            prompt_user.close();
                                        } else {
                                            console.log('\r');
                                            console.log('\u001b[' + 92 + 'm' + 'Database "' + database.toString() + '" is successfully created! ' + '\u001b[0m');
                                            console.log('\r');
                                            prompt_user.close();
                                            con.end();
                                        }
                                    });
                                }
                            });                         
                        } else {
                            prompt_user.close();
                        }
                    });
                    prompt_user.on('close', () => {
                        setTimeout(() => {
                            _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
                                if (err) {
                                    return console.log('Unable to scan directory: ' + err);
                                } 
                                files.forEach((file) => {
                                    let is_file = file.isFile(); 
                                    if (is_file) {
                                        const sql_migration_path = directory_routes + '/' + file.name;                    
                                        let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                        return (async () => {
                                            return await this.executeSql(sql_content)
                                            .then(() => {
                                                console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfully written in the database' + '\u001b[0m');
                                            })
                                            .catch(err, () => {
                                                if (err) {
                                                    console.log(
                                                        '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + err + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                    );
                                                    process.exit(0);
                                                }
                                            })
                                            .finally((err) => {
                                                if (!err) {
                                                    console.log(
                                                        '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration: "'+ file.name +'" has been read successfully ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                                    );
                                                }
                                            });
                                        })()
                                    }
                                });
                            });
                        }, 3000);
                    });
                }
            });
        })();
    }

    establishConnection () {
        let connection = this.mysql.createPool(this.connection_configurations);
        return connection.promise();
    }

    initiateSession() {
        const constants       = Object.assign(new Constants().getConstants());
        const options = {
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
        }
        return new this.MysqlStore(options, this.establishConnection());
    }

    async executeModelQuery(sql, arr = []) {
        return this.#query(sql, arr);
    }

    async executeSql (sql, arr = []) {
        return this.#query(sql, arr);
    }

    async executeQuery (sql, arr = []) {
        return this.#query(sql, arr);
    }

    async #query(sql, arr = []) {
        return (async () => {
            let mysql_connection = this.establishConnection();
        
            return await mysql_connection.query(sql, arr).then(result => {
                mysql_connection.end();
                return result;
            });
        })();
    } 
}