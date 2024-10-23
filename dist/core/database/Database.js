"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var _a;
var mysql2_1 = __importDefault(require("mysql2"));
var promise_1 = __importDefault(require("mysql2/promise"));
var config = __importStar(require("../config"));
var ExpressSequelizeSession_1 = __importDefault(require("../framework/ExpressSequelizeSession"));
var Singleton_1 = require("../Singleton/Singleton");
var sequelize_1 = require("sequelize");
var readline_1 = __importDefault(require("readline"));
module.exports = (_a = /** @class */ (function (_super) {
        __extends(Database, _super);
        function Database() {
            var _this = _super.call(this) || this;
            _this.constants = Singleton_1.Singleton.getConstants();
            _this._ = Singleton_1.Singleton.getLodash();
            _this.mysql2 = promise_1.default;
            _this.poolObject = _this.mysql2.createPool(_this._.pickBy({
                host: config.configurations().host,
                port: config.configurations().port,
                user: config.configurations().user,
                password: config.configurations().password,
                database: config.configurations().database,
                connectionLimit: config.configurations().connectionLimit
                // socketPath: config.configurations().os !== "WINDOWS" ? "/tmp/mysql.sock" : ""
            }));
            Database.instanceCount++; // Increment the count when an instance is created
            return _this;
        }
        Object.defineProperty(Database.prototype, "pool", {
            /**
             * @description initilizes and returns connection object
             * @return {Promise<PoolConnection>}
             */
            get: function () {
                return this.poolObject;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Database.prototype, "getMysqlInstance", {
            /**
             * @description Returns an instance of the initiated database object
             * @return {typeof mysql2}
             */
            get: function () {
                return this.mysql2;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @function getInstanceCount
         * @description Returns how many instances are currently initiated.
         * @returns {number}
         */
        Database.getInstanceCount = function () {
            return Database.instanceCount;
        };
        /**
         * @function getDbInstance
         * @description Inits or returns the Db instance
         * @returns {Database}
         */
        Database.getDbInstance = function () {
            if (this.instance) {
                return this.instance;
            }
            return (this.instance = new Database());
        };
        Object.defineProperty(Database.prototype, "getMysqlStore", {
            /**
             * @function getMysqlStore
             * @description Returns MySQL store for session management
             * @returns {session.Store}
             */
            get: function () {
                return this.mysqlStore;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @function establishConnectionWithoutDb
         * @description Establishes a connection without selecting any specific database, allowing us to check if the database exists first.
         * @returns {mysql.Pool}
         */
        Database.prototype.establishConnectionWithoutDb = function () {
            var pool = this.mysql2.createPool(this._.pickBy({
                host: config.configurations().host,
                port: config.configurations().port,
                user: config.configurations().user,
                password: config.configurations().password,
                connectionLimit: config.configurations().connectionLimit
                //? cat /etc/mysql/my.cnf
                //? cat /tmp/mysql.sock
                //? cat /run/mysqld/mysqld.sock
                // socketPath: config.configurations().os !== "WINDOWS" ? "/run/mysqld/mysqld.sock" : ""
            }));
            return pool;
        };
        /**
         * @function initiateSession
         * @description Initiates the database store object for caching sessions
         * @returns {session.Store}
         */
        Database.prototype.initiateSession = function () {
            this.mysqlStore = new this.mysqlSession(__assign({ db: new sequelize_1.Sequelize(config.configurations().database, config.configurations().user, config.configurations().password, {
                    host: config.configurations().host,
                    dialect: config.configurations().dialect,
                    logging: config.configurations().logging,
                    dialectModule: mysql2_1.default // For Sequelize
                }) }, {
                clearExpired: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_CLEAR_EXPIRED,
                checkExpirationInterval: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_EXPIRATION_INTERVAL,
                expiration: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_TIME_OUT,
                createDatabaseTable: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_CREATE_SESSION_TABLE_IF_NOT_EXISTS,
                connectionLimit: Singleton_1.Singleton.getConstants().SESSION.DB_SESSION_MAX_CONNECTIONS,
                endConnectionOnClose: Singleton_1.Singleton.getConstants().SESSION.DB_SESSION_END_CONNECTION_ON_CLOSE,
                charset: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_CHARSET,
                schema: {
                    tableName: Singleton_1.Singleton.getConstants().SESSION.DB_SESSION_TABLE,
                    columnNames: {
                        session_id: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_ID,
                        expires: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_EXPIRATION,
                        data: Singleton_1.Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_DATA
                    }
                }
            }));
            this.mysqlStore.sync();
            return this.mysqlStore;
        };
        /**
         * @async
         * @function query
         * @description Executes an SQL query with parameters
         * @param {string} sql - SQL query string
         * @param {any[]} arr - Array of parameters
         * @returns {Promise<[T, FieldPacket[]]>}
         */
        Database.prototype.query = function (sql, arr) {
            if (arr === void 0) { arr = []; }
            return __awaiter(this, void 0, void 0, function () {
                var connection, _a, result, fields, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.pool.getConnection()];
                        case 1:
                            connection = _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, 5, 6]);
                            return [4 /*yield*/, connection.query(sql, arr)];
                        case 3:
                            _a = _b.sent(), result = _a[0], fields = _a[1];
                            if (this._.isArray(result) && this._.isArray(result[0])) {
                                //? Return the first result set if it's a multi-result query
                                return [2 /*return*/, [result[0], fields]];
                            }
                            else {
                                return [2 /*return*/, [result, fields]];
                            }
                            return [3 /*break*/, 6];
                        case 4:
                            error_1 = _b.sent();
                            throw SQLException("SQLException: ".concat(error_1));
                        case 5:
                            connection.release();
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function readMigrations
         * @description Reads all generated migrations and writes them to the database
         * @returns {Promise<any>}
         */
        Database.prototype.readMigrations = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, fileSystem, directoryRoutes, dbName, migrationTable, sqlCheckDatabase, createDatabaseSql, checkMigrationsTableSql, colorLog, handleError, promptUserForDatabaseCreation, processMigrations, pool, connection, rows, dbPool, dbConnection, migrationRows, createMigrationTable, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = Singleton_1.Singleton.getPath();
                            fileSystem = Singleton_1.Singleton.getFileSystem();
                            directoryRoutes = path.join(__dirname, "..", "..", "..", "dist", "core", "database", "migrations", "sql");
                            dbName = config.configurations().database;
                            migrationTable = config.configurations().migration;
                            sqlCheckDatabase = "SHOW DATABASES LIKE '".concat(dbName, "';");
                            createDatabaseSql = "CREATE DATABASE IF NOT EXISTS ".concat(dbName, ";");
                            checkMigrationsTableSql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '".concat(migrationTable, "' AND TABLE_SCHEMA = '").concat(dbName, "';");
                            colorLog = function (colorCode, message) {
                                console.log("\u001B[".concat(colorCode, "m").concat(message, "\u001B[0m"));
                            };
                            handleError = function (message, error) {
                                colorLog(31, "".concat(message));
                                colorLog(31, "Error: ".concat(error));
                                process.exit(1); // Exit with an error code
                            };
                            promptUserForDatabaseCreation = function (connection) { return __awaiter(_this, void 0, void 0, function () {
                                var promptUser, question;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    promptUser = readline_1.default.createInterface({
                                        input: process.stdin,
                                        output: process.stdout
                                    });
                                    question = "\u001B[33mWould you like to create the database \"".concat(dbName, "\"? (Y / N)  \u001B[0m");
                                    return [2 /*return*/, new Promise(function (resolve, reject) {
                                            promptUser.question(question, function (answer) { return __awaiter(_this, void 0, void 0, function () {
                                                var error_3;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!this._.includes(["Y", "y"], answer.trim())) return [3 /*break*/, 5];
                                                            colorLog(21, "Creating database \"".concat(dbName, "\", please wait!"));
                                                            _a.label = 1;
                                                        case 1:
                                                            _a.trys.push([1, 3, , 4]);
                                                            return [4 /*yield*/, connection.query(createDatabaseSql)];
                                                        case 2:
                                                            _a.sent();
                                                            colorLog(92, "Database \"".concat(dbName, "\" successfully created!"));
                                                            promptUser.close();
                                                            resolve();
                                                            return [3 /*break*/, 4];
                                                        case 3:
                                                            error_3 = _a.sent();
                                                            handleError("Database \"".concat(dbName, "\" could not be created!"), error_3);
                                                            promptUser.close();
                                                            reject(error_3);
                                                            return [3 /*break*/, 4];
                                                        case 4: return [3 /*break*/, 6];
                                                        case 5:
                                                            promptUser.close();
                                                            resolve();
                                                            _a.label = 6;
                                                        case 6: return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                        })];
                                });
                            }); };
                            processMigrations = function (connection, directory, fs) { return __awaiter(_this, void 0, void 0, function () {
                                var files, _i, files_1, file, migrationName, sqlMigrationPath, sqlContent, rows, insertMigrationSql, error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            files = fs.readdirSync(directory, { withFileTypes: true });
                                            _i = 0, files_1 = files;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < files_1.length)) return [3 /*break*/, 10];
                                            file = files_1[_i];
                                            if (!file.isFile()) return [3 /*break*/, 9];
                                            migrationName = file.name.replace(".sql", "");
                                            sqlMigrationPath = path.join(directory, file.name);
                                            sqlContent = fs.readFileSync(sqlMigrationPath).toString();
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 8, , 9]);
                                            return [4 /*yield*/, connection.query("SELECT migrations_file_name FROM ".concat(dbName, ".").concat(migrationTable, " WHERE migrations_file_name=? LIMIT 1;"), [migrationName])];
                                        case 3:
                                            rows = (_a.sent())[0];
                                            if (!this._.isEmpty(rows)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, connection.query(sqlContent)];
                                        case 4:
                                            _a.sent();
                                            insertMigrationSql = "\n\t\t\t\t\t\t\t\tINSERT INTO ".concat(dbName, ".").concat(migrationTable, " \n\t\t\t\t\t\t\t\t(migrations_file_name, migrations_sql) \n\t\t\t\t\t\t\t\tVALUES (?, ?);\n\t\t\t\t\t\t\t");
                                            return [4 /*yield*/, connection.query(insertMigrationSql, [migrationName, sqlContent])];
                                        case 5:
                                            _a.sent();
                                            colorLog(92, "SQL-File ".concat(file.name, " successfully written to the database"));
                                            colorLog(93, "\u2714\u2714 Migration: \"".concat(file.name, "\" read successfully"));
                                            return [3 /*break*/, 7];
                                        case 6:
                                            colorLog(95, "\u00D7\u00D7 Migration file: ".concat(file.name, " already inserted \u00D7\u00D7"));
                                            _a.label = 7;
                                        case 7: return [3 /*break*/, 9];
                                        case 8:
                                            error_4 = _a.sent();
                                            handleError("Error processing migration: ".concat(migrationName), error_4);
                                            return [3 /*break*/, 9];
                                        case 9:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 18, , 19]);
                            pool = this.establishConnectionWithoutDb();
                            return [4 /*yield*/, pool.getConnection()];
                        case 2:
                            connection = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, , 16, 17]);
                            return [4 /*yield*/, connection.query(sqlCheckDatabase)];
                        case 4:
                            rows = (_a.sent())[0];
                            if (!this._.isEmpty(rows)) return [3 /*break*/, 6];
                            colorLog(31, "Database: \"".concat(dbName, "\" does not exist!"));
                            return [4 /*yield*/, promptUserForDatabaseCreation(connection)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            dbPool = this.pool;
                            return [4 /*yield*/, dbPool.getConnection()];
                        case 7:
                            dbConnection = _a.sent();
                            _a.label = 8;
                        case 8:
                            _a.trys.push([8, , 14, 15]);
                            return [4 /*yield*/, dbConnection.query(checkMigrationsTableSql)];
                        case 9:
                            migrationRows = (_a.sent())[0];
                            if (!this._.isEmpty(migrationRows)) return [3 /*break*/, 11];
                            colorLog(31, "Table Migration: \"".concat(migrationTable, "\" does not exist!"));
                            createMigrationTable = "\n\t\t\t\t\t\t\tCREATE TABLE IF NOT EXISTS ".concat(dbName, ".").concat(migrationTable, " (\n\t\t\t\t\t\t\t\tid INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\n\t\t\t\t\t\t\t\tmigrations_file_name VARCHAR(255) NOT NULL,\n\t\t\t\t\t\t\t\tmigrations_sql LONGTEXT NOT NULL,\n\t\t\t\t\t\t\t\tcreated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP\n\t\t\t\t\t\t\t) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n\t\t\t\t\t\t");
                            return [4 /*yield*/, dbConnection.query(createMigrationTable)];
                        case 10:
                            _a.sent();
                            colorLog(92, "Table \"".concat(migrationTable, "\" successfully created!"));
                            return [3 /*break*/, 12];
                        case 11:
                            colorLog(94, "Table Migration: \"".concat(migrationTable, "\" already exists."));
                            _a.label = 12;
                        case 12: 
                        //? Step 5: Process the migration files
                        return [4 /*yield*/, processMigrations(dbConnection, directoryRoutes, fileSystem)];
                        case 13:
                            //? Step 5: Process the migration files
                            _a.sent();
                            return [3 /*break*/, 15];
                        case 14:
                            dbConnection.release();
                            return [7 /*endfinally*/];
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            connection.release();
                            return [7 /*endfinally*/];
                        case 17:
                            //? Step 6: Exit the process after successful migration
                            colorLog(92, "✔✔ All migrations processed successfully!");
                            process.exit(0); //? Successful exit
                            return [3 /*break*/, 19];
                        case 18:
                            error_2 = _a.sent();
                            handleError("Error while executing migration process", error_2);
                            return [3 /*break*/, 19];
                        case 19: return [2 /*return*/];
                    }
                });
            });
        };
        return Database;
    }(ExpressSequelizeSession_1.default)),
    _a.instanceCount = 0 // Static counter to track instances
,
    _a);
