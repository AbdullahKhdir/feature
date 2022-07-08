'use strict';

const FileSystem = require('../../node/FileSystem');
const Path = require('../../node/Path');

/**
 * @class Db
 * @constructor Mysql2
 * @description Class Db is used to prepare suitable environment to execute queries
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Db {
    #mysql_core;
    constructor(mysql = require('mysql2')) {
        if (typeof this.mysql !== 'undefined') {
            return this.getDbInstance();
        }
        const pool = mysql.createPool(
            {
                host: 'localhost',
                user: 'root',
                database: 'node',
                password: 'root'
            }
        );
        this.#mysql_core = pool;
        this.mysql       = pool.promise();
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
     * @function getDbCoreInstance
     * @description returns an instance of the initiated core database object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {void}
     */
     getDbCoreInstance () {
        return this.#mysql_core;
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
        let directory_routes = _path.join(__dirname, '..', '..', 'database', 'migrations', 'sql');
        let methods_array = null;
        _file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            files.forEach((file) => {
                let is_file = file.isFile(); 
                if (is_file) {
                    const sql_migration_path = _path.join(
                        _path.dirname(__dirname, '..', 'core'),
                        'migrations',
                        'sql',
                        file.name
                    );
                    
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
}