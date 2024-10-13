"use strict";
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
var Singleton_1 = require("../Singleton/Singleton");
module.exports = /** @class */ (function () {
    function SqlQueryBuilder(model_name, query, table, columns) {
        if (model_name === void 0) { model_name = null; }
        if (query === void 0) { query = null; }
        if (table === void 0) { table = null; }
        if (columns === void 0) { columns = []; }
        this.mysql = Singleton_1.Singleton.getDbSession();
        this.db = Singleton_1.Singleton.getDb();
        this.model = model_name;
        this.query = query;
        this.table = table;
        this.columns = columns;
        this.path = Singleton_1.Singleton.getPath();
        this.file_system = Singleton_1.Singleton.getFileSystem();
        this._ = Singleton_1.Singleton.getLodash();
    }
    /**
     * @method getDb
     * @description Returns an instance of the database initiated object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Db Object
     */
    SqlQueryBuilder.prototype.getDb = function () {
        return this.mysql;
    };
    /**
     * @method getModel
     * @description Returns an instance of the initiated model
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Model Object
     */
    SqlQueryBuilder.prototype.getModel = function () {
        return this.model;
    };
    /**
     * @method escapeValue
     * @description Escapes user input
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string value
     * @param number value
     * @returns User escaped values
     */
    SqlQueryBuilder.prototype.escapeValue = function (value) {
        return this.getDb().escape(value);
    };
    /**
     * @method selectModel
     * @description Selects all from the model's table and returns a string with sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Class} modul_name
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.selectModel = function (modul_name) {
        var _this = this;
        if (!this._.isNull(modul_name)) {
            if (this._.isFunction(modul_name)) {
                var modules_directory_1 = this.path.join(__dirname, "..", "..", "app", "models");
                var level_one = this.file_system.readdirSync(modules_directory_1, { withFileTypes: true });
                if (this._.isEmpty(level_one)) {
                    throw new Error("Unable to scan models directory");
                }
                else {
                    level_one.forEach(function (file) {
                        var is_dir = file.isDirectory();
                        var is_file = file.isFile();
                        // @ts-ignore: Object is possibly 'null'.
                        var model = modul_name.toString().match(/ (\w+)/)[1];
                        if (is_file) {
                            var searched_model = _this._.replace(file.name.toString(), ".js", "");
                            if (searched_model === model) {
                                var file_name = model;
                                var required_model = require("../../app/models/" + "/" + file_name + ".js");
                                _this.model = new required_model();
                                _this.table = _this.model.table;
                                _this.columns = _this.model.columns;
                                _this.query = "SELECT * FROM ".concat(_this.model.table, " ");
                            }
                        }
                        else if (is_dir) {
                            var directory_name_1 = file.name;
                            var level_two = _this.file_system.readdirSync(modules_directory_1 + "/" + file.name, {
                                withFileTypes: true
                            });
                            if (_this._.isEmpty(level_two)) {
                                throw new Error("Unable to scan models directory");
                            }
                            level_two.forEach(function (file) {
                                var is_file = file.isFile();
                                if (is_file) {
                                    var searched_model = _this._.replace(file.name.toString(), ".js", "");
                                    if (searched_model === model) {
                                        var file_name = model;
                                        var required_model = require("../../app/models/" +
                                            directory_name_1 +
                                            "/" +
                                            file_name +
                                            ".js");
                                        _this.model = new required_model();
                                        _this.table = _this.model.table;
                                        _this.columns = _this.model.columns;
                                        _this.query = "SELECT * FROM ".concat(_this.model.table, " ");
                                    }
                                }
                            });
                        }
                    });
                }
            }
            else if (this._.isString(modul_name)) {
                var modules_directory_2 = this.path.join(__dirname, "..", "..", "app", "models");
                var level_one = this.file_system.readdirSync(modules_directory_2, { withFileTypes: true });
                if (this._.isEmpty(level_one)) {
                    throw new Error("Unable to scan models directory");
                }
                else {
                    level_one.forEach(function (file) {
                        var is_dir = file.isDirectory();
                        var is_file = file.isFile();
                        var model = modul_name;
                        if (is_file) {
                            var searched_model = _this._.replace(file.name.toString(), ".js", "");
                            if (searched_model === model) {
                                var file_name = model;
                                var required_model = require("../../app/models/" + "/" + file_name + ".js");
                                _this.model = new required_model();
                                _this.table = _this.model.table;
                                _this.columns = _this.model.columns;
                                _this.query = "SELECT * FROM ".concat(_this.model.table, " ");
                            }
                        }
                        else if (is_dir) {
                            var directory_name_2 = file.name;
                            var level_two = _this.file_system.readdirSync(modules_directory_2 + "/" + file.name, {
                                withFileTypes: true
                            });
                            if (_this._.isEmpty(level_two)) {
                                throw new Error("Unable to scan models directory");
                            }
                            level_two.forEach(function (file) {
                                var is_file = file.isFile();
                                if (is_file) {
                                    var searched_model = _this._.replace(file.name.toString(), ".js", "");
                                    if (searched_model === model) {
                                        var file_name = model;
                                        var required_model = require("../../app/models/" +
                                            directory_name_2 +
                                            "/" +
                                            file_name +
                                            ".js");
                                        _this.model = new required_model();
                                        _this.table = _this.model.table;
                                        _this.columns = _this.model.columns;
                                        _this.query = "SELECT * FROM ".concat(_this.model.table, " ");
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, this.table, this.columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method done
     * @description Ends a query with a comma
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Promise
     */
    SqlQueryBuilder.prototype.done = function () {
        if (!this._.isEmpty(this.query)) {
            this.query = this.query + ";";
        }
        return !!this.query ? this._executeQuery(this.query) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method _and_
     * @description Adds an and operator
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype._and_ = function () {
        if (!this._.isEmpty(this.query)) {
            this.query = this.query + " AND ";
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, this.table, this.columns) : !!this.query;
    };
    /**
     * @method _or_
     * @description Adds an or operator
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype._or_ = function () {
        if (!this._.isEmpty(this.query)) {
            this.query = this.query + " OR ";
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, this.table, this.columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method is
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.is = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " = ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " = ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method isNot
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isNot = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " != ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " != ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method contains
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.contains = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = "%".concat(value);
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method notContains
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.notContains = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = "%".concat(value);
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method startsWith
     * @description Checks if column starts with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.startsWith = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = "%".concat(value);
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method notStartsWith
     * @description Checks if column does not start with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.notStartsWith = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = "%".concat(value);
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method endsWith
     * @description Checks if column ends with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.endsWith = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = value.concat("%");
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method notEndsWith
     * @description Checks if column does not end with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.notEndsWith = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = value.concat("%");
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method custom
     * @description Executes a sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string SQL
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.custom = function (sub_query) {
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(sub_query)) {
            if (this._.isEmpty(sub_query)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            model = this.model;
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            model = this.model;
        }
        var custom_query = this.escapeValue(sub_query);
        custom_query = custom_query.replaceAll("'", "").replaceAll('"', "");
        if (!this._.isEmpty(custom_query)) {
            this.query = "".concat(this.query, " ").concat(custom_query, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ( ").concat(custom_query, " )");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method reset
     * @description Emptys the sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Boolean
     */
    SqlQueryBuilder.prototype.reset = function () {
        var table = null;
        var columns = null;
        var model = null;
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            model = this.model;
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            model = this.model;
        }
        this.query = "";
        return !this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method isNull
     * @description Checks if column is null
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isNull = function (col) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " IS NULL ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " IS NULL ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method isNotNull
     * @description Checks if column is not null
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isNotNull = function (col) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this.table;
            columns = this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " IS NOT NULL ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " IS NOT NULL ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method matchesPattern
     * @description Checks if column matches givin regex
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string regex
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.matchesPattern = function (col, regex) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(regex)) {
            if (this._.isEmpty(regex)) {
                return false;
            }
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " REGEXP ").concat(regex, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " REGEXP ").concat(regex, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method notMatchesPattern
     * @description Checks if column does not matche givin regex
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string regex
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.notMatchesPattern = function (col, regex) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(regex)) {
            if (this._.isEmpty(regex)) {
                return false;
            }
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " NOT REGEXP ").concat(regex, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " NOT REGEXP ").concat(regex, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method matchesSearchTerm
     * @description Checks if the search term matches
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.matchesSearchTerm = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = "%".concat(value.concat("%"));
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method notMatchesSearchTerm
     * @description Checks if the search term does not matche
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.notMatchesSearchTerm = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        value = "%".concat(value.concat("%"));
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " NOT LIKE ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method from
     * @description Adds range to column >= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.from = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " >= ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " >= ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method to
     * @description Adds range to column <= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.to = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " <= ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " <= ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method isLessThan
     * @description Adds less operator to column < Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isLessThan = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " < ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " < ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method isGreaterThan
     * @description Adds greater operator to column > Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isGreaterThan = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " > ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " > ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method isLessThanEqual
     * @description Adds less or equals operators to column <= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isLessThanEqual = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " <= ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " <= ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method isGreaterThan
     * @description Adds greater or equal operators to column >= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.isGreaterThanEqual = function (col, value) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        }
        else if (!this._.isNumber(value)) {
            return false;
        }
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        var _value = this.escapeValue(value);
        if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
            this.query = "".concat(this.query, " ").concat(col.toString(), " >= ").concat(_value, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " WHERE ").concat(col.toString(), " >= ").concat(_value, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method where
     * @description Adds Where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.where = function () {
        var table = null;
        var columns = null;
        var model = null;
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            model = this.model;
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            model = this.model;
        }
        if (!this._.isEmpty(this.query)) {
            this.query = "".concat(this.query, " WHERE ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method groupBy
     * @description Adds GroupBy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.groupBy = function (col) {
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        if (!this._.isEmpty(this.query)) {
            this.query = "".concat(this.query, " GROUP BY ").concat(col.toString(), " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " GROUP BY ").concat(col.toString(), " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method having
     * @description Adds Having clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string condition
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.having = function (condition) {
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(condition)) {
            if (this._.isEmpty(condition)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            model = this.model;
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            model = this.model;
        }
        if (!this._.isEmpty(this.query) && !this._.isEmpty(condition)) {
            if (this.query.search("GROUP BY") === -1 && this.query.search("group by") === -1) {
                throw new Error('Using "Having" key word requires using "Group By" key word');
            }
            var _condition = this.escapeValue(condition);
            _condition = _condition.replaceAll("'", "").replaceAll('"', "");
            this.query = "".concat(this.query, " Having ").concat(_condition, " ");
            return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
        }
        return false;
    };
    /**
     * @method orderBy
     * @description Adds GroupBy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string sort
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.orderBy = function (col, sort) {
        if (sort === void 0) { sort = "ASC"; }
        var object = null;
        var table = null;
        var columns = null;
        var model = null;
        if (this._.isString(col)) {
            if (this._.isEmpty(col)) {
                return false;
            }
        }
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
            }
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            object = Object.values(Object.keys(columns));
            model = this.model;
            if (this._.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
            }
        }
        if (!this._.isEmpty(this.query)) {
            this.query = "".concat(this.query, " ORDER BY ").concat(col.toString(), " ").concat(sort, " ");
        }
        else {
            this.query = "SELECT * FROM ".concat(table, " ORDER BY ").concat(col.toString(), " ").concat(sort, " ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method nesting
     * @description Opens up a new bracket to nest conditions or sub query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.nesting = function () {
        var table = null;
        var columns = null;
        var model = null;
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            model = this.model;
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            model = this.model;
        }
        if (!this._.isEmpty(this.query)) {
            this.query = "".concat(this.query, " ( ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    /**
     * @method closeNesting
     * @description Closes an opend bracket of a nested conditions or sub query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns SqlQueryBuilder
     */
    SqlQueryBuilder.prototype.closeNesting = function () {
        var table = null;
        var columns = null;
        var model = null;
        if (this.model) {
            table = this.model.table || this.table;
            columns = this.model.columns || this.columns;
            model = this.model;
        }
        else {
            table = this._.isEmpty(this.table) ? this.table : "";
            columns = this._.isEmpty(this.columns) ? this.columns : "";
            model = this.model;
        }
        if (!this._.isEmpty(this.query)) {
            this.query = "".concat(this.query, " ) ");
        }
        return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
    };
    //###########################\\
    //###########################\\
    /**
     * @method executeQuery
     * @description Async query executer method
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string built_query
     * @returns Promise
     */
    SqlQueryBuilder.prototype._executeQuery = function (built_query) {
        var _this = this;
        if (built_query === void 0) { built_query = this.query; }
        if (!this._.isNull(built_query)) {
            if (this._.isString(built_query)) {
                if (!this._.isEmpty(built_query)) {
                    return (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.db
                                        .executeQuery(built_query)
                                        .then(function (result) {
                                        if (result) {
                                            return result;
                                        }
                                    })
                                        .catch(function (err) { return Promise.reject(SQLException(err)); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })();
                }
            }
        }
    };
    return SqlQueryBuilder;
}());
