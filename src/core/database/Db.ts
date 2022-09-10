'use strict';

import mysql from 'mysql2';
import * as config from '../config';
import ExpressMysqlSession from '../framework/ExpressMysqlSession';
import { Singleton } from '../Singleton/Singleton';


/**
 * @class Db
 * @constructor Mysql2
 * @description Class Db is used to prepare suitable environment to execute queries
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Db extends ExpressMysqlSession{
    
    private connection_configurations : any;
    private mysql: typeof mysql;
    private static instance: Db;
    protected MysqlStore;
    protected readonly __;
    private constructor() {
        super();
        this.MysqlStore      = this.mysql_session;
        this.mysql           = mysql;
        this.__              = Singleton.getLodash();
        this.connection_configurations = {
            // Host name for database connection:
            host: config.configurations().host,
            // Port number for database connection:
            port: config.configurations().port,
            // Database user:
            user: config.configurations().user,
            // Password for the above database user:
            password: config.configurations().password,
            // Database name:
            database: config.configurations().database,
            // Number of connections when creating a connection pool:
            connectionLimit: config.configurations().connectionLimit,
            // ON Linux and MAC OS
            socketPath: config.configurations().os !== 'WINDOWS' ? '/tmp/mysql.sock' : ''
        };
    }

    /**
     * @function getDbInstance
     * @description returns an instance of the initiated database object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {object}
     */
    get getMysqlInstance() : typeof mysql{
        return this.mysql;
    }

    /**
     * @function getDbClassInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    static getDbInstance () : Db {
        if (this.instance) {
            return this.instance;
        }
        return this.instance = new Db();
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
        let _path            = Singleton.getPath();
        let _file_system     = Singleton.getFileSystem();
        let directory_routes = _path.join(__dirname, '..', '..', '..', 'dist', 'core', 'database', 'migrations', 'sql');
        
        const _sql              = `SHOW DATABASES LIKE '${config.configurations().database}';`;
        const _create_sql       = `CREATE DATABASE IF NOT EXISTS ${config.configurations().database};`;
        const _check_migrations = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${config.configurations().migration}'`;
        
        (async () => {
            await this.executeSql(_sql)
            .then((rows: any) => {
                rows = rows[0];
                if (rows) {
                    const _db = Object.values(rows[0])[0];
                    console.log('\u001b[' + 94 + 'm' + 'Database: "' + _db + '" is loading, please wait! ' + '\u001b[0m');
                    (async () => {
                        await this.executeSql(_check_migrations)
                        .then((rows: any) => {
                            rows = rows[0];
                            if (this.__.isEmpty(rows)) {
                                console.log('\r');
                                console.log('\u001b[' + 31 + 'm' + 'Table Migration: "'+ config.configurations().migration +'" does not exist!' + '\u001b[0m');
                                const readline = require('readline');
                                const prompt_user = readline.createInterface({
                                    input:  process.stdin,
                                    output: process.stdout
                                });
                                const _question = '\u001b[' + 33 + 'm' + 'Would you like to create the table "' + config.configurations().migration + '"? (Y / N)  ' + '\u001b[0m';
                                console.log('\r');
                                prompt_user.question(_question, (answer: any) => {
                                    if (this.__.isEmpty(answer) || this.__.isEqual(answer, 'Y') || this.__.isEqual(answer, 'y')) {
                                        console.log('\r');
                                        console.log('\u001b[' + 21 + 'm' + 'Creating db_migration table '+ config.configurations().migration +', please wait!' + '\u001b[0m');
                                        (async () => {
                                            await this.executeSql(
                                                "CREATE TABLE IF NOT EXISTS "+config.configurations().database+"."+config.configurations().migration+" ("+
                                                "id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,"+
                                                "migrations_file_name VARCHAR(255) NOT NULL,"+
                                                "migrations_sql LONGTEXT NOT NULL,"+
                                                "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ) ENGINE=InnoDB DEFAULT CHARSET=utf8;"
                                            )
                                            .then((rows: any) => {
                                                rows = rows[0];
                                                if (rows) {
                                                    console.log('\r');
                                                    setTimeout(() => {
                                                        _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
                                                            if (err) {
                                                                return console.log('Unable to scan directory: ' + err);
                                                            } 
                                                            files.map((file) => {
                                                                let is_file = file.isFile(); 
                                                                if (is_file) {
                                                                    const migrations_name = file.name.toString().substr(0,file.name.toString().length - 4);
                                                                    const sql_migration_path = directory_routes + '/' + file.name;                    
                                                                    let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                                                    (async () => {
                                                                        await this.executeSql(
                                                                            `SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='${migrations_name}' LIMIT 1;`
                                                                        )
                                                                        .then((rows: any) => {
                                                                            rows = rows[0];
                                                                            if (this.__.isEmpty(rows)) {
                                                                                (async () => {
                                                                                    await this.executeSql(sql_content)
                                                                                    .then(() => {
                                                                                        (async () => {
                                                                                            await this.executeSql(
                                                                                                `INSERT INTO ${config.configurations().database}.${config.configurations().migration} (migrations_file_name, migrations_sql) VALUES ("${migrations_name}", "${this.mysql.escape(sql_content)}");`
                                                                                            )
                                                                                            .then((rows: any) => {
                                                                                                rows = rows[0];
                                                                                                if (rows) {
                                                                                                    console.log('\r');
                                                                                                    console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfully written in the database' + '\u001b[0m');
                                                                                                    console.log(
                                                                                                        '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration: "'+ file.name +'" has been read successfully ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                                                                                    );
                                                                                                }
                                                                                            })
                                                                                            .catch((err) => {
                                                                                                console.log('\r');
                                                                                                console.log(
                                                                                                    '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:'+ migrations_name +' in the database! ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                                                );
                                                                                                console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');                                                                                                                            
                                                                                            })
                                                                                        })();
                                                                                    })
                                                                                    .catch((err) => {
                                                                                        if (err) {
                                                                                            console.log('\r');
                                                                                            console.log(
                                                                                                '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                                            );
                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                                                            process.exit(0);
                                                                                        }
                                                                                    })
                                                                                })()
                                                                            }
                                                                        })
                                                                        .catch(err => {
                                                                            console.log('\r');
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "'+ migrations_name.toString() +'".' + '\u001b[0m');
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                                            process.exit(0);
                                                                        });
                                                                    })();                                                                    
                                                                }
                                                            });
                                                        });
                                                    }, 3000);
                                                }
                                            })
                                            .catch(err => {
                                                console.log('\r');
                                                console.log('\u001b[' + 31 + 'm' + 'Table Migration: "'+ config.configurations().migration +'" could not be created!' + '\u001b[0m');
                                                console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                process.exit(0);
                                            });
                                        })();
                                    } else {
                                        prompt_user.close();
                                    }
                                });
                            } else {
                                console.log('\r');
                                console.log('\u001b[' + 94 + 'm' + 'Table Migration: "' + config.configurations().migration + '" is loading, please wait! ' + '\u001b[0m');
                                setTimeout(() => {
                                    _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
                                        if (err) {
                                            return console.log('Unable to scan directory: ' + err);
                                        } 
                                        files.map((file) => {
                                            let is_file = file.isFile(); 
                                            if (is_file) {
                                                const migrations_name = file.name.toString().substr(0, file.name.toString().length - 4);
                                                const sql_migration_path = directory_routes + '/' + file.name;                    
                                                let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                                (async () => {
                                                    await this.executeSql(
                                                        `SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='${migrations_name}' LIMIT 1;`
                                                    )
                                                    .then((rows: any) => {
                                                        rows = rows[0];
                                                        if (this.__.isEmpty(rows)) {
                                                            (async () => {
                                                                await this.executeSql(sql_content)
                                                                .then(() => {
                                                                    (async () => {
                                                                        await this.executeSql(
                                                                            `INSERT INTO ${config.configurations().database}.${config.configurations().migration} (migrations_file_name, migrations_sql) VALUES ("${migrations_name}", "${this.mysql.escape(sql_content)}");`
                                                                        )
                                                                        .then((rows: any) => {
                                                                            rows = rows[0];
                                                                            if (rows) {
                                                                                console.log('\r');
                                                                                console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfully written in the database' + '\u001b[0m');
                                                                                console.log(
                                                                                    '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration: "'+ file.name +'" has been read successfully ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                                                                );
                                                                            }
                                                                        })
                                                                        .catch((err) => {
                                                                            console.log('\r');
                                                                            console.log(
                                                                                '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:'+ migrations_name +' in the database! ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                            );
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');                                                                                                                            
                                                                        })
                                                                    })();
                                                                })
                                                                .catch((err) => {
                                                                    if (err) {
                                                                        console.log('\r');
                                                                        console.log(
                                                                            '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                        );
                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                                        process.exit(0);
                                                                    }
                                                                });
                                                            })()
                                                        } else {
                                                            console.log('\r');
                                                            console.log(
                                                                '\u001b[' + 95 + 'm' + '\u00D7' + '\u00D7' + ' Migration file : ' + sql_migration_path + ' has been already inserted ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                            );
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log('\r');
                                                        console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "'+ migrations_name.toString() +'".' + '\u001b[0m');
                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                        process.exit(0);
                                                    });
                                                })();
                                            }
                                        });
                                    });
                                }, 3000);
                            }
                        })
                        .catch((err) => {
                            console.log('\r');
                            console.log('\u001b[' + 31 + 'm' + 'Table Migration: "'+ config.configurations().migration +'" does not exist!' + '\u001b[0m');
                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                            process.exit(0);
                        });
                    })();
                }
            })
            .catch((err) => {
                if (err) {
                    console.log('\u001b[' + 31 + 'm' + 'Database: "' + config.configurations().database + '" does not exist!' + '\u001b[0m');
                    console.log('\r');
                    const readline = require('readline');
                    const prompt_user = readline.createInterface({
                        input:  process.stdin,
                        output: process.stdout
                    });
                    const _question = '\u001b[' + 33 + 'm' + 'Would you like to create the database "' + config.configurations().database + '"? (Y / N)  ' + '\u001b[0m';
                    prompt_user.question(_question, (answer: any) => {
                        if (this.__.isEmpty(answer) || this.__.isEqual(answer, 'Y') || this.__.isEqual(answer, 'y')) {
                            console.log('\r');
                            console.log('\u001b[' + 21 + 'm' + 'Creating database '+ config.configurations().database +', please wait!' + '\u001b[0m');
                            var _mysql = require('mysql2');
                            var con = _mysql.createConnection({
                                host: config.configurations().host,
                                user: config.configurations().user,
                                password: config.configurations().password,
                                // ON Linux and MAC OS
                                socketPath: config.configurations().os !== 'WINDOWS' ? '/tmp/mysql.sock' : ''
                            });
                            con.connect((err: any) => {
                                if (err) {
                                    console.log('\r');
                                    console.log('\u001b[' + 41 + 'm' + 'Connection could not be established!' + '\u001b[0m');
                                    console.log('\u001b[' + 41 + 'm' + 'Database could not be created!' + '\u001b[0m');
                                    prompt_user.close();
                                } else {
                                    console.log('\u001b[' + 21 + 'm' + 'connecting... ' + '\u001b[0m');
                                    con.query(_create_sql, (err: any, result: any) => {
                                        if (err) {
                                            console.log('\r');
                                            console.log('\u001b[' + 41 + 'm' + 'Database: "' + config.configurations().database + '" could not be created!' + '\u001b[0m');
                                            console.log('\u001b[' + 41 + 'm' + 'Please check the connection!' + '\u001b[0m');
                                            prompt_user.close();
                                        } else {
                                            console.log('\r');
                                            console.log('\u001b[' + 92 + 'm' + 'Database "' + config.configurations().database + '" is successfully created! ' + '\u001b[0m');
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
                    return prompt_user.on('close', () => {
                        return this.executeSql(_check_migrations)
                        .then((rows: any) => {
                            rows = rows[0];
                            if (this.__.isEmpty(rows)) {
                                console.log('\r');
                                console.log('\u001b[' + 31 + 'm' + 'Table Migration: "'+ config.configurations().migration +'" does not exist!' + '\u001b[0m');
                                const readline = require('readline');
                                const prompt_user = readline.createInterface({
                                    input:  process.stdin,
                                    output: process.stdout
                                });
                                const _question = '\u001b[' + 33 + 'm' + 'Would you like to create the table "' + config.configurations().migration + '"? (Y / N)  ' + '\u001b[0m';
                                console.log('\r');
                                return prompt_user.question(_question, (answer: any) => {
                                    if (this.__.isEmpty(answer) || this.__.isEqual(answer, 'Y') || this.__.isEqual(answer, 'y')) {
                                        console.log('\r');
                                        console.log('\u001b[' + 21 + 'm' + 'Creating db_migration table '+ config.configurations().migration +', please wait!' + '\u001b[0m');
                                        return this.executeSql(
                                            "CREATE TABLE IF NOT EXISTS "+config.configurations().database+"."+config.configurations().migration+" ("+
                                            "id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,"+
                                            "migrations_file_name VARCHAR(255) NOT NULL,"+
                                            "migrations_sql LONGTEXT NOT NULL,"+
                                            "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ) ENGINE=InnoDB DEFAULT CHARSET=utf8;"
                                        )
                                        .then((rows: any) => {
                                            rows = rows[0];
                                            if (rows) {
                                                console.log('\r');
                                                return _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
                                                    if (err) {
                                                        return console.log('Unable to scan directory: ' + err);
                                                    }
                                                    // Todo: test behavior
                                                    // if (typeof promises_identifier === 'undefined') {
                                                    if (typeof promises_identifier! === 'undefined') {
                                                        var promises_identifier : any= {};
                                                    }
                                                    setTimeout(() => {
                                                        files.map(file => {
                                                            const file_name = file.name;
                                                            const sql_migration_path = directory_routes + '/' + file_name;                    
                                                            let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                                            promises_identifier[file_name] = sql_content;
                                                        });
                                                        promises_identifier['onExit'] = true;
    
                                                        return _helper(promises_identifier, this);
                                                        function _helper(promises_identifier: any, _this: any) {
                                                            if (Object.keys(promises_identifier).length >= 0 && Object.keys(promises_identifier)[0] !== 'onExit') {
                                                                for (const key in promises_identifier) {
                                                                    if (Object.hasOwnProperty.call(promises_identifier, key)) {
                                                                        const file_name = key;
                                                                        const migrations_name = file_name.toString().substr(0, file_name.toString().length - 4);
                                                                        const sql_content = promises_identifier[key];
                                                                        return _this.executeSql(
                                                                            `SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='${migrations_name}' LIMIT 1;`
                                                                        )
                                                                        .then((rows: any) => {
                                                                            rows = rows[0];
                                                                            if (_this.__.isEmpty(rows)) {
                                                                                return true
                                                                            }
                                                                        })
                                                                        .then((is_empty: any) => {
                                                                            if (is_empty) {
                                                                                _this.executeSql(sql_content)
                                                                                .then(() => {
                                                                                    _this.executeSql(
                                                                                        `INSERT INTO ${config.configurations().database}.${config.configurations().migration} (migrations_file_name, migrations_sql) VALUES ("${migrations_name}", "${_this.mysql.escape(sql_content)}");`
                                                                                    )
                                                                                    .then((rows: any) => {
                                                                                        rows = rows[0];
                                                                                        if (rows) {
                                                                                            console.log('\r');
                                                                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file_name + ' is successfully written in the database' + '\u001b[0m');
                                                                                            console.log(
                                                                                                '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration: "'+ file_name +'" has been read successfully ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                                                                            );
                                                                                            return true;
                                                                                        }
                                                                                        return false;
                                                                                    })
                                                                                    .then((is_success: any) => {
                                                                                        if (is_success) {
                                                                                            if (Object.keys(promises_identifier).length > 0) {
                                                                                                delete promises_identifier[Object.keys(promises_identifier)[0]];
                                                                                                setTimeout(() => {
                                                                                                    return _helper(promises_identifier, _this)
                                                                                                }, 500);
                                                                                            }
                                                                                        } else {
                                                                                            process.exit(0);
                                                                                        }
                                                                                    })
                                                                                    .catch((err: any) => {
                                                                                        console.log('\r');
                                                                                        console.log(
                                                                                            '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:'+ migrations_name +' in the database! ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                                        );
                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');            
                                                                                        return false;                                                                                                                
                                                                                    })
                                                                                })
                                                                                .catch((err: any) => {
                                                                                    if (err) {
                                                                                        console.log('\r');
                                                                                        console.log(
                                                                                            '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                                        );
                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                                                        process.exit(0);
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                        .catch((err: any) => {
                                                                            console.log('\r');
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "'+ migrations_name.toString() +'".' + '\u001b[0m');
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                                            process.exit(0);
                                                                        })
                                                                    }
                                                                }
                                                            } else {
                                                                process.exit(0);
                                                            }
                                                        }
                                                    }, 2000);
                                                });
                                            }
                                        })
                                        .catch(err => {
                                            console.log('\r');
                                            console.log('\u001b[' + 31 + 'm' + 'Table Migration: "'+ config.configurations().migration +'" could not be created!' + '\u001b[0m');
                                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                            process.exit(0);
                                        });
                                    } else {
                                        process.exit(0);
                                    }
                                });
                            } else {
                                console.log('\r');
                                console.log('\u001b[' + 94 + 'm' + 'Table Migration: "' + config.configurations().migration + '" is loading, please wait! ' + '\u001b[0m');
                                setTimeout(() => {
                                    _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
                                        if (err) {
                                            return console.log('Unable to scan directory: ' + err);
                                        } 
                                        //Todo: second checkpoint to test
                                        // if (typeof promises_identifier === 'undefined') {
                                        if (typeof promises_identifier! === 'undefined') {
                                            var promises_identifier : any = {};
                                        }
                                        files.map(file => {
                                            const file_name = file.name;
                                            const sql_migration_path = directory_routes + '/' + file_name;                    
                                            let sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                            promises_identifier[file_name] = sql_content;
                                        });
                                        
                                        return _helper(promises_identifier, this);
                                        function _helper(promises_identifier: any, _this: any) {
                                            if (Object.keys(promises_identifier).length >= 0) {
                                                for (const key in promises_identifier) {
                                                    if (Object.hasOwnProperty.call(promises_identifier, key)) {
                                                        const file_name = key;
                                                        const migrations_name = file_name.toString().substr(0, file_name.toString().length - 4);
                                                        const sql_content = promises_identifier[key];
                                                        return _this.executeSql(
                                                            `SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='${migrations_name}' LIMIT 1;`
                                                        )
                                                        .then((rows: any) => {
                                                            rows = rows[0];
                                                            if (_this.__.isEmpty(rows)) {
                                                                return true
                                                            }
                                                        })
                                                        .then((is_empty: any) => {
                                                            if (is_empty) {
                                                                _this.executeSql(sql_content)
                                                                .then(() => {
                                                                    _this.executeSql(
                                                                        `INSERT INTO ${config.configurations().database}.${config.configurations().migration} (migrations_file_name, migrations_sql) VALUES ("${migrations_name}", "${_this.mysql.escape(sql_content)}");`
                                                                    )
                                                                    .then((rows: any) => {
                                                                        rows = rows[0];
                                                                        if (rows) {
                                                                            console.log('\r');
                                                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file_name + ' is successfully written in the database' + '\u001b[0m');
                                                                            console.log(
                                                                                '\u001b[' + 93 + 'm' + '\u221A' + '\u221A' +  ' Migration: "'+ file_name +'" has been read successfully ' + '\u221A' + '\u221A' +  '\u001b[0m'
                                                                            );
                                                                            return true;
                                                                        }
                                                                    })
                                                                    .then((is_success: any) => {
                                                                        if (is_success) {
                                                                            if (Object.keys(promises_identifier).length > 0) {
                                                                                delete promises_identifier[Object.keys(promises_identifier)[0]];
                                                                                return _helper(promises_identifier, _this)
                                                                            }
                                                                        }
                                                                    })
                                                                    .catch((err: any) => {
                                                                        console.log('\r');
                                                                        console.log(
                                                                            '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:'+ migrations_name +' in the database! ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                        );
                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');            
                                                                        return false;                                                                                                                
                                                                    })
                                                                })
                                                                .catch((err: any) => {
                                                                    if (err) {
                                                                        console.log('\r');
                                                                        console.log(
                                                                            '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name + ' ' +'\u00D7' + '\u00D7' + '\u001b[0m'
                                                                        );
                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                                        process.exit(0);
                                                                    }
                                                                })
                                                            }
                                                        })
                                                        .catch((err: any) => {
                                                            console.log('\r');
                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "'+ migrations_name.toString() +'".' + '\u001b[0m');
                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "'+ err +'". ' + '\u001b[0m');
                                                            process.exit(0);
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }, 3000);
                            }
                        })
                        .catch((err) => {
                            console.log('\r');
                            console.log('\u001b[' + 30 + 'm' + 'Process exiting...' + '\u001b[0m');
                            process.exit(0);
                        });
                    });
                }
            });
        })();
    }

    /**
     * @function establishConnection
     * @description Creates the database connection object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns pool
    */
    establishConnection () {
        let connection = this.mysql.createPool(this.connection_configurations);
        return connection.promise();
    }

    /**
     * @function initiateSession
     * @description Initiates the database store object for caching 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns mysql store
    */
    initiateSession() {
        const constants       = Singleton.getConstants();
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

    /**
     * @async
     * @function executeModelQuery
     * @description Executes model's query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    async executeModelQuery(sql: any, arr: any = []) {
        return this.query(sql, arr);
    }

    /**
     * @async
     * @function executeSql
     * @description Executes a sql
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    async executeSql (sql: any, arr = []) {
        return this.query(sql, arr);
    }

    /**
     * @async
     * @function executeQuery
     * @description Executes a random query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    async executeQuery (sql: any, arr = []) {
        return this.query(sql, arr);
    }

    /**
     * @async
     * @protected
     * @function query
     * @description prepare query for execution
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    protected async query(sql: any, arr = []) {
        return (async () => {
            let mysql_connection = this.establishConnection();
            return await mysql_connection.query(sql, arr).then(result => {
                mysql_connection.end();
                return result;
            });
        })();
    }

    /**
     * @function validateTable
     * @description Validates a table in the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns promise
    */
    validateTable(table: any) {
        return (async () => {
            return !!await this.describeTable(table);
        })()
    }

    /**
     * @function describeTable
     * @description Descripes a table in the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns promise
    */
    describeTable(table: any) {
        return (async () => {
            return await this.executeModelQuery(`DESC ${table};`);
        })()
    }
}