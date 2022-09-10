'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var mysql2_1 = __importDefault(require("mysql2"));
var config = __importStar(require("../config"));
var ExpressMysqlSession_1 = __importDefault(require("../framework/ExpressMysqlSession"));
var Singleton_1 = require("../Singleton/Singleton");
module.exports = /** @class */ (function (_super) {
    __extends(Db, _super);
    function Db() {
        var _this_1 = _super.call(this) || this;
        _this_1.MysqlStore = _this_1.mysql_session;
        _this_1.mysql = mysql2_1.default;
        _this_1.__ = Singleton_1.Singleton.getLodash();
        _this_1.connection_configurations = {
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
        return _this_1;
    }
    Object.defineProperty(Db.prototype, "getMysqlInstance", {
        /**
         * @function getDbInstance
         * @description returns an instance of the initiated database object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @return {object}
         */
        get: function () {
            return this.mysql;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @function getDbClassInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    Db.getDbInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        return this.instance = new Db();
    };
    /**
     * @function readMigrations
     * @description
       reads all generated migrations and writes them to the db.
       For logger coloring see https://github.com/mochajs/mocha/blob/9e95d36e4b715380cef573014dec852bded3f8e1/lib/reporters/base.js#L48
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {void}
    */
    Db.prototype.readMigrations = function () {
        var _this_1 = this;
        var _path = Singleton_1.Singleton.getPath();
        var _file_system = Singleton_1.Singleton.getFileSystem();
        var directory_routes = _path.join(__dirname, '..', '..', '..', 'dist', 'core', 'database', 'migrations', 'sql');
        var _sql = "SHOW DATABASES LIKE '".concat(config.configurations().database, "';");
        var _create_sql = "CREATE DATABASE IF NOT EXISTS ".concat(config.configurations().database, ";");
        var _check_migrations = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '".concat(config.configurations().migration, "'");
        (function () { return __awaiter(_this_1, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.executeSql(_sql)
                            .then(function (rows) {
                            rows = rows[0];
                            if (rows) {
                                var _db = Object.values(rows[0])[0];
                                console.log('\u001b[' + 94 + 'm' + 'Database: "' + _db + '" is loading, please wait! ' + '\u001b[0m');
                                (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                    var _this_1 = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.executeSql(_check_migrations)
                                                    .then(function (rows) {
                                                    rows = rows[0];
                                                    if (_this_1.__.isEmpty(rows)) {
                                                        console.log('\r');
                                                        console.log('\u001b[' + 31 + 'm' + 'Table Migration: "' + config.configurations().migration + '" does not exist!' + '\u001b[0m');
                                                        var readline = require('readline');
                                                        var prompt_user_1 = readline.createInterface({
                                                            input: process.stdin,
                                                            output: process.stdout
                                                        });
                                                        var _question = '\u001b[' + 33 + 'm' + 'Would you like to create the table "' + config.configurations().migration + '"? (Y / N)  ' + '\u001b[0m';
                                                        console.log('\r');
                                                        prompt_user_1.question(_question, function (answer) {
                                                            if (_this_1.__.isEmpty(answer) || _this_1.__.isEqual(answer, 'Y') || _this_1.__.isEqual(answer, 'y')) {
                                                                console.log('\r');
                                                                console.log('\u001b[' + 21 + 'm' + 'Creating db_migration table ' + config.configurations().migration + ', please wait!' + '\u001b[0m');
                                                                (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                    var _this_1 = this;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0: return [4 /*yield*/, this.executeSql("CREATE TABLE IF NOT EXISTS " + config.configurations().database + "." + config.configurations().migration + " (" +
                                                                                    "id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                                                                    "migrations_file_name VARCHAR(255) NOT NULL," +
                                                                                    "migrations_sql LONGTEXT NOT NULL," +
                                                                                    "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
                                                                                    .then(function (rows) {
                                                                                    rows = rows[0];
                                                                                    if (rows) {
                                                                                        console.log('\r');
                                                                                        setTimeout(function () {
                                                                                            _file_system.readdir(directory_routes, { withFileTypes: true }, function (err, files) {
                                                                                                if (err) {
                                                                                                    return console.log('Unable to scan directory: ' + err);
                                                                                                }
                                                                                                files.map(function (file) {
                                                                                                    var is_file = file.isFile();
                                                                                                    if (is_file) {
                                                                                                        var migrations_name_1 = file.name.toString().substr(0, file.name.toString().length - 4);
                                                                                                        var sql_migration_path = directory_routes + '/' + file.name;
                                                                                                        var sql_content_1 = _file_system.readFileSync(sql_migration_path).toString();
                                                                                                        (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                                                            var _this_1 = this;
                                                                                                            return __generator(this, function (_a) {
                                                                                                                switch (_a.label) {
                                                                                                                    case 0: return [4 /*yield*/, this.executeSql("SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='".concat(migrations_name_1, "' LIMIT 1;"))
                                                                                                                            .then(function (rows) {
                                                                                                                            rows = rows[0];
                                                                                                                            if (_this_1.__.isEmpty(rows)) {
                                                                                                                                (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                                                                                    var _this_1 = this;
                                                                                                                                    return __generator(this, function (_a) {
                                                                                                                                        switch (_a.label) {
                                                                                                                                            case 0: return [4 /*yield*/, this.executeSql(sql_content_1)
                                                                                                                                                    .then(function () {
                                                                                                                                                    (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                                                                                                        return __generator(this, function (_a) {
                                                                                                                                                            switch (_a.label) {
                                                                                                                                                                case 0: return [4 /*yield*/, this.executeSql("INSERT INTO ".concat(config.configurations().database, ".").concat(config.configurations().migration, " (migrations_file_name, migrations_sql) VALUES (\"").concat(migrations_name_1, "\", \"").concat(this.mysql.escape(sql_content_1), "\");"))
                                                                                                                                                                        .then(function (rows) {
                                                                                                                                                                        rows = rows[0];
                                                                                                                                                                        if (rows) {
                                                                                                                                                                            console.log('\r');
                                                                                                                                                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfully written in the database' + '\u001b[0m');
                                                                                                                                                                            console.log('\u001b[' + 93 + 'm' + '\u221A' + '\u221A' + ' Migration: "' + file.name + '" has been read successfully ' + '\u221A' + '\u221A' + '\u001b[0m');
                                                                                                                                                                        }
                                                                                                                                                                    })
                                                                                                                                                                        .catch(function (err) {
                                                                                                                                                                        console.log('\r');
                                                                                                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:' + migrations_name_1 + ' in the database! ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                                                                                    })];
                                                                                                                                                                case 1:
                                                                                                                                                                    _a.sent();
                                                                                                                                                                    return [2 /*return*/];
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }); })();
                                                                                                                                                })
                                                                                                                                                    .catch(function (err) {
                                                                                                                                                    if (err) {
                                                                                                                                                        console.log('\r');
                                                                                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name_1 + ' ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                                                                        process.exit(0);
                                                                                                                                                    }
                                                                                                                                                })];
                                                                                                                                            case 1:
                                                                                                                                                _a.sent();
                                                                                                                                                return [2 /*return*/];
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }); })();
                                                                                                                            }
                                                                                                                        })
                                                                                                                            .catch(function (err) {
                                                                                                                            console.log('\r');
                                                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "' + migrations_name_1.toString() + '".' + '\u001b[0m');
                                                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                                            process.exit(0);
                                                                                                                        })];
                                                                                                                    case 1:
                                                                                                                        _a.sent();
                                                                                                                        return [2 /*return*/];
                                                                                                                }
                                                                                                            });
                                                                                                        }); })();
                                                                                                    }
                                                                                                });
                                                                                            });
                                                                                        }, 3000);
                                                                                    }
                                                                                })
                                                                                    .catch(function (err) {
                                                                                    console.log('\r');
                                                                                    console.log('\u001b[' + 31 + 'm' + 'Table Migration: "' + config.configurations().migration + '" could not be created!' + '\u001b[0m');
                                                                                    console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                    process.exit(0);
                                                                                })];
                                                                            case 1:
                                                                                _a.sent();
                                                                                return [2 /*return*/];
                                                                        }
                                                                    });
                                                                }); })();
                                                            }
                                                            else {
                                                                prompt_user_1.close();
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        console.log('\r');
                                                        console.log('\u001b[' + 94 + 'm' + 'Table Migration: "' + config.configurations().migration + '" is loading, please wait! ' + '\u001b[0m');
                                                        setTimeout(function () {
                                                            _file_system.readdir(directory_routes, { withFileTypes: true }, function (err, files) {
                                                                if (err) {
                                                                    return console.log('Unable to scan directory: ' + err);
                                                                }
                                                                files.map(function (file) {
                                                                    var is_file = file.isFile();
                                                                    if (is_file) {
                                                                        var migrations_name_2 = file.name.toString().substr(0, file.name.toString().length - 4);
                                                                        var sql_migration_path_1 = directory_routes + '/' + file.name;
                                                                        var sql_content_2 = _file_system.readFileSync(sql_migration_path_1).toString();
                                                                        (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                            var _this_1 = this;
                                                                            return __generator(this, function (_a) {
                                                                                switch (_a.label) {
                                                                                    case 0: return [4 /*yield*/, this.executeSql("SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='".concat(migrations_name_2, "' LIMIT 1;"))
                                                                                            .then(function (rows) {
                                                                                            rows = rows[0];
                                                                                            if (_this_1.__.isEmpty(rows)) {
                                                                                                (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                                                    var _this_1 = this;
                                                                                                    return __generator(this, function (_a) {
                                                                                                        switch (_a.label) {
                                                                                                            case 0: return [4 /*yield*/, this.executeSql(sql_content_2)
                                                                                                                    .then(function () {
                                                                                                                    (function () { return __awaiter(_this_1, void 0, void 0, function () {
                                                                                                                        return __generator(this, function (_a) {
                                                                                                                            switch (_a.label) {
                                                                                                                                case 0: return [4 /*yield*/, this.executeSql("INSERT INTO ".concat(config.configurations().database, ".").concat(config.configurations().migration, " (migrations_file_name, migrations_sql) VALUES (\"").concat(migrations_name_2, "\", \"").concat(this.mysql.escape(sql_content_2), "\");"))
                                                                                                                                        .then(function (rows) {
                                                                                                                                        rows = rows[0];
                                                                                                                                        if (rows) {
                                                                                                                                            console.log('\r');
                                                                                                                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file.name + ' is successfully written in the database' + '\u001b[0m');
                                                                                                                                            console.log('\u001b[' + 93 + 'm' + '\u221A' + '\u221A' + ' Migration: "' + file.name + '" has been read successfully ' + '\u221A' + '\u221A' + '\u001b[0m');
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                        .catch(function (err) {
                                                                                                                                        console.log('\r');
                                                                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:' + migrations_name_2 + ' in the database! ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                                                    })];
                                                                                                                                case 1:
                                                                                                                                    _a.sent();
                                                                                                                                    return [2 /*return*/];
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }); })();
                                                                                                                })
                                                                                                                    .catch(function (err) {
                                                                                                                    if (err) {
                                                                                                                        console.log('\r');
                                                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name_2 + ' ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                                        process.exit(0);
                                                                                                                    }
                                                                                                                })];
                                                                                                            case 1:
                                                                                                                _a.sent();
                                                                                                                return [2 /*return*/];
                                                                                                        }
                                                                                                    });
                                                                                                }); })();
                                                                                            }
                                                                                            else {
                                                                                                console.log('\r');
                                                                                                console.log('\u001b[' + 95 + 'm' + '\u00D7' + '\u00D7' + ' Migration file : ' + sql_migration_path_1 + ' has been already inserted ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                            }
                                                                                        })
                                                                                            .catch(function (err) {
                                                                                            console.log('\r');
                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "' + migrations_name_2.toString() + '".' + '\u001b[0m');
                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                            process.exit(0);
                                                                                        })];
                                                                                    case 1:
                                                                                        _a.sent();
                                                                                        return [2 /*return*/];
                                                                                }
                                                                            });
                                                                        }); })();
                                                                    }
                                                                });
                                                            });
                                                        }, 3000);
                                                    }
                                                })
                                                    .catch(function (err) {
                                                    console.log('\r');
                                                    console.log('\u001b[' + 31 + 'm' + 'Table Migration: "' + config.configurations().migration + '" does not exist!' + '\u001b[0m');
                                                    console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                    process.exit(0);
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })();
                            }
                        })
                            .catch(function (err) {
                            if (err) {
                                console.log('\u001b[' + 31 + 'm' + 'Database: "' + config.configurations().database + '" does not exist!' + '\u001b[0m');
                                console.log('\r');
                                var readline = require('readline');
                                var prompt_user_2 = readline.createInterface({
                                    input: process.stdin,
                                    output: process.stdout
                                });
                                var _question = '\u001b[' + 33 + 'm' + 'Would you like to create the database "' + config.configurations().database + '"? (Y / N)  ' + '\u001b[0m';
                                prompt_user_2.question(_question, function (answer) {
                                    if (_this_1.__.isEmpty(answer) || _this_1.__.isEqual(answer, 'Y') || _this_1.__.isEqual(answer, 'y')) {
                                        console.log('\r');
                                        console.log('\u001b[' + 21 + 'm' + 'Creating database ' + config.configurations().database + ', please wait!' + '\u001b[0m');
                                        var _mysql = require('mysql2');
                                        var con = _mysql.createConnection({
                                            host: config.configurations().host,
                                            user: config.configurations().user,
                                            password: config.configurations().password,
                                            // ON Linux and MAC OS
                                            socketPath: config.configurations().os !== 'WINDOWS' ? '/tmp/mysql.sock' : ''
                                        });
                                        con.connect(function (err) {
                                            if (err) {
                                                console.log('\r');
                                                console.log('\u001b[' + 41 + 'm' + 'Connection could not be established!' + '\u001b[0m');
                                                console.log('\u001b[' + 41 + 'm' + 'Database could not be created!' + '\u001b[0m');
                                                prompt_user_2.close();
                                            }
                                            else {
                                                console.log('\u001b[' + 21 + 'm' + 'connecting... ' + '\u001b[0m');
                                                con.query(_create_sql, function (err, result) {
                                                    if (err) {
                                                        console.log('\r');
                                                        console.log('\u001b[' + 41 + 'm' + 'Database: "' + config.configurations().database + '" could not be created!' + '\u001b[0m');
                                                        console.log('\u001b[' + 41 + 'm' + 'Please check the connection!' + '\u001b[0m');
                                                        prompt_user_2.close();
                                                    }
                                                    else {
                                                        console.log('\r');
                                                        console.log('\u001b[' + 92 + 'm' + 'Database "' + config.configurations().database + '" is successfully created! ' + '\u001b[0m');
                                                        console.log('\r');
                                                        prompt_user_2.close();
                                                        con.end();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        prompt_user_2.close();
                                    }
                                });
                                return prompt_user_2.on('close', function () {
                                    return _this_1.executeSql(_check_migrations)
                                        .then(function (rows) {
                                        rows = rows[0];
                                        if (_this_1.__.isEmpty(rows)) {
                                            console.log('\r');
                                            console.log('\u001b[' + 31 + 'm' + 'Table Migration: "' + config.configurations().migration + '" does not exist!' + '\u001b[0m');
                                            var readline_1 = require('readline');
                                            var prompt_user_3 = readline_1.createInterface({
                                                input: process.stdin,
                                                output: process.stdout
                                            });
                                            var _question_1 = '\u001b[' + 33 + 'm' + 'Would you like to create the table "' + config.configurations().migration + '"? (Y / N)  ' + '\u001b[0m';
                                            console.log('\r');
                                            return prompt_user_3.question(_question_1, function (answer) {
                                                if (_this_1.__.isEmpty(answer) || _this_1.__.isEqual(answer, 'Y') || _this_1.__.isEqual(answer, 'y')) {
                                                    console.log('\r');
                                                    console.log('\u001b[' + 21 + 'm' + 'Creating db_migration table ' + config.configurations().migration + ', please wait!' + '\u001b[0m');
                                                    return _this_1.executeSql("CREATE TABLE IF NOT EXISTS " + config.configurations().database + "." + config.configurations().migration + " (" +
                                                        "id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                                                        "migrations_file_name VARCHAR(255) NOT NULL," +
                                                        "migrations_sql LONGTEXT NOT NULL," +
                                                        "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
                                                        .then(function (rows) {
                                                        rows = rows[0];
                                                        if (rows) {
                                                            console.log('\r');
                                                            return _file_system.readdir(directory_routes, { withFileTypes: true }, function (err, files) {
                                                                if (err) {
                                                                    return console.log('Unable to scan directory: ' + err);
                                                                }
                                                                // Todo: test behavior
                                                                // if (typeof promises_identifier === 'undefined') {
                                                                if (typeof promises_identifier === 'undefined') {
                                                                    var promises_identifier = {};
                                                                }
                                                                setTimeout(function () {
                                                                    files.map(function (file) {
                                                                        var file_name = file.name;
                                                                        var sql_migration_path = directory_routes + '/' + file_name;
                                                                        var sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                                                        promises_identifier[file_name] = sql_content;
                                                                    });
                                                                    promises_identifier['onExit'] = true;
                                                                    return _helper(promises_identifier, _this_1);
                                                                    function _helper(promises_identifier, _this) {
                                                                        if (Object.keys(promises_identifier).length >= 0 && Object.keys(promises_identifier)[0] !== 'onExit') {
                                                                            var _loop_1 = function (key) {
                                                                                if (Object.hasOwnProperty.call(promises_identifier, key)) {
                                                                                    var file_name_1 = key;
                                                                                    var migrations_name_3 = file_name_1.toString().substr(0, file_name_1.toString().length - 4);
                                                                                    var sql_content_3 = promises_identifier[key];
                                                                                    return { value: _this.executeSql("SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='".concat(migrations_name_3, "' LIMIT 1;"))
                                                                                            .then(function (rows) {
                                                                                            rows = rows[0];
                                                                                            if (_this.__.isEmpty(rows)) {
                                                                                                return true;
                                                                                            }
                                                                                        })
                                                                                            .then(function (is_empty) {
                                                                                            if (is_empty) {
                                                                                                _this.executeSql(sql_content_3)
                                                                                                    .then(function () {
                                                                                                    _this.executeSql("INSERT INTO ".concat(config.configurations().database, ".").concat(config.configurations().migration, " (migrations_file_name, migrations_sql) VALUES (\"").concat(migrations_name_3, "\", \"").concat(_this.mysql.escape(sql_content_3), "\");"))
                                                                                                        .then(function (rows) {
                                                                                                        rows = rows[0];
                                                                                                        if (rows) {
                                                                                                            console.log('\r');
                                                                                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file_name_1 + ' is successfully written in the database' + '\u001b[0m');
                                                                                                            console.log('\u001b[' + 93 + 'm' + '\u221A' + '\u221A' + ' Migration: "' + file_name_1 + '" has been read successfully ' + '\u221A' + '\u221A' + '\u001b[0m');
                                                                                                            return true;
                                                                                                        }
                                                                                                        return false;
                                                                                                    })
                                                                                                        .then(function (is_success) {
                                                                                                        if (is_success) {
                                                                                                            if (Object.keys(promises_identifier).length > 0) {
                                                                                                                delete promises_identifier[Object.keys(promises_identifier)[0]];
                                                                                                                setTimeout(function () {
                                                                                                                    return _helper(promises_identifier, _this);
                                                                                                                }, 500);
                                                                                                            }
                                                                                                        }
                                                                                                        else {
                                                                                                            process.exit(0);
                                                                                                        }
                                                                                                    })
                                                                                                        .catch(function (err) {
                                                                                                        console.log('\r');
                                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:' + migrations_name_3 + ' in the database! ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                        return false;
                                                                                                    });
                                                                                                })
                                                                                                    .catch(function (err) {
                                                                                                    if (err) {
                                                                                                        console.log('\r');
                                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name_3 + ' ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                                        process.exit(0);
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        })
                                                                                            .catch(function (err) {
                                                                                            console.log('\r');
                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "' + migrations_name_3.toString() + '".' + '\u001b[0m');
                                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                            process.exit(0);
                                                                                        }) };
                                                                                }
                                                                            };
                                                                            for (var key in promises_identifier) {
                                                                                var state_1 = _loop_1(key);
                                                                                if (typeof state_1 === "object")
                                                                                    return state_1.value;
                                                                            }
                                                                        }
                                                                        else {
                                                                            process.exit(0);
                                                                        }
                                                                    }
                                                                }, 2000);
                                                            });
                                                        }
                                                    })
                                                        .catch(function (err) {
                                                        console.log('\r');
                                                        console.log('\u001b[' + 31 + 'm' + 'Table Migration: "' + config.configurations().migration + '" could not be created!' + '\u001b[0m');
                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                        process.exit(0);
                                                    });
                                                }
                                                else {
                                                    process.exit(0);
                                                }
                                            });
                                        }
                                        else {
                                            console.log('\r');
                                            console.log('\u001b[' + 94 + 'm' + 'Table Migration: "' + config.configurations().migration + '" is loading, please wait! ' + '\u001b[0m');
                                            setTimeout(function () {
                                                _file_system.readdir(directory_routes, { withFileTypes: true }, function (err, files) {
                                                    if (err) {
                                                        return console.log('Unable to scan directory: ' + err);
                                                    }
                                                    //Todo: second checkpoint to test
                                                    // if (typeof promises_identifier === 'undefined') {
                                                    if (typeof promises_identifier === 'undefined') {
                                                        var promises_identifier = {};
                                                    }
                                                    files.map(function (file) {
                                                        var file_name = file.name;
                                                        var sql_migration_path = directory_routes + '/' + file_name;
                                                        var sql_content = _file_system.readFileSync(sql_migration_path).toString();
                                                        promises_identifier[file_name] = sql_content;
                                                    });
                                                    return _helper(promises_identifier, _this_1);
                                                    function _helper(promises_identifier, _this) {
                                                        if (Object.keys(promises_identifier).length >= 0) {
                                                            var _loop_2 = function (key) {
                                                                if (Object.hasOwnProperty.call(promises_identifier, key)) {
                                                                    var file_name_2 = key;
                                                                    var migrations_name_4 = file_name_2.toString().substr(0, file_name_2.toString().length - 4);
                                                                    var sql_content_4 = promises_identifier[key];
                                                                    return { value: _this.executeSql("SELECT migrations_file_name FROM node.tbl_db_migrations where migrations_file_name='".concat(migrations_name_4, "' LIMIT 1;"))
                                                                            .then(function (rows) {
                                                                            rows = rows[0];
                                                                            if (_this.__.isEmpty(rows)) {
                                                                                return true;
                                                                            }
                                                                        })
                                                                            .then(function (is_empty) {
                                                                            if (is_empty) {
                                                                                _this.executeSql(sql_content_4)
                                                                                    .then(function () {
                                                                                    _this.executeSql("INSERT INTO ".concat(config.configurations().database, ".").concat(config.configurations().migration, " (migrations_file_name, migrations_sql) VALUES (\"").concat(migrations_name_4, "\", \"").concat(_this.mysql.escape(sql_content_4), "\");"))
                                                                                        .then(function (rows) {
                                                                                        rows = rows[0];
                                                                                        if (rows) {
                                                                                            console.log('\r');
                                                                                            console.log('\u001b[' + 92 + 'm' + 'SQL-FIle ' + file_name_2 + ' is successfully written in the database' + '\u001b[0m');
                                                                                            console.log('\u001b[' + 93 + 'm' + '\u221A' + '\u221A' + ' Migration: "' + file_name_2 + '" has been read successfully ' + '\u221A' + '\u221A' + '\u001b[0m');
                                                                                            return true;
                                                                                        }
                                                                                    })
                                                                                        .then(function (is_success) {
                                                                                        if (is_success) {
                                                                                            if (Object.keys(promises_identifier).length > 0) {
                                                                                                delete promises_identifier[Object.keys(promises_identifier)[0]];
                                                                                                return _helper(promises_identifier, _this);
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                        .catch(function (err) {
                                                                                        console.log('\r');
                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while inserting the migration file:' + migrations_name_4 + ' in the database! ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                        return false;
                                                                                    });
                                                                                })
                                                                                    .catch(function (err) {
                                                                                    if (err) {
                                                                                        console.log('\r');
                                                                                        console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' + ' Error occurred while reading the sql file: ' + migrations_name_4 + ' ' + '\u00D7' + '\u00D7' + '\u001b[0m');
                                                                                        console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                                        process.exit(0);
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                            .catch(function (err) {
                                                                            console.log('\r');
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error checking migration: "' + migrations_name_4.toString() + '".' + '\u001b[0m');
                                                                            console.log('\u001b[' + 31 + 'm' + 'Error: "' + err + '". ' + '\u001b[0m');
                                                                            process.exit(0);
                                                                        }) };
                                                                }
                                                            };
                                                            for (var key in promises_identifier) {
                                                                var state_2 = _loop_2(key);
                                                                if (typeof state_2 === "object")
                                                                    return state_2.value;
                                                            }
                                                        }
                                                    }
                                                });
                                            }, 3000);
                                        }
                                    })
                                        .catch(function (err) {
                                        console.log('\r');
                                        console.log('\u001b[' + 30 + 'm' + 'Process exiting...' + '\u001b[0m');
                                        process.exit(0);
                                    });
                                });
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    /**
     * @function establishConnection
     * @description Creates the database connection object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns pool
    */
    Db.prototype.establishConnection = function () {
        var connection = this.mysql.createPool(this.connection_configurations);
        return connection.promise();
    };
    /**
     * @function initiateSession
     * @description Initiates the database store object for caching
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns mysql store
    */
    Db.prototype.initiateSession = function () {
        var constants = Singleton_1.Singleton.getConstants();
        var options = {
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
        return new this.MysqlStore(options, this.establishConnection());
    };
    /**
     * @async
     * @function executeModelQuery
     * @description Executes model's query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    Db.prototype.executeModelQuery = function (sql, arr) {
        if (arr === void 0) { arr = []; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query(sql, arr)];
            });
        });
    };
    /**
     * @async
     * @function executeSql
     * @description Executes a sql
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    Db.prototype.executeSql = function (sql, arr) {
        if (arr === void 0) { arr = []; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query(sql, arr)];
            });
        });
    };
    /**
     * @async
     * @function executeQuery
     * @description Executes a random query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    Db.prototype.executeQuery = function (sql, arr) {
        if (arr === void 0) { arr = []; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query(sql, arr)];
            });
        });
    };
    /**
     * @async
     * @protected
     * @function query
     * @description prepare query for execution
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns promise
    */
    Db.prototype.query = function (sql, arr) {
        if (arr === void 0) { arr = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, (function () { return __awaiter(_this_1, void 0, void 0, function () {
                        var mysql_connection;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    mysql_connection = this.establishConnection();
                                    return [4 /*yield*/, mysql_connection.query(sql, arr).then(function (result) {
                                            mysql_connection.end();
                                            return result;
                                        })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })()];
            });
        });
    };
    /**
     * @function validateTable
     * @description Validates a table in the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns promise
    */
    Db.prototype.validateTable = function (table) {
        var _this_1 = this;
        return (function () { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.describeTable(table)];
                    case 1: return [2 /*return*/, !!(_a.sent())];
                }
            });
        }); })();
    };
    /**
     * @function describeTable
     * @description Descripes a table in the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns promise
    */
    Db.prototype.describeTable = function (table) {
        var _this_1 = this;
        return (function () { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.executeModelQuery("DESC ".concat(table, ";"))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); })();
    };
    return Db;
}(ExpressMysqlSession_1.default));
