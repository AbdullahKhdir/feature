"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogicException_1 = __importDefault(require("../exception/types/LogicException"));
var SQLException_1 = __importDefault(require("../exception/types/SQLException"));
var Singleton_1 = require("../Singleton/Singleton");
var helperFunctions_1 = require("../utils/helperFunctions");
var config = __importStar(require("../config"));
/**
 * @class SqlModel
 * @constructor
 * @description Class SqlModel is used to prepare suitable environment to build queries for the models
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
var SqlModel = /** @class */ (function () {
    // todo export NODE_COMPILE_CACHE_PATH=/path/to/your/custom/cache/directory
    // todo node 22.09 module.enableCompileCache();
    // todo const util = require('node:util'); const {functionName, scriptName, lineNumber, column} = util.getCallSite()
    // todo cluster module in node for handling multiple-core systems
    // todo io.js, N-API, llhttp, HTTP/2 and HTTP3 ?
    // todo see what seqeulize have to offer of functionalities and do implement them
    // todo mysql cache - redis caching
    function SqlModel() {
        var _this = this;
        /**
         * @description MYSQL NUMBER FLAG FOR PRIMARY KEY
         * @var {number} MYSQL_PRIMARY_KEY_FLAG
         */
        this.MYSQL_PRIMARY_KEY_FLAG = 16939;
        /**
         * @description Flag to track if initializeModel() was called
         * @var {boolean} isInitialized
         */
        this.isInitialized = false;
        this._columnsValidationExcuted = false;
        /**
         * @function deepCamelCaseKeys
         * @description return object's indexes of an array or object's indexes as camelCased
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @param object - the object or array to adjust
         * @returns {object}
         */
        this.deepCamelCaseKeys = function (object) {
            if (_this._.isArray(object)) {
                return object.map(function (item) {
                    if (_this._.isObject(item)) {
                        return _this.deepCamelCaseKeys(item);
                    }
                    return item;
                });
            }
            else if (_this._.isObject(object) && !_this._.isDate(object)) {
                return _this._.mapKeys(_this._.mapValues(object, function (value) {
                    return _this.deepCamelCaseKeys(value);
                }), function (value, key) { return _this._.camelCase(key); });
            }
            return object;
        };
        this.mysql = Singleton_1.Singleton.getDbSession();
        this.model = (0, helperFunctions_1.getClass)(this);
        this.pool = Singleton_1.Singleton.getDb().pool;
        this.db = Singleton_1.Singleton.getDb();
        this.redis = Singleton_1.Singleton.getRedisInstance();
        this.constants = Singleton_1.Singleton.getConstants();
        this._ = Singleton_1.Singleton.getLodash();
        setTimeout(function () {
            if (!_this.isInitialized) {
                throw new Error("initializeModel() was not called in the derived class (".concat(_this.model, ")."));
            }
        }, 0);
    }
    /**
     * @function initializeModel
     * @version 1.0.0
     * @description initializes the model required functionalities and set a flag to true
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns {Promise<never>}
     */
    SqlModel.prototype.initializeModel = function () {
        this.modelColumns = this.columns();
        this.isInitialized = true;
    };
    /**
     * @function handleException
     * @version 1.0.0
     * @description Handles SQL exceptions by rejecting with an error message.
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {new (message: string) => SQLException | LogicException} type - The type of the error
     * @param {string} message - The error message.
     * @param {unknown} error - Optional additional error details.
    
     * @returns {Promise<never>}
     */
    SqlModel.prototype.handleException = function (type, message, error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.reject(new type("".concat(message, " \n ").concat(error || "")))];
            });
        });
    };
    /**
     * @function validateTypesAgainstModelColumns
     * @description Validates the types of an object (values, params, where clause) against the defined modelColumns.
     * @param {object} data - The object to validate (values, params, or where clause).
     * @returns {Promise<boolean | SQLException>} - Resolves true if valid, otherwise throws SQLException.
     */
    SqlModel.prototype.validateTypesAgainstModelColumns = function (data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, _d, _i, key, expectedType, actualValue, isValid;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _b = data;
                        _c = [];
                        for (_d in _b)
                            _c.push(_d);
                        _i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _c.length)) return [3 /*break*/, 7];
                        _d = _c[_i];
                        if (!(_d in _b)) return [3 /*break*/, 6];
                        key = _d;
                        if (!this.modelColumns.hasOwnProperty(key)) return [3 /*break*/, 4];
                        expectedType = (_a = this.modelColumns[key]) === null || _a === void 0 ? void 0 : _a.type;
                        actualValue = data[key];
                        if (!expectedType)
                            return [3 /*break*/, 6];
                        isValid = this.validateType(expectedType, actualValue);
                        if (!!isValid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Invalid type for column \"".concat(key, "\". Expected type \"").concat(expectedType, "\" but got value \"").concat(actualValue, "\" of type \"").concat(typeof actualValue, "\"."))];
                    case 2: return [2 /*return*/, _e.sent()];
                    case 3: return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.handleException(SQLException_1.default, "The column \"".concat(key, "\" does not exist in the modelColumns of the model \"").concat(this.model, "\"."))];
                    case 5: return [2 /*return*/, _e.sent()];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * @function validateType
     * @description A utility function to validate if a value matches the expected SQL type.
     * @param {string} expectedType - The expected SQL type (from modelColumns).
     * @param {any} value - The actual value to check.
     * @returns {boolean} - Returns true if the value matches the expected type.
     */
    SqlModel.prototype.validateType = function (expectedType, value) {
        switch (expectedType) {
            case "TINYINT":
            case "SMALLINT":
            case "MEDIUMINT":
            case "INT":
            case "INTEGER":
            case "BIGINT":
                return Number.isInteger(value);
            case "FLOAT":
            case "DOUBLE":
            case "NUMERIC":
            case "DECIMAL":
                return typeof value === "number";
            case "BOOLEAN":
            case "BOOL":
                return typeof value === "boolean";
            case "CHAR":
            case "VARCHAR":
            case "TEXT":
            case "TINYTEXT":
            case "MEDIUMTEXT":
            case "LONGTEXT":
                return typeof value === "string";
            case "DATE":
            case "DATETIME":
            case "TIMESTAMP":
            case "TIME":
            case "YEAR":
                return value instanceof Date || typeof value === "string";
            case "JSON":
                return typeof value === "object";
            default:
                return true;
        }
    };
    /**
     * @function describeTable
     * @description Describes a table in the database
     * @param {string} table - Table name
     * @returns {Promise<[T, FieldPacket[]]>}
     */
    SqlModel.prototype.describeTable = function (table, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 3];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.pool.getConnection()];
                    case 4:
                        connection = _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, connection.query("DESC ".concat(table, ";"))];
                    case 6:
                        result = (_a.sent())[0];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [2 /*return*/, result];
                    case 7:
                        error_1 = _a.sent();
                        connection.release();
                        throw error_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function validateColumns
     * @description Validates the columns of the model with the corresponding table
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns {Promise<SQLException|boolean>}
     */
    SqlModel.prototype.validateColumns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var correspondingTable, describedColumns, _i, _a, column;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._columnsValidationExcuted) {
                            return [2 /*return*/];
                        }
                        this._columnsValidationExcuted = true;
                        if (!this._.isEmpty(this.modelColumns)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The public modelColumns property the ".concat(this.model, " of the table ").concat(this.table, " is not implemented!"))];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        if (!this._.isEmpty(this.table)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The table property of the ".concat(this.model, " of the table ").concat(this.table, " is not implemented!"))];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4: return [4 /*yield*/, this.describeTable(this.table)];
                    case 5:
                        correspondingTable = _b.sent();
                        describedColumns = correspondingTable.map(function (item) { return item.Field; });
                        _i = 0, _a = Object.keys(this.modelColumns);
                        _b.label = 6;
                    case 6:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        column = _a[_i];
                        if (!(describedColumns.includes(column) && !column && !this.primaryKey)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The column \"".concat(column, "\" must be assigned in the columns abstract function in \"").concat(this.model, "\" of the table \"").concat(this.table, "\"!"))];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        if (!!describedColumns.includes(column)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The column \"".concat(column, "\" must not be assigned in the columns abstract function in \"").concat(this.model, "\" of the table \"").concat(this.table, "\"!"))];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        _i++;
                        return [3 /*break*/, 6];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function delete
     * @description Deletes a data record from the specified table.
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} table - The name of the table from which the record will be deleted.
     * @param {string|number|Object} id - The primary key or an object representing the condition to match the record.
     * A promise that resolves with the query result or rejects with an exception.
     * @throws {LogicException} If the user is not allowed to delete records.
     * @throws {SQLException} If the ID is invalid, the table doesn't exist, or the query fails.
     * @returns {Promise<LogicException | SQLException | [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>}
     */
    SqlModel.prototype.delete = function (id, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, tableExists, query, params, whereClauses, result, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 3];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.pool.getConnection()];
                    case 4:
                        connection = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!!this.canDelete) return [3 /*break*/, 7];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "User cannot delete!")];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        if (!(this._.isEmpty(id) && !this._.isNumber(id))) return [3 /*break*/, 9];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Primary key must not be empty!")];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9:
                        if (!(!this._.isString(id) && !this._.isNumber(id) && !this._.isObject(id))) return [3 /*break*/, 11];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Invalid ID type!")];
                    case 10: return [2 /*return*/, _a.sent()];
                    case 11:
                        if (!this._.isEmpty(this.table)) return [3 /*break*/, 13];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Table name must not be empty!")];
                    case 12: return [2 /*return*/, _a.sent()];
                    case 13: return [4 /*yield*/, this.describeTable(this.table, connection)];
                    case 14:
                        tableExists = !!(_a.sent());
                        if (!!tableExists) return [3 /*break*/, 16];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The table \"".concat(this.table, "\" does not exist in the database!"))];
                    case 15: return [2 /*return*/, _a.sent()];
                    case 16:
                        query = "";
                        if (!this._.isObject(id)) return [3 /*break*/, 19];
                        whereClauses = Object.keys(id)
                            .filter(function (key) { return id[key] !== undefined; })
                            .map(function (key) { return "".concat(key, " = ").concat(_this.mysql.escape(id[key])); });
                        if (!(whereClauses.length === 0)) return [3 /*break*/, 18];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Invalid object format for ID")];
                    case 17: return [2 /*return*/, _a.sent()];
                    case 18:
                        query = "DELETE FROM ".concat(this.table, " WHERE ?;");
                        params = whereClauses.join(" AND ");
                        return [3 /*break*/, 22];
                    case 19:
                        if (!(this._.isNumber(id) || !isNaN(Number(id)))) return [3 /*break*/, 20];
                        query = "DELETE FROM ".concat(this.table, " WHERE ID = ?;");
                        params = +id;
                        return [3 /*break*/, 22];
                    case 20:
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Invalid ID format")];
                    case 21: return [2 /*return*/, _a.sent()];
                    case 22:
                        _a.trys.push([22, 24, , 26]);
                        return [4 /*yield*/, connection.query(query, params)];
                    case 23:
                        result = (_a.sent())[0];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [2 /*return*/, result.affectedRows];
                    case 24:
                        error_2 = _a.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Query could not be executed!. \n Error: ".concat(error_2))];
                    case 25: return [2 /*return*/, _a.sent()];
                    case 26: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function deleteAll
     * @description Deletes all data records from a specified table.
     * @version 1.0.1
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} table - The name of the table from which all records will be deleted.
     * A promise that resolves with the query result or rejects with an exception.
     * @throws {LogicException} If the user is not allowed to delete records.
     * @throws {SQLException} If the table doesn't exist or the query fails.
     * @returns {Promise<LogicException | SQLException | [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>}
     */
    SqlModel.prototype.deleteAll = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, tableExists, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 3];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.pool.getConnection()];
                    case 4:
                        connection = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!!this.canDelete) return [3 /*break*/, 7];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "User cannot delete!")];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        if (!this._.isEmpty(this.table)) return [3 /*break*/, 9];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Table must not be empty!")];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9: return [4 /*yield*/, this.describeTable(this.table, connection)];
                    case 10:
                        tableExists = !!(_a.sent());
                        if (!!tableExists) return [3 /*break*/, 12];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The Table ".concat(this.table, " does not exist in the database!"))];
                    case 11: return [2 /*return*/, _a.sent()];
                    case 12:
                        _a.trys.push([12, 14, , 16]);
                        return [4 /*yield*/, connection.query("DELETE FROM ".concat(this.table, ";"))];
                    case 13:
                        result = (_a.sent())[0];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [2 /*return*/, result.affectedRows];
                    case 14:
                        error_3 = _a.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Query could not be executed!")];
                    case 15: return [2 /*return*/, _a.sent()];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function filter
     * @description filters data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Object} params - specified params for filtering query
     * @param {boolean} isRecursiv - is recursive indeicates if all foreign key must be fetched from the db (expensive)
     * @param {String} limit - placeholde for limiting records
     * @param {string} order - order by type for the query
     * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException |LogicException>}
     */
    SqlModel.prototype.filter = function (params, isRecursiv, limit, order, connection) {
        if (isRecursiv === void 0) { isRecursiv = false; }
        if (limit === void 0) { limit = ""; }
        if (order === void 0) { order = "ASC"; }
        return __awaiter(this, void 0, void 0, function () {
            var parsedParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this._.isString(params)) return [3 /*break*/, 4];
                        parsedParams = this.parseSqlConditionString(params);
                        return [4 /*yield*/, this.validateTypesAgainstModelColumns(parsedParams)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!this._.isObject(params)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.validateTypesAgainstModelColumns(params)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.fetchQuery(this.table, params, true, false, false, isRecursiv, order, limit, connection)];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @function get
     * @description gets only one data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {object | number} params - specified params for get query
     * @param {boolean} isRecursiv - is recursive indeicates if all foreign key must be fetched from the db (expensive)
     * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException |LogicException>}
     */
    SqlModel.prototype.get = function (params, isRecursiv, connection) {
        if (isRecursiv === void 0) { isRecursiv = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this._.isObject(params)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.validateTypesAgainstModelColumns(params)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.fetchQuery(this.table, params, false, true, false, isRecursiv, "", "", connection)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @function all
     * @description gets all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} order - order by type for the query
     * @param {boolean} isRecursiv - is recursive indeicates if all foreign key must be fetched from the db (expensive)
     * @param {string} table - the name of the table from which the query will executed from
     * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException |LogicException>}
     */
    SqlModel.prototype.all = function (order, isRecursiv, connection) {
        if (order === void 0) { order = "ASC"; }
        if (isRecursiv === void 0) { isRecursiv = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.fetchQuery(this.table, {}, false, false, true, isRecursiv, order, "", connection)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @function create
     * @description create a data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {object} values - values for creating the record as an object
     * @returns {Promise<mysql.RowDataPacket[] | mysql.OkPacket | mysql.ResultSetHeader>}
     */
    SqlModel.prototype.create = function (values, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, tableExists, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.validateTypesAgainstModelColumns(values)];
                    case 3:
                        _a.sent();
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 4];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.pool.getConnection()];
                    case 5:
                        connection = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(this.canCreate !== true)) return [3 /*break*/, 8];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "User can not create!")];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        if (!this._.isEmpty(this.table)) return [3 /*break*/, 10];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Table must not be empty!")];
                    case 9: return [2 /*return*/, _a.sent()];
                    case 10: return [4 /*yield*/, this.describeTable(this.table, connection)];
                    case 11:
                        tableExists = !!(_a.sent());
                        if (!!tableExists) return [3 /*break*/, 13];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The Table ".concat(this.table, " does not exist in the database!"))];
                    case 12: return [2 /*return*/, _a.sent()];
                    case 13:
                        if (!(!this._.isObject(values) || this._.isEmpty(values))) return [3 /*break*/, 15];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "No columns neither values are specified!")];
                    case 14: return [2 /*return*/, _a.sent()];
                    case 15:
                        _a.trys.push([15, 17, , 19]);
                        return [4 /*yield*/, connection.query("INSERT INTO ".concat(this.table, " SET ?;"), [values])];
                    case 16:
                        result = (_a.sent())[0];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [2 /*return*/, result.insertId];
                    case 17:
                        error_4 = _a.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Failed to insert data into the table! \n Error: ".concat(error_4))];
                    case 18: return [2 /*return*/, _a.sent()];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function update
     * @description updates data record(s)
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} table - the name of the table from which the query will executed from
     * @param {object} values - values for updating the records as an object
     * @param {object|number|null} where - where as a object or number of the id or null for the update query
     * @returns {Promise<mysql.RowDataPacket[] | mysql.OkPacket | mysql.ResultSetHeader>}
     */
    SqlModel.prototype.update = function (values, where, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, tableExists, primaryKey, error_5, result, whereClauses, whereValues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.validateTypesAgainstModelColumns(values)];
                    case 3:
                        _a.sent();
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 4];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.pool.getConnection()];
                    case 5:
                        connection = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(this.canDelete === true)) return [3 /*break*/, 8];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "User can not update!")];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        if (!this._.isEmpty(this.table)) return [3 /*break*/, 10];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Table must not be empty!")];
                    case 9: return [2 /*return*/, _a.sent()];
                    case 10:
                        if (!(!this._.isObject(values) || this._.isEmpty(values))) return [3 /*break*/, 12];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "No columns neither values are specified!")];
                    case 11: return [2 /*return*/, _a.sent()];
                    case 12: return [4 /*yield*/, this.describeTable(this.table, connection)];
                    case 13:
                        tableExists = !!(_a.sent());
                        if (!!tableExists) return [3 /*break*/, 15];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The Table ".concat(this.table, " does not exist in the database!"))];
                    case 14: return [2 /*return*/, _a.sent()];
                    case 15:
                        primaryKey = this.primaryKey;
                        if (!this._.isEmpty(primaryKey)) return [3 /*break*/, 20];
                        _a.label = 16;
                    case 16:
                        _a.trys.push([16, 18, , 20]);
                        return [4 /*yield*/, this.getTablePrimaryKey(this.table, connection)];
                    case 17:
                        primaryKey = _a.sent();
                        return [3 /*break*/, 20];
                    case 18:
                        error_5 = _a.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not retrieve primary key of the table \"".concat(this.table, "\"!"), error_5)];
                    case 19: return [2 /*return*/, _a.sent()];
                    case 20:
                        if (!this._.isObject(where)) return [3 /*break*/, 22];
                        whereClauses = Object.keys(where)
                            .map(function (key) { return "".concat(key, " = ?"); })
                            .join(" AND ");
                        whereValues = Object.values(where);
                        return [4 /*yield*/, connection.query("UPDATE ".concat(this.table, " SET ? WHERE ").concat(whereClauses, ";"), __spreadArray([
                                values
                            ], whereValues, true))];
                    case 21:
                        result = (_a.sent())[0];
                        return [3 /*break*/, 28];
                    case 22:
                        if (!this._.isString(where)) return [3 /*break*/, 24];
                        return [4 /*yield*/, connection.query("UPDATE ".concat(this.table, " SET ? WHERE ").concat(where, ";"), [values])];
                    case 23:
                        result = (_a.sent())[0];
                        return [3 /*break*/, 28];
                    case 24:
                        if (!this._.isNumber(where)) return [3 /*break*/, 26];
                        return [4 /*yield*/, connection.query("UPDATE ".concat(this.table, " SET ? WHERE id = ?;"), [values, where])];
                    case 25:
                        result = (_a.sent())[0];
                        return [3 /*break*/, 28];
                    case 26: return [4 /*yield*/, connection.query("UPDATE ".concat(this.table, " SET ?;"), [values])];
                    case 27:
                        result = (_a.sent())[0];
                        _a.label = 28;
                    case 28:
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        if (result && result.affectedRows) {
                            return [2 /*return*/, result.affectedRows];
                        }
                        return [2 /*return*/, Promise.reject(new SQLException_1.default("Query could not be executed!"))];
                }
            });
        });
    };
    /**
     * @function getTablePrimaryKey
     * @description gets the table primary key
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table - the name of the table from which the query will executed from
     * @returns {Promise<string>}
     */
    SqlModel.prototype.getTablePrimaryKey = function (table, connection) {
        if (table === void 0) { table = this.table; }
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, database_index, length, result, database, table_name, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 1];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.pool.getConnection()];
                    case 2:
                        connection = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!this._.isEmpty(this.primaryKey)) {
                            if (automaticConnectionRelease) {
                                connection.release();
                            }
                            return [2 /*return*/, this.primaryKey];
                        }
                        database_index = table.indexOf(".");
                        if (database_index === this.constants.STRING_RETURN_NUMBERS.NOT_FOUND) {
                            connection.release();
                            return [2 /*return*/, Promise.reject(new SQLException_1.default("Please write the database name in the return value of the abstract function \"table() = ".concat(table, "\" in the module class (").concat(this.model, ")")))];
                        }
                        length = table.toString().length;
                        return [4 /*yield*/, this.describeTable(table, connection)];
                    case 4:
                        result = !!(_a.sent());
                        if (!result) {
                            connection.release();
                            return [2 /*return*/, Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")))];
                        }
                        database = table.substring(0, database_index);
                        table_name = table.substring(database_index + 1, length);
                        return [4 /*yield*/, connection.query("select COLUMN_NAME from information_schema.KEY_COLUMN_USAGE " +
                                "where CONSTRAINT_NAME='PRIMARY' AND TABLE_NAME='" +
                                table_name +
                                "' " +
                                "AND TABLE_SCHEMA='" +
                                database +
                                "'")];
                    case 5:
                        query = (_a.sent());
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        if (this._.isEmpty(query)) {
                            connection.release();
                            return [2 /*return*/, Promise.reject(new SQLException_1.default("Query could not be executed!"))];
                        }
                        return [2 /*return*/, Promise.resolve(query[0][0]["COLUMN_NAME"])];
                }
            });
        });
    };
    /**
     * @function fetchQuery
     * @description fetches a query from the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} table
     * @param {Partial<{ [key in keyof CustomTypes["SqlModelTypes"]["columns"]]: string | number | null } | string | number>} params
     * @param {boolean} isFilter - a placeholder for executing the query methodic for different functionalities
     * @param {boolean} fetchAll - a placeholder for executing the query methodic for all records of the specified model
     * @param {number} limit - placeholde for limiting records
     * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException | LogicException | { [key: string]: any };>}
     */
    SqlModel.prototype.fetchQuery = function (table, params, isFilter, isGet, fetchAll, isRecursiv, order, limit, connection) {
        var _a, _b, _c;
        if (table === void 0) { table = this.table; }
        if (isFilter === void 0) { isFilter = false; }
        if (isGet === void 0) { isGet = false; }
        if (fetchAll === void 0) { fetchAll = false; }
        if (isRecursiv === void 0) { isRecursiv = false; }
        if (order === void 0) { order = "ASC"; }
        if (limit === void 0) { limit = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, tableExists, whereClause, columnName, foreignKeyReference, constraintTable, constraintForeignKey, sql, reverseTable, reverseCol, whereCol, whereTbl, reverseName, primaryKey, cacheKey, error_6, getCacheKey, getCachedResult, getRecursiveResults, _d, cacheKey_1, cachedResult, filterRecursiveResults, _e, key, _f, allCacheKey, allCachedResult, allRecursiveResults, _g, cacheKey_2, filterCachedResult, key, allCacheKey, allCachedResult_1, allRecursiveResults, _h, cacheKey_3, allCachedResult, _j, rows, fields, _k, _l, _m, _i, key, classInstance, constraintQuery, error_7, error_8, constraintQuery, error_9, _o, _p, _q, _r, key, error_10, sqlStatement, constraintQuery, error_11, error_12, constraintQuery, error_13;
            var _s, _t, _u, _v;
            return __generator(this, function (_w) {
                switch (_w.label) {
                    case 0:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 1];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.pool.getConnection()];
                    case 2:
                        connection = _w.sent();
                        _w.label = 3;
                    case 3:
                        if (!this._.isEmpty(table)) return [3 /*break*/, 5];
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Table must not be empty!")];
                    case 4: return [2 /*return*/, _w.sent()];
                    case 5: return [4 /*yield*/, this.describeTable(table, connection)];
                    case 6:
                        tableExists = !!(_w.sent());
                        if (!!tableExists) return [3 /*break*/, 8];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "The Table ".concat(table, " does not exist in the database!"))];
                    case 7: return [2 /*return*/, _w.sent()];
                    case 8:
                        whereClause = [];
                        columnName = "";
                        constraintTable = "";
                        constraintForeignKey = "";
                        sql = "";
                        reverseTable = "";
                        reverseCol = "";
                        whereCol = "";
                        whereTbl = "";
                        reverseName = "";
                        primaryKey = this.primaryKey;
                        cacheKey = "";
                        if (!this._.isEmpty(primaryKey)) return [3 /*break*/, 13];
                        _w.label = 9;
                    case 9:
                        _w.trys.push([9, 11, , 13]);
                        return [4 /*yield*/, this.getTablePrimaryKey(table, connection)];
                    case 10:
                        primaryKey = _w.sent();
                        return [3 /*break*/, 13];
                    case 11:
                        error_6 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not retrieve primary key of the table \"".concat(table || this.table, "\"!"), error_6)];
                    case 12: return [2 /*return*/, _w.sent()];
                    case 13:
                        if (!(fetchAll === false && (!this._.isEmpty(params) || !this._.isNil(params)))) return [3 /*break*/, 44];
                        if (!(isGet && isRecursiv)) return [3 /*break*/, 21];
                        getCacheKey = "sql:\"getRecursiveData\":".concat(table);
                        return [4 /*yield*/, this.redis.getCachedResult(getCacheKey)];
                    case 14:
                        getCachedResult = _w.sent();
                        if (!getCachedResult) return [3 /*break*/, 16];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [4 /*yield*/, this.redis.quit()];
                    case 15:
                        _w.sent();
                        return [2 /*return*/, getCachedResult];
                    case 16:
                        _d = this.deepCamelCaseKeys;
                        return [4 /*yield*/, this.getRecursiveData(params, table, connection)];
                    case 17:
                        getRecursiveResults = _d.apply(this, [_w.sent()]);
                        if (!getRecursiveResults) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.redis.cacheResult(getCacheKey, getRecursiveResults, config.configurations().redisCacheExpiry)];
                    case 18:
                        _w.sent();
                        _w.label = 19;
                    case 19: return [4 /*yield*/, this.redis.quit()];
                    case 20:
                        _w.sent();
                        return [2 /*return*/, getRecursiveResults];
                    case 21:
                        if (!(isFilter && isRecursiv)) return [3 /*break*/, 40];
                        cacheKey_1 = "sql:\"filterRecursiveData\":".concat(table);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey_1)];
                    case 22:
                        cachedResult = _w.sent();
                        if (!cachedResult) return [3 /*break*/, 24];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [4 /*yield*/, this.redis.quit()];
                    case 23:
                        _w.sent();
                        return [2 /*return*/, cachedResult];
                    case 24:
                        filterRecursiveResults = null;
                        if (!this._.isString(params)) return [3 /*break*/, 26];
                        _e = this.deepCamelCaseKeys;
                        return [4 /*yield*/, this.filterRecursiveData(connection, params, order, limit, table, false)];
                    case 25:
                        filterRecursiveResults = _e.apply(this, [_w.sent()]);
                        return [3 /*break*/, 36];
                    case 26:
                        if (!this._.isObject(params)) return [3 /*break*/, 28];
                        for (key in params) {
                            if (Object.hasOwnProperty.call(params, key)) {
                                whereClause.push("".concat(key, " = ").concat(params[key]));
                            }
                        }
                        if (!this._.isEmpty(whereClause)) {
                            whereClause = whereClause.join(" AND ");
                        }
                        _f = this.deepCamelCaseKeys;
                        return [4 /*yield*/, this.filterRecursiveData(connection, whereClause, order, limit, table, false)];
                    case 27:
                        filterRecursiveResults = _f.apply(this, [_w.sent()]);
                        return [3 /*break*/, 36];
                    case 28:
                        allCacheKey = "sql:\"allRecursiveData\":".concat(table);
                        return [4 /*yield*/, this.redis.getCachedResult(allCacheKey)];
                    case 29:
                        allCachedResult = _w.sent();
                        if (!allCachedResult) return [3 /*break*/, 31];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [4 /*yield*/, this.redis.quit()];
                    case 30:
                        _w.sent();
                        return [2 /*return*/, allCachedResult];
                    case 31:
                        _g = this.deepCamelCaseKeys;
                        return [4 /*yield*/, this.filterRecursiveData(connection, "", order, limit, table, true)];
                    case 32:
                        allRecursiveResults = _g.apply(this, [_w.sent()]);
                        if (!allRecursiveResults) return [3 /*break*/, 34];
                        return [4 /*yield*/, this.redis.cacheResult(allCacheKey, allRecursiveResults, config.configurations().redisCacheExpiry)];
                    case 33:
                        _w.sent();
                        _w.label = 34;
                    case 34: return [4 /*yield*/, this.redis.quit()];
                    case 35:
                        _w.sent();
                        return [2 /*return*/, allRecursiveResults];
                    case 36:
                        if (!filterRecursiveResults) return [3 /*break*/, 38];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey_1, filterRecursiveResults, config.configurations().redisCacheExpiry)];
                    case 37:
                        _w.sent();
                        _w.label = 38;
                    case 38: return [4 /*yield*/, this.redis.quit()];
                    case 39:
                        _w.sent();
                        return [2 /*return*/, filterRecursiveResults];
                    case 40:
                        cacheKey_2 = "sql:\"filter\":".concat(table);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey_2)];
                    case 41:
                        filterCachedResult = _w.sent();
                        if (!filterCachedResult) return [3 /*break*/, 43];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [4 /*yield*/, this.redis.quit()];
                    case 42:
                        _w.sent();
                        return [2 /*return*/, filterCachedResult];
                    case 43:
                        if (this._.isObject(params)) {
                            for (key in params) {
                                if (Object.hasOwnProperty.call(params, key)) {
                                    whereClause.push("".concat(key, " = ?"));
                                }
                            }
                            if (!this._.isEmpty(whereClause)) {
                                whereClause = whereClause.join(" AND ");
                                sql = "SELECT * FROM ".concat(table, " WHERE ").concat(whereClause, " ORDER BY ").concat(primaryKey, " ").concat(order);
                                params = Object.values(params);
                            }
                        }
                        else if (this._.isString(params)) {
                            sql = "SELECT * FROM ".concat(table, " WHERE ").concat(params, " ORDER BY ").concat(primaryKey, " ").concat(order);
                        }
                        else if (this._.isNumber(params)) {
                            sql = "SELECT * FROM ".concat(table, " WHERE ").concat(primaryKey, " = ? ORDER BY ").concat(primaryKey, " ").concat(order);
                        }
                        if (isGet) {
                            sql += " LIMIT 1;";
                        }
                        else if (isFilter) {
                            if (!this._.isEmpty(limit)) {
                                sql += " LIMIT ".concat(limit.toString(), ";");
                            }
                        }
                        else {
                            sql += ";";
                        }
                        return [3 /*break*/, 56];
                    case 44:
                        if (!isRecursiv) return [3 /*break*/, 52];
                        allCacheKey = "sql:\"allRecursiveData\":".concat(table);
                        return [4 /*yield*/, this.redis.getCachedResult(allCacheKey)];
                    case 45:
                        allCachedResult_1 = _w.sent();
                        if (!allCachedResult_1) return [3 /*break*/, 47];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [4 /*yield*/, this.redis.quit()];
                    case 46:
                        _w.sent();
                        return [2 /*return*/, allCachedResult_1];
                    case 47:
                        _h = this.deepCamelCaseKeys;
                        return [4 /*yield*/, this.filterRecursiveData(connection, "", order, "", table, true)];
                    case 48:
                        allRecursiveResults = _h.apply(this, [_w.sent()]);
                        if (!allRecursiveResults) return [3 /*break*/, 50];
                        return [4 /*yield*/, this.redis.cacheResult(allCacheKey, allRecursiveResults, config.configurations().redisCacheExpiry)];
                    case 49:
                        _w.sent();
                        _w.label = 50;
                    case 50: return [4 /*yield*/, this.redis.quit()];
                    case 51:
                        _w.sent();
                        return [2 /*return*/, allRecursiveResults];
                    case 52:
                        cacheKey_3 = "sql:\"all\":".concat(table);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey_3)];
                    case 53:
                        allCachedResult = _w.sent();
                        if (!allCachedResult) return [3 /*break*/, 55];
                        return [4 /*yield*/, this.redis.quit()];
                    case 54:
                        _w.sent();
                        return [2 /*return*/, allCachedResult];
                    case 55:
                        params = "";
                        sql = "SELECT * FROM ".concat(table, " ORDER BY ").concat(primaryKey, " ").concat(order);
                        _w.label = 56;
                    case 56: return [4 /*yield*/, connection.query(sql, [params])];
                    case 57:
                        _j = _w.sent(), rows = _j[0], fields = _j[1];
                        rows = this.deepCamelCaseKeys(rows);
                        if (!!this._.isEmpty(rows)) return [3 /*break*/, 135];
                        if (!(this._.isObject(this.modelColumns) && !this._.isEmpty(this.modelColumns))) return [3 /*break*/, 96];
                        _k = this.modelColumns;
                        _l = [];
                        for (_m in _k)
                            _l.push(_m);
                        _i = 0;
                        _w.label = 58;
                    case 58:
                        if (!(_i < _l.length)) return [3 /*break*/, 96];
                        _m = _l[_i];
                        if (!(_m in _k)) return [3 /*break*/, 95];
                        key = _m;
                        columnName = key;
                        foreignKeyReference = (_a = this.modelColumns[columnName]) === null || _a === void 0 ? void 0 : _a.references;
                        if (this._.isEmpty(foreignKeyReference)) {
                            return [3 /*break*/, 95];
                        }
                        if (!!("column" in foreignKeyReference)) return [3 /*break*/, 61];
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 59:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Property \"column\" of the referenced column name ".concat(columnName, " of the tabel ").concat(table, " of the model ").concat(this.model, " does not exist!"))];
                    case 60: return [2 /*return*/, _w.sent()];
                    case 61:
                        if (!(!("table" in foreignKeyReference) && !("class" in foreignKeyReference))) return [3 /*break*/, 64];
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 62:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "One of the properties \"table\" or \"class\" of the referenced column name ".concat(columnName, " of the tabel ").concat(table, " of the model ").concat(this.model, " must be defined!"))];
                    case 63: return [2 /*return*/, _w.sent()];
                    case 64:
                        if (!this._.isString(foreignKeyReference.class)) return [3 /*break*/, 67];
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 65:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Property \"class\" of the referenced column name ".concat(columnName, " of the tabel ").concat(table, " of the model ").concat(this.model, " must be either a model class or an initiated instance of the model class!"))];
                    case 66: return [2 /*return*/, _w.sent()];
                    case 67:
                        if (foreignKeyReference.table && this._.isString(foreignKeyReference.table)) {
                            constraintTable = foreignKeyReference.table;
                        }
                        else if ((0, helperFunctions_1.isConstructor)(foreignKeyReference.class)) {
                            classInstance = new foreignKeyReference.class();
                            constraintTable = classInstance.table;
                        }
                        else if ((0, helperFunctions_1.isInstance)(foreignKeyReference.class)) {
                            constraintTable = foreignKeyReference.class.table;
                        }
                        if (!this._.isEmpty(constraintTable)) return [3 /*break*/, 70];
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 68:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Property table of the model ".concat(foreignKeyReference.class, " is not defined!"))];
                    case 69: return [2 /*return*/, _w.sent()];
                    case 70:
                        constraintForeignKey = foreignKeyReference.column;
                        if (!!this._.isEmpty(constraintForeignKey)) return [3 /*break*/, 81];
                        _w.label = 71;
                    case 71:
                        _w.trys.push([71, 77, , 80]);
                        return [4 /*yield*/, connection.query("SELECT * \n\t\t\t\t\t\t\t\tFROM ".concat(constraintTable, " \n\t\t\t\t\t\t\t\tWHERE ").concat(constraintForeignKey, " = ?"), [rows[0][this._.camelCase(columnName)]])];
                    case 72:
                        constraintQuery = (_w.sent())[0];
                        if (!this._.isArray(constraintQuery)) return [3 /*break*/, 73];
                        rows[this._.camelCase(columnName)] = (_s = {},
                            _s[this._.camelCase(foreignKeyReference.name)] = this.deepCamelCaseKeys(constraintQuery[0]),
                            _s);
                        return [3 /*break*/, 76];
                    case 73:
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 74:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Could not return the query because it is not an array!")];
                    case 75: return [2 /*return*/, _w.sent()];
                    case 76: return [3 /*break*/, 80];
                    case 77:
                        error_7 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 78:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Column \"".concat(constraintForeignKey, "\" does not exist in table \"").concat(constraintTable, "\"!"), error_7)];
                    case 79: return [2 /*return*/, _w.sent()];
                    case 80: return [3 /*break*/, 95];
                    case 81:
                        _w.trys.push([81, 83, , 86]);
                        return [4 /*yield*/, this.getTablePrimaryKey(constraintTable, connection)];
                    case 82:
                        primaryKey = _w.sent();
                        return [3 /*break*/, 86];
                    case 83:
                        error_8 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 84:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not retrieve primary key of the table \"".concat(constraintTable, "\"!"), error_8)];
                    case 85: return [2 /*return*/, _w.sent()];
                    case 86:
                        _w.trys.push([86, 92, , 95]);
                        return [4 /*yield*/, connection.query("SELECT *\n\t\t\t\t\t\t\t\tFROM ".concat(constraintTable, "\n\t\t\t\t\t\t\t\tWHERE ").concat(primaryKey, " = ?"), [rows[0][this._.camelCase(columnName)]])];
                    case 87:
                        constraintQuery = (_w.sent())[0];
                        if (!this._.isArray(constraintQuery)) return [3 /*break*/, 88];
                        rows[this._.camelCase(columnName)] = (_t = {},
                            _t[this._.camelCase(foreignKeyReference.name)] = this.deepCamelCaseKeys(constraintQuery[0]),
                            _t);
                        return [3 /*break*/, 91];
                    case 88:
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 89:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Could not return the query because it is not an array!")];
                    case 90: return [2 /*return*/, _w.sent()];
                    case 91: return [3 /*break*/, 95];
                    case 92:
                        error_9 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 93:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Query could not be executed for table \"".concat(constraintTable, "\"!"), error_9)];
                    case 94: return [2 /*return*/, _w.sent()];
                    case 95:
                        _i++;
                        return [3 /*break*/, 58];
                    case 96:
                        if (!(this._.isObject(this.reverseReferences) && !this._.isEmpty(this.reverseReferences))) return [3 /*break*/, 135];
                        _o = this.reverseReferences;
                        _p = [];
                        for (_q in _o)
                            _p.push(_q);
                        _r = 0;
                        _w.label = 97;
                    case 97:
                        if (!(_r < _p.length)) return [3 /*break*/, 135];
                        _q = _p[_r];
                        if (!(_q in _o)) return [3 /*break*/, 134];
                        key = _q;
                        if (!(!("table" in this.reverseReferences[key]) || !("column" in this.reverseReferences[key]))) return [3 /*break*/, 100];
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 98:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "The referenced column property ".concat(this.reverseReferences[key], " \n\t\t\t\t\t\t\tmust have the properties table and column."))];
                    case 99: return [2 /*return*/, _w.sent()];
                    case 100:
                        if (!!this._.isEmpty(this.reverseReferences[key].settings)) return [3 /*break*/, 104];
                        if (!(!("whereColumn" in this.reverseReferences[key].settings) ||
                            !("whereTable" in this.reverseReferences[key].settings))) return [3 /*break*/, 103];
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 101:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "The property \"settings\" of the object ".concat(this.reverseReferences[key].settings, " must have the properties whereColumn and whereTable."))];
                    case 102: return [2 /*return*/, _w.sent()];
                    case 103:
                        whereCol = (_b = this.reverseReferences[key]) === null || _b === void 0 ? void 0 : _b.settings.whereColumn;
                        whereTbl = (_c = this.reverseReferences[key]) === null || _c === void 0 ? void 0 : _c.settings.whereTable;
                        _w.label = 104;
                    case 104:
                        reverseTable = this.reverseReferences[key].table;
                        reverseCol = this.reverseReferences[key].column;
                        reverseName = key;
                        if (!(!this._.isEmpty(whereCol) && !this._.isEmpty(whereTbl))) return [3 /*break*/, 120];
                        _w.label = 105;
                    case 105:
                        _w.trys.push([105, 107, , 110]);
                        return [4 /*yield*/, this.getTablePrimaryKey(whereTbl, connection)];
                    case 106:
                        primaryKey = _w.sent();
                        return [3 /*break*/, 110];
                    case 107:
                        error_10 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 108:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not retrieve primary key of the table \"".concat(constraintTable, "\"!"), error_10)];
                    case 109: return [2 /*return*/, _w.sent()];
                    case 110:
                        _w.trys.push([110, 116, , 119]);
                        sqlStatement = "SELECT * FROM " +
                            reverseTable +
                            " " +
                            "WHERE " +
                            reverseTable +
                            "." +
                            reverseCol +
                            " IN ( " +
                            "SELECT " +
                            primaryKey +
                            " " +
                            "FROM " +
                            whereTbl;
                        if (!this._.isNil(rows[0][whereCol])) {
                            sqlStatement += " " + "WHERE " + whereCol + " = " + "?" + " )";
                        }
                        else {
                            sqlStatement += " )";
                        }
                        return [4 /*yield*/, connection.query(sqlStatement)];
                    case 111:
                        constraintQuery = (_w.sent())[0];
                        if (!this._.isArray(constraintQuery)) return [3 /*break*/, 112];
                        this._.assign(rows, (_u = {},
                            _u[this._.camelCase(reverseName)] = this.deepCamelCaseKeys(constraintQuery[0]),
                            _u.reverseTableName = reverseTable,
                            _u.reversedNestedTableName = whereTbl,
                            _u.reversedNestedColumnName = whereCol,
                            _u));
                        return [3 /*break*/, 115];
                    case 112:
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 113:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Could not return the query because it is not an array!")];
                    case 114: return [2 /*return*/, _w.sent()];
                    case 115: return [3 /*break*/, 119];
                    case 116:
                        error_11 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 117:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Reverse query for the table ".concat(reverseTable, " could not be executed!"), error_11)];
                    case 118: return [2 /*return*/, _w.sent()];
                    case 119: return [3 /*break*/, 134];
                    case 120:
                        _w.trys.push([120, 122, , 125]);
                        return [4 /*yield*/, this.getTablePrimaryKey(reverseTable, connection)];
                    case 121:
                        primaryKey = _w.sent();
                        return [3 /*break*/, 125];
                    case 122:
                        error_12 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 123:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not retrieve primary key of the table \"".concat(reverseTable, "\"!"), error_12)];
                    case 124: return [2 /*return*/, _w.sent()];
                    case 125:
                        _w.trys.push([125, 131, , 134]);
                        // todo reverseCol that does not match the primary key of the table must be fetched and identified seperatly in order to get the right name from the rows variable to have the value and then to assign the reversed reference name to the results array
                        // todo get table meta data and see the reverseCol relationship to which column does it reference then call the column name from meta data and then attach it as index to rows variable to get the right value
                        // todo and then attach redis to the rest of the functions in sqlModel
                        sql = "SELECT * FROM ".concat(reverseTable, " WHERE ").concat(reverseCol, " = ?");
                        return [4 /*yield*/, connection.query(sql, [rows[0][reverseCol]])];
                    case 126:
                        constraintQuery = (_w.sent())[0];
                        console.log(sql);
                        console.log(reverseTable);
                        console.log(reverseCol);
                        console.log(rows);
                        if (!this._.isArray(constraintQuery)) return [3 /*break*/, 127];
                        this._.assign(rows, (_v = {},
                            _v[this._.camelCase(reverseName)] = this.deepCamelCaseKeys(constraintQuery[0]),
                            _v.reverseTableName = reverseTable,
                            _v));
                        return [3 /*break*/, 130];
                    case 127:
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 128:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Could not return the query because it is not an array!")];
                    case 129: return [2 /*return*/, _w.sent()];
                    case 130: return [3 /*break*/, 134];
                    case 131:
                        error_13 = _w.sent();
                        connection.release();
                        return [4 /*yield*/, this.redis.quit()];
                    case 132:
                        _w.sent();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Query for column ".concat(reverseCol, " with the value of ").concat(rows[0][primaryKey], " of the table \"").concat(reverseTable, "\" could not be executed!"), error_13)];
                    case 133: return [2 /*return*/, _w.sent()];
                    case 134:
                        _r++;
                        return [3 /*break*/, 97];
                    case 135:
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        if (!rows) return [3 /*break*/, 137];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, rows, config.configurations().redisCacheExpiry)];
                    case 136:
                        _w.sent();
                        _w.label = 137;
                    case 137: return [4 /*yield*/, this.redis.quit()];
                    case 138:
                        _w.sent();
                        return [2 /*return*/, Promise.resolve(rows)];
                }
            });
        });
    };
    /**
     * @function fetchTableMetadata
     * @description fetches the metadata of a table (foreign and primary keys, and relationships)
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} table - Name of the table
     * @returns {Promise<{primaryKey: string; relationships: {foreign_key_column: any;referenced_table: any;referenced_column: any;}}>}
     */
    SqlModel.prototype.fetchTableMetadata = function (table, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, primaryKey, metadataQuery, result, rows, relationships, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 1];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.pool.getConnection()];
                    case 2:
                        connection = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 8]);
                        return [4 /*yield*/, this.escapeDatabaseName(table)];
                    case 4:
                        table = _a.sent();
                        primaryKey = "";
                        metadataQuery = "\n\t\t\t\tSELECT COLUMN_NAME as primaryKey, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME, COLUMN_NAME as foreignKeyColumn\n\t\t\t\tFROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE\n\t\t\t\tWHERE TABLE_NAME = ?\n\t\t\t\tAND REFERENCED_TABLE_SCHEMA = DATABASE();";
                        return [4 /*yield*/, connection.query(metadataQuery, [table])];
                    case 5:
                        result = (_a.sent())[0];
                        if (this._.isArray(result)) {
                            rows = result;
                            if (!this._.isEmpty(rows[0])) {
                                primaryKey = rows[0]["primaryKey"];
                            }
                            relationships = result.map(function (row) { return ({
                                foreign_key_column: row.foreignKeyColumn,
                                referenced_table: row.REFERENCED_TABLE_NAME,
                                referenced_column: row.REFERENCED_COLUMN_NAME
                            }); });
                            if (automaticConnectionRelease) {
                                connection.release();
                            }
                            return [2 /*return*/, { primaryKey: primaryKey, relationships: relationships }];
                        }
                        return [3 /*break*/, 8];
                    case 6:
                        error_14 = _a.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not get the metadata of the table \"".concat(table, "\"! \n ").concat(error_14))];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function getRecursiveData
     * @description get one datarecord from the database and all it's relationships
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {number|object|string|undefined} params - number of id of a table
     * @param {string} table - name of the table
     * @returns {Promise<object>}
     */
    SqlModel.prototype.getRecursiveData = function (params, table, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var automaticConnectionRelease, primaryKey, whereClause, sql, metadata, key, result, record, _i, _a, relationship, relatedQuery, _b, result, fields, _c, fields_1, column, _d, _e, error_15, error_16;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        automaticConnectionRelease = true;
                        if (!connection) return [3 /*break*/, 1];
                        automaticConnectionRelease = false;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.pool.getConnection()];
                    case 2:
                        connection = _f.sent();
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 26, , 28]);
                        if (this._.isEmpty(table)) {
                            table = this.table;
                        }
                        return [4 /*yield*/, this.getTablePrimaryKey(table, connection)];
                    case 4:
                        primaryKey = _f.sent();
                        if (!this._.isEmpty(primaryKey)) return [3 /*break*/, 6];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not get the primary key for the table \"".concat(this.table, "\"!"))];
                    case 5: return [2 /*return*/, _f.sent()];
                    case 6:
                        whereClause = [];
                        sql = "SELECT * FROM ".concat(table, " WHERE ").concat(primaryKey, " = ?");
                        return [4 /*yield*/, this.fetchTableMetadata(table, connection)];
                    case 7:
                        metadata = _f.sent();
                        if (!this._.isObject(params)) return [3 /*break*/, 8];
                        for (key in params) {
                            if (Object.hasOwnProperty.call(params, key)) {
                                whereClause.push("".concat(key, " = ?"));
                            }
                        }
                        if (!this._.isEmpty(whereClause)) {
                            whereClause = whereClause.join(" AND ");
                            sql = "SELECT * FROM ".concat(table, " WHERE ").concat(whereClause, " ORDER BY ").concat(primaryKey, " ASC LIMIT 1;");
                            params = Object.values(params);
                        }
                        return [3 /*break*/, 12];
                    case 8:
                        if (!this._.isString(params)) return [3 /*break*/, 9];
                        params = this.mysql.escape(params);
                        sql = "SELECT * FROM ".concat(table, " WHERE ? ORDER BY ").concat(primaryKey, " ASC LIMIT 1;");
                        return [3 /*break*/, 12];
                    case 9:
                        if (!this._.isNumber(params)) return [3 /*break*/, 12];
                        if (!(this._.isEmpty(metadata.primaryKey) || this._.isEmpty(metadata.relationships))) return [3 /*break*/, 11];
                        sql = "SELECT * FROM ".concat(table, " WHERE ").concat(primaryKey, " = ? ORDER BY ").concat(primaryKey, " ASC LIMIT 1;");
                        return [4 /*yield*/, connection.query(sql, [params])];
                    case 10:
                        result = (_f.sent())[0];
                        if (this._.isArray(result)) {
                            if (automaticConnectionRelease) {
                                connection.release();
                            }
                            return [2 /*return*/, result[0]];
                        }
                        _f.label = 11;
                    case 11:
                        sql = "SELECT * FROM ".concat(table, " WHERE ").concat(metadata.primaryKey, " = ? ORDER BY ").concat(primaryKey, " ASC LIMIT 1");
                        _f.label = 12;
                    case 12: return [4 /*yield*/, connection.query(sql, [params])];
                    case 13:
                        record = (_f.sent())[0];
                        if (!(!this._.isEmpty(metadata.relationships) && !this._.isEmpty(record) && this._.isArray(record))) return [3 /*break*/, 22];
                        _i = 0, _a = metadata.relationships;
                        _f.label = 14;
                    case 14:
                        if (!(_i < _a.length)) return [3 /*break*/, 22];
                        relationship = _a[_i];
                        _f.label = 15;
                    case 15:
                        _f.trys.push([15, 19, , 21]);
                        relatedQuery = "\n\t\t\t\t\t\t\tSELECT *\n\t\t\t\t\t\t\tFROM ".concat(relationship.referenced_table, "\n\t\t\t\t\t\t\tWHERE ").concat(relationship.referenced_column, " = ?");
                        return [4 /*yield*/, connection.query(relatedQuery, [
                                record[0][relationship.foreign_key_column]
                            ])];
                    case 16:
                        _b = _f.sent(), result = _b[0], fields = _b[1];
                        if (!(!this._.isEmpty(result) &&
                            this._.isArray(result) &&
                            this._.isArray(fields) &&
                            !this._.isEmpty(fields))) return [3 /*break*/, 18];
                        for (_c = 0, fields_1 = fields; _c < fields_1.length; _c++) {
                            column = fields_1[_c];
                            if (column.flags === this.MYSQL_PRIMARY_KEY_FLAG) {
                                primaryKey = column.name;
                            }
                        }
                        _d = record[0];
                        _e = relationship.foreign_key_column;
                        return [4 /*yield*/, this.getRecursiveData(result[0][primaryKey], relationship.referenced_table, connection)];
                    case 17:
                        _d[_e] = _f.sent();
                        _f.label = 18;
                    case 18: return [3 /*break*/, 21];
                    case 19:
                        error_15 = _f.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not fetch recursive data for the table \"".concat(table, "\"! \n ").concat(error_15))];
                    case 20: return [2 /*return*/, _f.sent()];
                    case 21:
                        _i++;
                        return [3 /*break*/, 14];
                    case 22:
                        if (this._.isEmpty(metadata.primaryKey)) {
                            if (automaticConnectionRelease) {
                                connection.release();
                            }
                            return [2 /*return*/, {}];
                        }
                        if (!this._.isArray(record)) return [3 /*break*/, 23];
                        if (automaticConnectionRelease) {
                            connection.release();
                        }
                        return [2 /*return*/, record[0]];
                    case 23:
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Could not return the query because it is not an array!")];
                    case 24: return [2 /*return*/, _f.sent()];
                    case 25: return [3 /*break*/, 28];
                    case 26:
                        error_16 = _f.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not fetch recursive data for the tablesss \"".concat(table, "\"! \n ").concat(error_16))];
                    case 27: return [2 /*return*/, _f.sent()];
                    case 28: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function filterRecursiveData
     * @description filter multiple datarecords from the database and all it's relationships
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param table - name of the table
     * @returns {Promise<object>}
     */
    SqlModel.prototype.filterRecursiveData = function (connection, params, order, limit, table, isAll) {
        if (order === void 0) { order = "ASC"; }
        if (limit === void 0) { limit = ""; }
        if (isAll === void 0) { isAll = false; }
        return __awaiter(this, void 0, void 0, function () {
            var primaryKey, metadata, sql, descTable, validFields_1, conditions, filteredConditions, records, _i, records_1, record, _a, _b, relationship, _c, _d, error_17, error_18;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 19, , 21]);
                        if (this._.isEmpty(table)) {
                            table = this.table;
                        }
                        return [4 /*yield*/, this.getTablePrimaryKey(table, connection)];
                    case 1:
                        primaryKey = _e.sent();
                        if (!this._.isEmpty(primaryKey)) return [3 /*break*/, 3];
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not get the primary key for the table \"".concat(this.table, "\"!"))];
                    case 2: return [2 /*return*/, _e.sent()];
                    case 3: return [4 /*yield*/, this.fetchTableMetadata(table, connection)];
                    case 4:
                        metadata = _e.sent();
                        sql = "SELECT * FROM ".concat(table, " ORDER BY ").concat(primaryKey, " ").concat(order);
                        return [4 /*yield*/, this.describeTable(table, connection)];
                    case 5:
                        descTable = _e.sent();
                        validFields_1 = descTable.map(function (field) { return field.Field; });
                        if (this._.isString(params) && !isAll) {
                            conditions = params.split(/\s+(AND|OR)\s+/i);
                            filteredConditions = conditions
                                .map(function (condition) {
                                var match = condition.match(/^\s*(\w+)\s*(=|!=|<>|>|<|>=|<=|LIKE|ILIKE|NOT LIKE|IS NULL|IS NOT NULL|IN|NOT IN|BETWEEN)\s*(.*)$/i);
                                if (match) {
                                    var _1 = match[0], field = match[1], operator = match[2], value = match[3];
                                    if (validFields_1.includes(field.trim())) {
                                        if (operator.toUpperCase().includes("NULL")) {
                                            return "".concat(field, " ").concat(operator);
                                        }
                                        if (operator.toUpperCase() === "BETWEEN") {
                                            var betweenValues = value.split(/\s+AND\s+/i);
                                            if (betweenValues.length === 2) {
                                                return "".concat(field, " ").concat(operator, " ").concat(betweenValues[0], " AND ").concat(betweenValues[1]);
                                            }
                                            else {
                                                return "";
                                            }
                                        }
                                        if (operator.toUpperCase() === "IN" || operator.toUpperCase() === "NOT IN") {
                                            if (value.startsWith("(") && value.endsWith(")")) {
                                                return "".concat(field, " ").concat(operator, " ").concat(value);
                                            }
                                            else {
                                                return "";
                                            }
                                        }
                                        return "".concat(field, " ").concat(operator, " ").concat(value);
                                    }
                                }
                                return "";
                            })
                                .filter(Boolean);
                            params = filteredConditions.join(" AND ");
                            sql = "SELECT * FROM ".concat(table, " WHERE ").concat(params, " ORDER BY ").concat(primaryKey, " ").concat(order);
                        }
                        else if (this._.isNumber(params) && !isAll) {
                            sql = "SELECT * FROM ".concat(table, " WHERE ").concat(primaryKey, " = ? ORDER BY ").concat(primaryKey, " ").concat(order);
                        }
                        if (!this._.isNil(limit) && !this._.isEmpty() && !isAll) {
                            sql += " LIMIT ".concat(limit.toString(), ";");
                        }
                        return [4 /*yield*/, connection.query(sql, [params])];
                    case 6:
                        records = (_e.sent())[0];
                        if (!(this._.isArray(records) && !this._.isEmpty(records))) return [3 /*break*/, 15];
                        _i = 0, records_1 = records;
                        _e.label = 7;
                    case 7:
                        if (!(_i < records_1.length)) return [3 /*break*/, 15];
                        record = records_1[_i];
                        if (!(!this._.isEmpty(metadata.relationships) && !this._.isEmpty(record))) return [3 /*break*/, 14];
                        _a = 0, _b = metadata.relationships;
                        _e.label = 8;
                    case 8:
                        if (!(_a < _b.length)) return [3 /*break*/, 14];
                        relationship = _b[_a];
                        _e.label = 9;
                    case 9:
                        _e.trys.push([9, 11, , 13]);
                        _c = record;
                        _d = relationship.referenced_table;
                        return [4 /*yield*/, this.filterRecursiveData(connection, params, order, limit, relationship.referenced_table, isAll)];
                    case 10:
                        _c[_d] = _e.sent();
                        return [3 /*break*/, 13];
                    case 11:
                        error_17 = _e.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not fetch recursive data for the table \"".concat(table, "\"! \n ").concat(error_17))];
                    case 12: return [2 /*return*/, _e.sent()];
                    case 13:
                        _a++;
                        return [3 /*break*/, 8];
                    case 14:
                        _i++;
                        return [3 /*break*/, 7];
                    case 15:
                        if (!this._.isArray(records)) return [3 /*break*/, 16];
                        connection.release();
                        return [2 /*return*/, records[0]];
                    case 16:
                        connection.release();
                        return [4 /*yield*/, this.handleException(LogicException_1.default, "Could not return the query because it is not an array!")];
                    case 17: return [2 /*return*/, _e.sent()];
                    case 18: return [3 /*break*/, 21];
                    case 19:
                        error_18 = _e.sent();
                        connection.release();
                        return [4 /*yield*/, this.handleException(SQLException_1.default, "Could not fetch recursive data for the table \"".concat(table, "\"! \n ").concat(error_18))];
                    case 20: return [2 /*return*/, _e.sent()];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function escapeDatabaseName
     * @description return the table name with the database prefix
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param table - name of the table
     * @returns {Promise<string>}
     */
    SqlModel.prototype.escapeDatabaseName = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._.isEmpty(table)) {
                    return [2 /*return*/, ""];
                }
                return [2 /*return*/, this._.replace(table, /^.*\./, "")];
            });
        });
    };
    /**
     * @function parseSqlConditionString
     * @description Parses a SQL-like condition string (e.g., "id = 2 AND title = 'some title'")
     *              into an object where each key is a column name and each value is the condition.
     * @param {string} condition - The SQL-like condition string to parse.
     * @returns {object} - Returns an object with key-value pairs.
     */
    SqlModel.prototype.parseSqlConditionString = function (condition) {
        var conditionObject = {};
        var regex = /([a-zA-Z_]+)\s*(=|>|<|<=|>=|!=|LIKE|IN)\s*(['"]?[\w\s]*['"]?)/g;
        var match;
        while ((match = regex.exec(condition)) !== null) {
            var _2 = match[0], key = match[1], operator = match[2], value = match[3];
            var cleanedValue = value.replace(/['"]/g, "");
            conditionObject[key] = cleanedValue;
        }
        return conditionObject;
    };
    return SqlModel;
}());
exports.default = SqlModel;
