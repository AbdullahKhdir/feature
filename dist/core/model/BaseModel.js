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
var BadMethodCallException_1 = __importDefault(require("../exception/types/BadMethodCallException"));
var LogicException_1 = __importDefault(require("../exception/types/LogicException"));
var SQLException_1 = __importDefault(require("../exception/types/SQLException"));
var Singleton_1 = require("../Singleton/Singleton");
var helperFunctions_1 = __importDefault(require("../utils/helperFunctions"));
var QueryBuilder_1 = __importDefault(require("./QueryBuilder"));
module.exports = /** @class */ (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel() {
        var _this = _super.call(this) || this;
        //**************************************************************************
        //* QUERY Types (Comparing Constants)
        //**************************************************************************
        /** QUERY-Type "SELECT" */
        _this.QUERY_TYPE_SELECT = 1;
        /** QUERY-Type "INSERT" */
        _this.QUERY_TYPE_INSERT = 2;
        /** QUERY-Type "UPDATE" */
        _this.QUERY_TYPE_UPDATE = 3;
        /** QUERY-Type "DELETE" */
        _this.QUERY_TYPE_DELETE = 4;
        //**************************************************************************
        //* Restriction of the executable actions
        //**************************************************************************
        /**
        * Determines whether INSERT can be executed (can be overridden by inheritance)
        * @var bool
        */
        _this._can_create = false;
        /**
         * determines whether UPDATE can be executed (can be overridden by inheritance)
        * @var bool
        */
        _this._can_update = false;
        /**
        * determines whether DELETE can be executed (can be overridden by inheritance)
        * @var bool
        */
        _this._can_delete = false;
        //**************************************************************************
        // List data types
        //**************************************************************************
        /**
        * List of numeric data types
        * @var string[]
        */
        _this._numerical_types = ['float', 'double', 'tinyint', 'smallint', 'mediumint', 'int', 'bigint'];
        /**
        * List of integer data types
        * @var string[]
        */
        _this._integer_types = ['tinyint', 'smallint', 'mediumint', 'int', 'bigint'];
        /**
        * List of floating point data types
        * @var string[]
        */
        _this._floating_point_types = ['float', 'double', 'decimal'];
        /**
        * List of string data types
        * @var string[]
        */
        _this._string_types = ["char", "varchar", "text", 'mediumtext', 'longtext'];
        /**
        * List of markup data types
        * @var string[]
        */
        _this._markup_types = ['xml'];
        /**
        * All DateTime data types
        * @var string[]
        */
        _this._datetime_types = ['date', 'datetime', 'timestamp', 'time'];
        //**************************************************************************
        // Default-Formats
        //**************************************************************************
        /** @var string Default-Format for Date */
        _this.DEFAULT_DATE_FORMAT = 'd.m.Y';
        /** @var string Default format for a point in time */
        _this.DEFAULT_DATETIME_FORMAT = 'd.m.Y H:i';
        /** @var string Default format for a time */
        _this.DEFAULT_TIME_FORMAT = 'H:i';
        /** @var string Datetime-Format for ISO 8601 */
        _this.DATETIME_FORMAT_ISO_8601 = 'Y-m-d\TH:i:s';
        /**
        * Human-readable name (overridden by inheritance, available via getVerboseName, will be translated)
        * @var string|null
        */
        _this._verbose_name = null;
        /**
        * Not found code constant for mysql2
        * @var NOT_FOUND
        */
        _this.NOT_FOUND = -1;
        _this.parent = _this = _super.call(this) || this;
        _this.model = (0, helperFunctions_1.default)(_this.parent);
        _this.__mysql = _this.getDb();
        _this.db = Singleton_1.Singleton.getDb();
        return _this;
    }
    Object.defineProperty(BaseModel.prototype, "can_create", {
        /**
        * @method can_create
        * @description Getter can_create for the private property _can_create
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns bool
        */
        get: function () {
            return this._can_create;
        },
        /**
        * @method can_create
        * @description Setter can_create for the private property _can_create
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {Boolean} bool
        * @returns bool
        */
        set: function (bool) {
            if (bool !== true && bool !== false) {
                this._can_create;
            }
            this._can_create = bool;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "can_update", {
        /**
        * @method can_update
        * @description Getter _can_update for the private property _can_update
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns bool
        */
        get: function () {
            return this._can_update;
        },
        /**
        * @method _can_update
        * @description Setter _can_update for the private property _can_update
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {Boolean} bool
        * @returns bool
        */
        set: function (bool) {
            if (bool !== true && bool !== false) {
                this._can_update;
            }
            this._can_update = bool;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "can_delete", {
        /**
        * @method can_delete
        * @description Getter can_delete for the private property _can_delete
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns bool
        */
        get: function () {
            return this._can_delete;
        },
        /**
        * @method can_delete
        * @description Setter can_delete for the private property _can_delete
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {Boolean} bool
        * @returns bool
        */
        set: function (bool) {
            if (bool !== true && bool !== false) {
                this._can_delete;
            }
            this._can_delete = bool;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "table", {
        /**
        * @method table
        * @description Getter table for the private property _table
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns string
        */
        get: function () {
            return this.__table;
        },
        /**
        * @method table
        * @description Setter table for the private property _table
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {String} string
        * @returns string
        */
        set: function (string) {
            if (this.__.isEmpty(string)) {
                this.__table;
            }
            this.__table = string;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "primary_key", {
        /**
        * @method primary_key
        * @description Getter primary_key for the private property _primary_key
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns string|number
        */
        get: function () {
            return this._primary_key;
        },
        /**
        * @method primary_key
        * @description Setter primary_key for the private property _primary_key
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {String} id
        * @param {Number} id
        * @returns string|number
        */
        set: function (id) {
            if (this.__.isEmpty(id)) {
                this._primary_key;
            }
            this._primary_key = id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "verbose_name", {
        /**
        * @method verbose_name
        * @description Getter verbose_name for the private property _verbose_name
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns string
        */
        get: function () {
            return this._verbose_name;
        },
        /**
        * @method verbose_name
        * @description Setter verbose_name for the private property _verbose_name
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {String} string
        * @returns string
        */
        set: function (string) {
            if (this.__.isEmpty(string)) {
                this._verbose_name;
            }
            this._verbose_name = string;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "columns", {
        /**
        * @method columns
        * @description Getter columns for the private property _columns
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns object
        */
        get: function () {
            return this.__columns;
        },
        /**
        * @method columns
        * @description Setter columns for the private property _columns
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {Object} object
        * @returns string
        */
        set: function (object) {
            if (this.__.isEmpty(object)) {
                this.__columns;
            }
            if (typeof this.__columns === 'undefined') {
                this.__columns = object;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "reverse_references", {
        /**
        * @method reverse_references
        * @description Getter reverse_references for the private property _reverse_references
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns object
        */
        get: function () {
            return this._reverse_references;
        },
        /**
        * @method reverse_references
        * @description Setter reverse_references for the private property _reverse_references
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {Object} object
        * @returns string
        */
        set: function (object) {
            if (this.__.isEmpty(object)) {
                this._reverse_references;
            }
            this._reverse_references = object;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseModel.prototype, "generic_references", {
        /**
        * @method generic_references
        * @description Getter generic_references for the private property _generic_references
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @returns object
        // TODO: implement generic_references logic
        */
        get: function () {
            return this._generic_references;
        },
        /**
        * @method generic_references
        * @description Setter generic_references for the private property _generic_references
        * @version 1.0.0
        * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
        * @param {Object} object
        * @returns string
        // TODO: implement generic_references logic
        */
        set: function (object) {
            if (this.__.isEmpty(object)) {
                this._generic_references;
            }
            this._generic_references = object;
        },
        enumerable: false,
        configurable: true
    });
    //**************************************************************************
    // Protected functions
    //**************************************************************************
    /**
     * @function _validateTable
     * @description validates the table in the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns boolean
    */
    BaseModel.prototype._validateTable = function (table) {
        if (typeof this.table !== 'undefined') {
            return this.db.validateTable(table);
        }
        return Promise.reject(new Error('table does not exist in the database!'));
    };
    //**************************************************************************
    // DB functions
    //**************************************************************************
    /**
     * @function delete
     * @description deletes one data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param Number id
     * @param Object id
     * @returns Promise
    */
    BaseModel.prototype.delete = function (id, table) {
        var _this = this;
        if (table === void 0) { table = this.__table; }
        if (this.can_delete === true) {
            if (this.__.isString(id)) {
                id = +id;
            }
            if (this.__.isEmpty(table)) {
                return Promise.reject(new BadMethodCallException_1.default('Table must not be empty!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                    .then(function (result) {
                    if (!result) {
                        return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                    }
                    if (_this.__.isObject(id)) {
                        var where_clause = '';
                        for (var key in id) {
                            if (Object.hasOwnProperty.call(id, key)) {
                                // @ts-ignore
                                where_clause = where_clause + key + ' = ' + _this._mysql.escape(id[key]) + ' AND ';
                            }
                        }
                        if (_this.__.isString(where_clause) && !_this.__.isEmpty(where_clause)) {
                            var where_clause_length = where_clause.length;
                            where_clause = where_clause.substring(0, where_clause_length - 4);
                        }
                        where_clause = _this._mysql.escape(where_clause);
                        where_clause = where_clause.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                        return (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.db.executeModelQuery("DELETE FROM ".concat(table, " WHERE ?;"), id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })();
                    }
                    else if (_this.__.isNumber(id)) {
                        return (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.db.executeModelQuery("DELETE FROM ".concat(table, " WHERE ID = ?;"), id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })();
                    }
                    else {
                        return Promise.reject(new SQLException_1.default('Primary key must not be empty!'));
                    }
                })
                    .then(function (result) {
                    return result;
                })
                    .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
            }
        }
        else {
            return Promise.reject(new LogicException_1.default('User can not delete!'));
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function deleteAll
     * @description deletes all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
    */
    BaseModel.prototype.deleteAll = function (table) {
        var _this = this;
        if (table === void 0) { table = this.__table; }
        if (this.can_delete === true) {
            if (this.__.isEmpty(table)) {
                return Promise.reject(new BadMethodCallException_1.default('Table must not be empty!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                    .then(function (result) {
                    if (!result) {
                        return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                    }
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db.executeModelQuery("\n                            DELETE \n                            FROM ".concat(table, " \n                            ORDER BY ID ASC\n                            "))];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                })
                    .then(function (result) {
                    return result;
                })
                    .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
            }
        }
        else {
            return Promise.reject(new LogicException_1.default('User can not delete!'));
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function filter
     * @description filters data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Object} sql_query
     * @param {String} limit
     * @param {String} table
     * @returns Promise
    */
    BaseModel.prototype.filter = function (sql_query, limit, table) {
        var _this = this;
        if (sql_query === void 0) { sql_query = null; }
        if (limit === void 0) { limit = null; }
        if (table === void 0) { table = this.__table; }
        if (this.__.isEmpty(table)) {
            return Promise.reject(new BadMethodCallException_1.default('Table must not be empty!'));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
                .then(function (result) {
                if (!result) {
                    return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                }
                if (_this.__.isEmpty(sql_query) || sql_query == null || typeof sql_query === 'undefined') {
                    return _this.all(table);
                }
                if (_this.__.isObject(sql_query) && _this.__.isEmpty(table) === false) {
                    var where_clause_1 = '';
                    for (var key in sql_query) {
                        if (Object.hasOwnProperty.call(sql_query, key)) {
                            // @ts-ignore
                            where_clause_1 = where_clause_1 + key + ' = ' + _this._mysql.escape(sql_query[key]) + ' AND ';
                        }
                    }
                    if (_this.__.isString(where_clause_1) && !_this.__.isEmpty(where_clause_1)) {
                        var where_clause_length = where_clause_1.length;
                        where_clause_1 = where_clause_1.substring(0, where_clause_length - 4);
                    }
                    where_clause_1 = _this._mysql.escape(where_clause_1);
                    where_clause_1 = where_clause_1.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        var sql, _limit;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sql = "SELECT * FROM ".concat(table, " WHERE ").concat(where_clause_1, " ORDER BY ID ASC");
                                    if (limit != null && !this.__.isNaN(limit)) {
                                        _limit = " LIMIT ".concat(limit.toString());
                                        sql += _limit;
                                    }
                                    console.log(sql);
                                    return [4 /*yield*/, this.db.executeModelQuery(sql)
                                            .then(function (_a) {
                                            var rows = _a[0], fields = _a[1];
                                            if (!_this.__.isEmpty(rows)) {
                                                var _loop_1 = function (key) {
                                                    // @ts-ignore 
                                                    rows['reverse_table_name'] = table;
                                                    var column_name = key;
                                                    if (typeof _this.columns[column_name].references !== 'undefined') {
                                                        var is_constraint_1 = _this.columns[column_name].references;
                                                        var constraint_table_1 = _this.columns[column_name].references.table;
                                                        if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                            // @ts-ignore 
                                                            rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                var _this = this;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = is_constraint_1.name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_1, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                                    .then(function (_a) {
                                                                                    var rows = _a[0], fields = _a[1];
                                                                                    return rows;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(_this.columns[column_name].references.column, "\" does not exist in table \"").concat(constraint_table_1, "\"! \n Error: ").concat(err))); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        }
                                                        else {
                                                            // @ts-ignore 
                                                            rows[column_name] = _this.getTablePrimaryKey(constraint_table_1)
                                                                // @ts-ignore 
                                                                .then(function (id) {
                                                                return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    var _b;
                                                                    return __generator(this, function (_c) {
                                                                        switch (_c.label) {
                                                                            case 0:
                                                                                _b = {};
                                                                                _a = is_constraint_1.name;
                                                                                return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_1, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                        .then(function (_a) {
                                                                                        var rows = _a[0], fields = _a[1];
                                                                                        return rows;
                                                                                    })
                                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(id, "\" does not exist in table \"").concat(constraint_table_1, "\"! \n Error: ").concat(err))); })];
                                                                            case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                    _b)];
                                                                        }
                                                                    });
                                                                }); })();
                                                            })
                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                        }
                                                    }
                                                };
                                                for (var key in _this.columns) {
                                                    _loop_1(key);
                                                }
                                                return rows;
                                            }
                                        })
                                            .then(function (rows) {
                                            if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                                var _loop_2 = function (key) {
                                                    var reverse_table = _this.reverse_references[key].table;
                                                    var reverse_col = _this.reverse_references[key].column;
                                                    var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                        _this.reverse_references[key].setting.where_column : '';
                                                    var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                        _this.reverse_references[key].setting.where_table : '';
                                                    var reverse_name = key;
                                                    if (typeof rows !== 'undefined') {
                                                        // @ts-ignore 
                                                        rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                            // @ts-ignore 
                                                            .then(function (id) {
                                                            // @ts-ignore 
                                                            if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                                // @ts-ignore 
                                                                if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                                    return _this.getTablePrimaryKey(where_tbl)
                                                                        .then(function (_id) {
                                                                        var _statement = where_tbl && where_col && reverse_table ?
                                                                            'SELECT * FROM ' + reverse_table + ' ' +
                                                                                'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                                'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                                // @ts-ignore 
                                                                                'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                                ')' : '';
                                                                        return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                            var _a;
                                                                            var _b;
                                                                            return __generator(this, function (_c) {
                                                                                switch (_c.label) {
                                                                                    case 0:
                                                                                        _b = {};
                                                                                        _a = reverse_name;
                                                                                        return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                                .then(function (_a) {
                                                                                                var results = _a[0], fields = _a[1];
                                                                                                return results;
                                                                                            })
                                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                            _b)];
                                                                                }
                                                                            });
                                                                        }); })();
                                                                    })
                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                                }
                                                            }
                                                            else {
                                                                return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    var _b;
                                                                    return __generator(this, function (_c) {
                                                                        switch (_c.label) {
                                                                            case 0:
                                                                                _b = {};
                                                                                _a = reverse_name;
                                                                                return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                        .then(function (_a) {
                                                                                        var results = _a[0], fields = _a[1];
                                                                                        return results;
                                                                                    })
                                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                            case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                    _b)];
                                                                        }
                                                                    });
                                                                }); })();
                                                            }
                                                        })
                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                    }
                                                    else {
                                                        return "continue";
                                                    }
                                                };
                                                for (var key in _this.reverse_references) {
                                                    _loop_2(key);
                                                }
                                            }
                                            return rows;
                                        })
                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
                if (_this.__.isString(sql_query) && !_this.__.isEmpty(table)) {
                    // @ts-ignore
                    sql_query = _this._mysql.escape(sql_query).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    var sql_1 = "SELECT * FROM ".concat(table, " WHERE ").concat(sql_query, " ORDER BY ID ASC");
                    if (limit != null && !_this.__.isNaN(limit)) {
                        var _limit = " LIMIT ".concat(limit.toString());
                        sql_1 += _limit;
                    }
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db.executeModelQuery(sql_1)
                                        .then(function (_a) {
                                        var rows = _a[0], fields = _a[1];
                                        if (!_this.__.isEmpty(rows)) {
                                            var _loop_3 = function (key) {
                                                // @ts-ignore 
                                                rows['reverse_table_name'] = table;
                                                var column_name = key;
                                                var is_constraint = _this.columns[column_name].references;
                                                if (typeof is_constraint !== 'undefined') {
                                                    var constraint_table_2 = _this.columns[column_name].references.table;
                                                    if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                        // @ts-ignore 
                                                        rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a;
                                                            var _b;
                                                            var _this = this;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = {};
                                                                        _a = is_constraint.name;
                                                                        return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_2, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                                .then(function (_a) {
                                                                                var rows = _a[0], fields = _a[1];
                                                                                return rows;
                                                                            })
                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(_this.columns[column_name].references.column, "\" does not exist in table \"").concat(constraint_table_2, "\"! \n Error: ").concat(err))); })];
                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                            _b)];
                                                                }
                                                            });
                                                        }); })();
                                                    }
                                                    else {
                                                        // @ts-ignore 
                                                        rows[column_name] = _this.getTablePrimaryKey(constraint_table_2)
                                                            .then(function (id) {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = is_constraint.name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_2, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                    .then(function (_a) {
                                                                                    var rows = _a[0], fields = _a[1];
                                                                                    return rows;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        })
                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                    }
                                                }
                                            };
                                            for (var key in _this.columns) {
                                                _loop_3(key);
                                            }
                                            return rows;
                                        }
                                    })
                                        .then(function (rows) {
                                        if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                            var _loop_4 = function (key) {
                                                var reverse_table = _this.reverse_references[key].table;
                                                var reverse_col = _this.reverse_references[key].column;
                                                var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_column : '';
                                                var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_table : '';
                                                var reverse_name = key;
                                                if (typeof rows !== 'undefined') {
                                                    // @ts-ignore 
                                                    rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                        .then(function (id) {
                                                        if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                            // @ts-ignore 
                                                            if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                                return _this.getTablePrimaryKey(where_tbl)
                                                                    .then(function (_id) {
                                                                    var _statement = where_tbl && where_col && reverse_table ?
                                                                        'SELECT * FROM ' + reverse_table + ' ' +
                                                                            'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                            'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                            // @ts-ignore 
                                                                            'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                            ')' : '';
                                                                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                        var _a;
                                                                        var _b;
                                                                        return __generator(this, function (_c) {
                                                                            switch (_c.label) {
                                                                                case 0:
                                                                                    _b = {};
                                                                                    _a = reverse_name;
                                                                                    return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                            .then(function (_a) {
                                                                                            var results = _a[0], fields = _a[1];
                                                                                            return results;
                                                                                        })
                                                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                                case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                        _b)];
                                                                            }
                                                                        });
                                                                    }); })();
                                                                })
                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                            }
                                                        }
                                                        else {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = reverse_name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                    .then(function (_a) {
                                                                                    var results = _a[0], fields = _a[1];
                                                                                    return results;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        }
                                                    })
                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                }
                                                else {
                                                    return "continue";
                                                }
                                            };
                                            for (var key in _this.reverse_references) {
                                                _loop_4(key);
                                            }
                                        }
                                        return rows;
                                    })
                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
                if (!_this.__.isNaN(sql_query) && _this.__.isString(sql_query)) {
                    sql_query = +sql_query;
                }
                if (!_this.__.isNaN(sql_query) && _this.__.isEmpty(table) === false) {
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        var sql, _limit;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sql = "SELECT * FROM ".concat(table, " where id = ? ORDER BY ID ASC");
                                    if (limit != null && !this.__.isNaN(limit)) {
                                        _limit = " LIMIT ".concat(limit.toString());
                                        sql += _limit;
                                    }
                                    return [4 /*yield*/, this.db.executeModelQuery(sql, [sql_query])
                                            .then(function (_a) {
                                            var rows = _a[0], fields = _a[1];
                                            if (!_this.__.isEmpty(rows)) {
                                                var _loop_5 = function (key) {
                                                    // @ts-ignore 
                                                    rows['reverse_table_name'] = table;
                                                    var column_name = key;
                                                    var is_constraint = _this.columns[column_name].references;
                                                    if (typeof is_constraint !== 'undefined') {
                                                        var constraint_table_3 = _this.columns[column_name].references.table;
                                                        if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                            // @ts-ignore 
                                                            rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                var _this = this;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = is_constraint.name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_3, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                                    .then(function (_a) {
                                                                                    var rows = _a[0], fields = _a[1];
                                                                                    return rows;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(_this.columns[column_name].references.column, "\" does not exist in table \"").concat(constraint_table_3, "\"! \n Error: ").concat(err))); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        }
                                                        else {
                                                            // @ts-ignore 
                                                            rows[column_name] = _this.getTablePrimaryKey(constraint_table_3)
                                                                .then(function (id) {
                                                                return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    var _b;
                                                                    return __generator(this, function (_c) {
                                                                        switch (_c.label) {
                                                                            case 0:
                                                                                _b = {};
                                                                                _a = is_constraint.name;
                                                                                return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_3, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                        .then(function (_a) {
                                                                                        var rows = _a[0], fields = _a[1];
                                                                                        return rows;
                                                                                    })
                                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                            case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                    _b)];
                                                                        }
                                                                    });
                                                                }); })();
                                                            })
                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                        }
                                                    }
                                                };
                                                for (var key in _this.columns) {
                                                    _loop_5(key);
                                                }
                                                return rows;
                                            }
                                        })
                                            .then(function (rows) {
                                            if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                                var _loop_6 = function (key) {
                                                    var reverse_table = _this.reverse_references[key].table;
                                                    var reverse_col = _this.reverse_references[key].column;
                                                    var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                        _this.reverse_references[key].setting.where_column : '';
                                                    var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                        _this.reverse_references[key].setting.where_table : '';
                                                    var reverse_name = key;
                                                    if (typeof rows !== 'undefined') {
                                                        // @ts-ignore 
                                                        rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                            .then(function (id) {
                                                            if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                                // @ts-ignore 
                                                                if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                                    return _this.getTablePrimaryKey(where_tbl)
                                                                        .then(function (_id) {
                                                                        var _statement = where_tbl && where_col && reverse_table ?
                                                                            'SELECT * FROM ' + reverse_table + ' ' +
                                                                                'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                                'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                                // @ts-ignore 
                                                                                'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                                ')' : '';
                                                                        return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                            var _a;
                                                                            var _b;
                                                                            return __generator(this, function (_c) {
                                                                                switch (_c.label) {
                                                                                    case 0:
                                                                                        _b = {};
                                                                                        _a = reverse_name;
                                                                                        return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                                .then(function (_a) {
                                                                                                var results = _a[0], fields = _a[1];
                                                                                                return results;
                                                                                            })
                                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                            _b)];
                                                                                }
                                                                            });
                                                                        }); })();
                                                                    })
                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                                }
                                                            }
                                                            else {
                                                                return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    var _b;
                                                                    return __generator(this, function (_c) {
                                                                        switch (_c.label) {
                                                                            case 0:
                                                                                _b = {};
                                                                                _a = reverse_name;
                                                                                return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                        .then(function (_a) {
                                                                                        var results = _a[0], fields = _a[1];
                                                                                        return results;
                                                                                    })
                                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                            case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                    _b)];
                                                                        }
                                                                    });
                                                                }); })();
                                                            }
                                                        })
                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                    }
                                                    else {
                                                        return "continue";
                                                    }
                                                };
                                                for (var key in _this.reverse_references) {
                                                    _loop_6(key);
                                                }
                                            }
                                            return rows;
                                        })
                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
            })
                .then(function (rows) {
                return rows;
            })
                .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function get
     * @description gets only one data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Object} sql_query
     * @returns Promise
    */
    BaseModel.prototype.get = function (sql_query, table) {
        var _this = this;
        if (table === void 0) { table = this.__table; }
        // if (this.model) {
        //     var _model = Singleton.getModel(this.model.toString())
        //     // console.log(_model._columns);
        //     // console.log(this._columns);
        //     this.columns = _model._columns;
        //     // console.log(this.columns);
        // }
        if (this.__.isEmpty(table)) {
            return Promise.reject(new BadMethodCallException_1.default('Table must not be empty!'));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
                .then(function (result) {
                if (!result) {
                    return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                }
                if (_this.__.isObject(sql_query) && _this.__.isEmpty(table) === false) {
                    var where_clause_2 = '';
                    for (var key in sql_query) {
                        if (Object.hasOwnProperty.call(sql_query, key)) {
                            // @ts-ignore 
                            where_clause_2 = where_clause_2 + key + ' = ' + _this._mysql.escape(sql_query[key]) + ' AND ';
                        }
                    }
                    if (_this.__.isString(where_clause_2) && !_this.__.isEmpty(where_clause_2)) {
                        var where_clause_length = where_clause_2.length;
                        where_clause_2 = where_clause_2.substring(0, where_clause_length - 4);
                    }
                    where_clause_2 = _this._mysql.escape(where_clause_2);
                    where_clause_2 = where_clause_2.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(table, " WHERE ").concat(where_clause_2, " ORDER BY ID ASC LIMIT 1"))
                                        .then(function (_a) {
                                        var rows = _a[0], fields = _a[1];
                                        if (!_this.__.isEmpty(rows)) {
                                            var _loop_7 = function (key) {
                                                // @ts-ignore 
                                                rows['reverse_table_name'] = table;
                                                var column_name = key;
                                                var is_constraint = _this.columns[column_name].references;
                                                if (typeof is_constraint !== 'undefined') {
                                                    var constraint_table_4 = _this.columns[column_name].references.table;
                                                    if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                        // @ts-ignore 
                                                        rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a;
                                                            var _b;
                                                            var _this = this;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = {};
                                                                        _a = is_constraint.name;
                                                                        return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_4, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                                .then(function (_a) {
                                                                                var rows = _a[0], fields = _a[1];
                                                                                return rows;
                                                                            })
                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(_this.columns[column_name].references.column, "\" does not exist in table \"").concat(constraint_table_4, "\"! \n Error: ").concat(err))); })];
                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                            _b)];
                                                                }
                                                            });
                                                        }); })();
                                                    }
                                                    else {
                                                        // @ts-ignore 
                                                        rows[column_name] = _this.getTablePrimaryKey(constraint_table_4)
                                                            .then(function (id) {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = is_constraint.name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_4, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                    .then(function (_a) {
                                                                                    var rows = _a[0], fields = _a[1];
                                                                                    return rows;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        })
                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                    }
                                                }
                                            };
                                            for (var key in _this.columns) {
                                                _loop_7(key);
                                            }
                                            return rows;
                                        }
                                    })
                                        .then(function (rows) {
                                        if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                            var _loop_8 = function (key) {
                                                var reverse_table = _this.reverse_references[key].table;
                                                var reverse_col = _this.reverse_references[key].column;
                                                var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_column : '';
                                                var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_table : '';
                                                var reverse_name = key;
                                                if (typeof rows !== 'undefined') {
                                                    // @ts-ignore 
                                                    rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                        .then(function (id) {
                                                        if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                            // @ts-ignore 
                                                            if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                                return _this.getTablePrimaryKey(where_tbl)
                                                                    .then(function (_id) {
                                                                    var _statement = where_tbl && where_col && reverse_table ?
                                                                        'SELECT * FROM ' + reverse_table + ' ' +
                                                                            'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                            'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                            // @ts-ignore 
                                                                            'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                            ')' : '';
                                                                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                        var _a;
                                                                        var _b;
                                                                        return __generator(this, function (_c) {
                                                                            switch (_c.label) {
                                                                                case 0:
                                                                                    _b = {};
                                                                                    _a = reverse_name;
                                                                                    return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                            .then(function (_a) {
                                                                                            var results = _a[0], fields = _a[1];
                                                                                            return results;
                                                                                        })
                                                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                                case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                        _b)];
                                                                            }
                                                                        });
                                                                    }); })();
                                                                })
                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                            }
                                                        }
                                                        else {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = reverse_name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                    .then(function (_a) {
                                                                                    var results = _a[0], fields = _a[1];
                                                                                    return results;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        }
                                                    })
                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                }
                                                else {
                                                    return "continue";
                                                }
                                            };
                                            for (var key in _this.reverse_references) {
                                                _loop_8(key);
                                            }
                                        }
                                        return rows;
                                    })
                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
                if (_this.__.isString(sql_query) && !_this.__.isEmpty(table) && _this.__.isNaN(sql_query)) {
                    sql_query = _this._mysql.escape(sql_query);
                    sql_query = sql_query.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db.executeModelQuery("\n                            SELECT * \n                            FROM ".concat(table, " \n                            where ").concat(sql_query, "\n                            ORDER BY ID ASC LIMIT 1\n                            "))
                                        .then(function (_a) {
                                        var rows = _a[0], fields = _a[1];
                                        if (!_this.__.isEmpty(rows)) {
                                            var _loop_9 = function (key) {
                                                // @ts-ignore 
                                                rows['reverse_table_name'] = table;
                                                var column_name = key;
                                                var is_constraint = _this.columns[column_name].references;
                                                if (typeof is_constraint !== 'undefined') {
                                                    var constraint_table_5 = _this.columns[column_name].references.table;
                                                    if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                        // @ts-ignore 
                                                        rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a;
                                                            var _b;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = {};
                                                                        _a = is_constraint.name;
                                                                        return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_5, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                                .then(function (_a) {
                                                                                var rows = _a[0], fields = _a[1];
                                                                                return rows;
                                                                            })
                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                            _b)];
                                                                }
                                                            });
                                                        }); })();
                                                    }
                                                    else {
                                                        // @ts-ignore 
                                                        rows[column_name] = _this.getTablePrimaryKey(constraint_table_5)
                                                            .then(function (id) {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = is_constraint.name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_5, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                    .then(function (_a) {
                                                                                    var rows = _a[0], fields = _a[1];
                                                                                    return rows;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        })
                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                    }
                                                }
                                            };
                                            for (var key in _this.columns) {
                                                _loop_9(key);
                                            }
                                            return rows;
                                        }
                                    })
                                        .then(function (rows) {
                                        if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                            var _loop_10 = function (key) {
                                                var reverse_table = _this.reverse_references[key].table;
                                                var reverse_col = _this.reverse_references[key].column;
                                                var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_column : '';
                                                var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_table : '';
                                                var reverse_name = key;
                                                if (typeof rows !== 'undefined') {
                                                    // @ts-ignore 
                                                    rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                        .then(function (id) {
                                                        // @ts-ignore 
                                                        if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                            // @ts-ignore 
                                                            if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                                return _this.getTablePrimaryKey(where_tbl)
                                                                    .then(function (_id) {
                                                                    var _statement = where_tbl && where_col && reverse_table ?
                                                                        'SELECT * FROM ' + reverse_table + ' ' +
                                                                            'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                            'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                            // @ts-ignore 
                                                                            'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                            ')' : '';
                                                                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                        var _a;
                                                                        var _b;
                                                                        return __generator(this, function (_c) {
                                                                            switch (_c.label) {
                                                                                case 0:
                                                                                    _b = {};
                                                                                    _a = reverse_name;
                                                                                    return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                            .then(function (_a) {
                                                                                            var results = _a[0], fields = _a[1];
                                                                                            return results;
                                                                                        })
                                                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                                case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                        _b)];
                                                                            }
                                                                        });
                                                                    }); })();
                                                                })
                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                            }
                                                        }
                                                        else {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = reverse_name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                    .then(function (_a) {
                                                                                    var results = _a[0], fields = _a[1];
                                                                                    return results;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        }
                                                    })
                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                }
                                                else {
                                                    return "continue";
                                                }
                                            };
                                            for (var key in _this.reverse_references) {
                                                _loop_10(key);
                                            }
                                        }
                                        return rows;
                                    })
                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
                if (!_this.__.isNaN(sql_query) && _this.__.isString(sql_query)) {
                    sql_query = +sql_query;
                }
                if (!_this.__.isNaN(sql_query) && _this.__.isEmpty(table) === false) {
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db.executeModelQuery("\n                                SELECT * \n                                FROM ".concat(table, " \n                                where id = ?\n                                ORDER BY ID ASC LIMIT 1\n                            "), [sql_query])
                                        .then(function (_a) {
                                        var rows = _a[0], fields = _a[1];
                                        if (!_this.__.isEmpty(rows)) {
                                            var _loop_11 = function (key) {
                                                // @ts-ignore 
                                                rows['reverse_table_name'] = table;
                                                var column_name = key;
                                                var is_constraint = _this.columns[column_name].references;
                                                if (typeof is_constraint !== 'undefined') {
                                                    var constraint_table_6 = _this.columns[column_name].references.table;
                                                    if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                        // @ts-ignore 
                                                        rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a;
                                                            var _b;
                                                            var _this = this;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = {};
                                                                        _a = is_constraint.name;
                                                                        return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_6, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                                .then(function (_a) {
                                                                                var rows = _a[0], fields = _a[1];
                                                                                return rows;
                                                                            })
                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(_this.columns[column_name].references.column, "\" does not exist in table \"").concat(constraint_table_6, "\"! \n Error: ").concat(err))); })];
                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                            _b)];
                                                                }
                                                            });
                                                        }); })();
                                                    }
                                                    else {
                                                        // @ts-ignore 
                                                        rows[column_name] = _this.getTablePrimaryKey(constraint_table_6)
                                                            .then(function (id) {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = is_constraint.name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_6, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                    .then(function (_a) {
                                                                                    var rows = _a[0], fields = _a[1];
                                                                                    return rows;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        })
                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                    }
                                                }
                                            };
                                            for (var key in _this.columns) {
                                                _loop_11(key);
                                            }
                                            return rows;
                                        }
                                    })
                                        .then(function (rows) {
                                        if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                            var _loop_12 = function (key) {
                                                var reverse_table = _this.reverse_references[key].table;
                                                var reverse_col = _this.reverse_references[key].column;
                                                var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_column : '';
                                                var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                    _this.reverse_references[key].setting.where_table : '';
                                                var reverse_name = key;
                                                if (typeof rows !== 'undefined') {
                                                    // @ts-ignore 
                                                    rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                        .then(function (id) {
                                                        if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                            // @ts-ignore 
                                                            if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                                return _this.getTablePrimaryKey(where_tbl)
                                                                    .then(function (_id) {
                                                                    var _statement = where_tbl && where_col && reverse_table ?
                                                                        'SELECT * FROM ' + reverse_table + ' ' +
                                                                            'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                            'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                            // @ts-ignore 
                                                                            'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                            ')' : '';
                                                                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                        var _a;
                                                                        var _b;
                                                                        return __generator(this, function (_c) {
                                                                            switch (_c.label) {
                                                                                case 0:
                                                                                    _b = {};
                                                                                    _a = reverse_name;
                                                                                    return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                            .then(function (_a) {
                                                                                            var results = _a[0], fields = _a[1];
                                                                                            return results;
                                                                                        })
                                                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                                case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                        _b)];
                                                                            }
                                                                        });
                                                                    }); })();
                                                                }).catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                            }
                                                        }
                                                        else {
                                                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                var _a;
                                                                var _b;
                                                                return __generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            _b = {};
                                                                            _a = reverse_name;
                                                                            return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                    .then(function (_a) {
                                                                                    var results = _a[0], fields = _a[1];
                                                                                    return results;
                                                                                })
                                                                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                        case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                _b)];
                                                                    }
                                                                });
                                                            }); })();
                                                        }
                                                    }).catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                }
                                                else {
                                                    return "continue";
                                                }
                                            };
                                            for (var key in _this.reverse_references) {
                                                _loop_12(key);
                                            }
                                        }
                                        return rows;
                                    })
                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
            })
                .then(function (result) {
                return result;
            })
                .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function all
     * @description gets all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
    */
    BaseModel.prototype.all = function (table) {
        var _this = this;
        if (table === void 0) { table = this.__table; }
        if (this.__.isEmpty(table) && !this.__.isString(table)) {
            return Promise.reject(new BadMethodCallException_1.default('Table must not be empty!'));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
                .then(function (result) {
                if (!result) {
                    return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                }
                return (function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.db.executeModelQuery("\n                    SELECT * \n                    FROM ".concat(table, " \n                    ORDER BY ID ASC\n                    "))
                                    .then(function (_a) {
                                    var rows = _a[0], fields = _a[1];
                                    if (!_this.__.isEmpty(rows)) {
                                        var _loop_13 = function (key) {
                                            // @ts-ignore 
                                            rows['reverse_table_name'] = table;
                                            var column_name = key;
                                            var is_constraint = _this.columns[column_name].references;
                                            if (typeof is_constraint !== 'undefined') {
                                                var constraint_table_7 = _this.columns[column_name].references.table;
                                                if (typeof _this.columns[column_name].references.column !== 'undefined') {
                                                    // @ts-ignore 
                                                    rows[column_name] = (function () { return __awaiter(_this, void 0, void 0, function () {
                                                        var _a;
                                                        var _b;
                                                        var _this = this;
                                                        return __generator(this, function (_c) {
                                                            switch (_c.label) {
                                                                case 0:
                                                                    _b = {};
                                                                    _a = is_constraint.name;
                                                                    return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_7, " where ").concat(this.columns[column_name].references.column, " = '").concat(rows[0][column_name], "'"))
                                                                            .then(function (_a) {
                                                                            var rows = _a[0], fields = _a[1];
                                                                            return rows;
                                                                        })
                                                                            .catch(function (err) { return Promise.reject(new SQLException_1.default("Column \"".concat(_this.columns[column_name].references.column, "\" does not exist in table \"").concat(constraint_table_7, "\"! \n Error: ").concat(err))); })];
                                                                case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                        _b)];
                                                            }
                                                        });
                                                    }); })();
                                                }
                                                else {
                                                    // @ts-ignore 
                                                    rows[column_name] = _this.getTablePrimaryKey(constraint_table_7)
                                                        .then(function (id) {
                                                        return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a;
                                                            var _b;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = {};
                                                                        _a = is_constraint.name;
                                                                        return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(constraint_table_7, " where ").concat(id, " = '").concat(rows[0][column_name], "'"))
                                                                                .then(function (_a) {
                                                                                var rows = _a[0], fields = _a[1];
                                                                                return rows;
                                                                            })
                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                            _b)];
                                                                }
                                                            });
                                                        }); })();
                                                    }).catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                }
                                            }
                                        };
                                        for (var key in _this.columns) {
                                            _loop_13(key);
                                        }
                                        return rows;
                                    }
                                })
                                    .then(function (rows) {
                                    if (typeof _this.reverse_references === 'object' && typeof _this.reverse_references !== 'undefined') {
                                        var _loop_14 = function (key) {
                                            var reverse_table = _this.reverse_references[key].table;
                                            var reverse_col = _this.reverse_references[key].column;
                                            var where_col = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                _this.reverse_references[key].setting.where_column : '';
                                            var where_tbl = typeof _this.reverse_references[key].setting !== 'undefined' ?
                                                _this.reverse_references[key].setting.where_table : '';
                                            var reverse_name = key;
                                            if (typeof rows !== 'undefined') {
                                                // @ts-ignore 
                                                rows[reverse_name] = _this.getTablePrimaryKey(reverse_table)
                                                    .then(function (id) {
                                                    if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                        // @ts-ignore 
                                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !_this.__.isEmpty(typeof rows[0][where_col])) {
                                                            return _this.getTablePrimaryKey(where_tbl)
                                                                .then(function (_id) {
                                                                var _statement = where_tbl && where_col && reverse_table ?
                                                                    'SELECT * FROM ' + reverse_table + ' ' +
                                                                        'WHERE ' + reverse_table + '.' + reverse_col + ' IN (' +
                                                                        'SELECT ' + _id + ' FROM ' + where_tbl + ' ' +
                                                                        // @ts-ignore 
                                                                        'WHERE ' + where_col + ' = ' + rows[0][where_col] + ' ' +
                                                                        ')' : '';
                                                                return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    var _b;
                                                                    return __generator(this, function (_c) {
                                                                        switch (_c.label) {
                                                                            case 0:
                                                                                _b = {};
                                                                                _a = reverse_name;
                                                                                return [4 /*yield*/, this.db.executeModelQuery(_statement)
                                                                                        .then(function (_a) {
                                                                                        var results = _a[0], fields = _a[1];
                                                                                        return results;
                                                                                    })
                                                                                        .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                            case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                                    _b)];
                                                                        }
                                                                    });
                                                                }); })();
                                                            }).catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                                        }
                                                    }
                                                    else {
                                                        return (function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a;
                                                            var _b;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = {};
                                                                        _a = reverse_name;
                                                                        return [4 /*yield*/, this.db.executeModelQuery("SELECT * FROM ".concat(reverse_table))
                                                                                .then(function (_a) {
                                                                                var results = _a[0], fields = _a[1];
                                                                                return results;
                                                                            })
                                                                                .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                                                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                                                            _b)];
                                                                }
                                                            });
                                                        }); })();
                                                    }
                                                }).catch(function (err) { return Promise.reject(new SQLException_1.default(err)); });
                                            }
                                            else {
                                                return "continue";
                                            }
                                        };
                                        for (var key in _this.reverse_references) {
                                            _loop_14(key);
                                        }
                                    }
                                    return rows;
                                })
                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); })();
            })
                .then(function (result) {
                return result;
            })
                .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function create
     * @description create a data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Object} values
     * @returns Promise
    */
    BaseModel.prototype.create = function (values, table) {
        var _this = this;
        if (table === void 0) { table = this.__table; }
        if (this.can_create === true) {
            if (this.__.isEmpty(table) && !this.__.isString(table)) {
                return Promise.reject(new BadMethodCallException_1.default('Table must not be empty!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                    .then(function (result) {
                    if (!result) {
                        return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                    }
                    if (!_this.__.isObject(values) || _this.__.isEmpty(values)) {
                        return Promise.reject(new SQLException_1.default('No columns neither values are specified!'));
                    }
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db.executeModelQuery("INSERT INTO ".concat(table, " SET ?;"), values)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                })
                    .then(function (result) {
                    return result;
                })
                    .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
            }
        }
        else {
            return Promise.reject(new LogicException_1.default('User can not create!'));
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function update
     * @description updates data record(s)
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Array} values
     * @param {Object} where
     * @returns Promise
    */
    BaseModel.prototype.update = function (values, where, table) {
        var _this = this;
        if (where === void 0) { where = null; }
        if (table === void 0) { table = this.__table; }
        if (this.can_delete === true) {
            if (this.__.isEmpty(table) && !this.__.isString(table)) {
                return Promise.reject(new BadMethodCallException_1.default('No columns neither values are specified!'));
            }
            if (!this.__.isObject(values) || this.__.isEmpty(values)) {
                return Promise.reject(new SQLException_1.default('No columns neither values are specified!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                    .then(function (result) {
                    if (!result) {
                        return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                    }
                    if (where !== null && typeof where !== 'undefined') {
                        if (_this.__.isObject(where)) {
                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.db.executeModelQuery("UPDATE ".concat(table, " SET ? where ? ;"), [values, where])];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })();
                        }
                        else if (!_this.__.isNaN(where)) {
                            // @ts-ignore 
                            where = +where;
                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.db.executeModelQuery("UPDATE ".concat(table, " SET ? where id = ? ;"), [values, where])];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })();
                        }
                        else {
                            // @ts-ignore 
                            where = _this.escapeValue(where);
                            return (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.db.executeModelQuery("UPDATE ".concat(table, " SET ? where id = ? ;"), [values, where])];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })();
                        }
                    }
                    return Promise.reject(new SQLException_1.default('Query could not be executed!'));
                })
                    .then(function (result) {
                    return result;
                })
                    .catch(function () { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!"))); });
            }
        }
        else {
            return Promise.reject(new LogicException_1.default('User can not update!'));
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    /**
     * @function getTablePrimaryKey
     * @description gets the table primary key
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
    */
    BaseModel.prototype.getTablePrimaryKey = function (table) {
        var _this = this;
        if (table === void 0) { table = this.__table; }
        var length = table.toString().length;
        var database_index = table.indexOf('.');
        if (database_index === this.NOT_FOUND) {
            console.log('\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' +
                " Please write the database name in your table variable \"this.table = ".concat(table, "\" in the module class (").concat(this.model, ") ")
                + '\u00D7' + '\u00D7' + '\u001b[0m');
            return Promise.reject(new Error("Please write the database name in your table variable \"this.table = ".concat(table, "\" in the module class (").concat(this.model, ")")));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
                .then(function (result) {
                if (!result) {
                    return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!")));
                }
                var database = table.substr(0, database_index);
                var table_name = table.substr(database_index + 1, length);
                if (_this.primary_key !== undefined && _this.primary_key !== null) {
                    return _this.primary_key;
                }
                return (function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.db.executeModelQuery("select COLUMN_NAME from information_schema.KEY_COLUMN_USAGE " +
                                    "where CONSTRAINT_NAME='PRIMARY' AND TABLE_NAME='" + table_name + "' " +
                                    "AND TABLE_SCHEMA='" + database + "'"
                                // @ts-ignore 
                                ).then(function (_a) {
                                    var rows = _a[0], fields = _a[1];
                                    return rows[0].COLUMN_NAME;
                                })
                                    .catch(function (err) { return Promise.reject(new SQLException_1.default(err)); })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); })();
            })
                .then(function (result) {
                return result;
            })
                .catch(function (err) { return Promise.reject(new SQLException_1.default("The Table ".concat(table, " does not exist in the database!, Error: ").concat(err))); });
        }
        return Promise.reject(new SQLException_1.default('Query could not be executed!'));
    };
    return BaseModel;
}(QueryBuilder_1.default));
