"use strict";
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
var Singleton_1 = require("../Singleton/Singleton");
var mongodb_1 = require("mongodb");
var MongoException_1 = __importDefault(require("../exception/types/MongoException"));
var helperFunctions_1 = require("../utils/helperFunctions");
var config = __importStar(require("../config"));
/**
 * @class MongoModel
 * @constructor
 * @description Class MongoModel is used to prepare suitable environment to build queries for the models
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
var MongoModel = /** @class */ (function () {
    function MongoModel() {
        var _this = this;
        /**
         * @description Flag to track if initializeModel() was called
         * @var {boolean} isInitialized
         */
        this.isInitialized = false;
        this._columnsValidationExcuted = false;
        /**
         * @function deepCamelCaseKeys
         * @description Return object's indexes of an array or object's indexes as camelCased
         * @param {object | Array<any>} object - the object or array to adjust
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
        this.model = (0, helperFunctions_1.getClass)(this);
        this.constants = Singleton_1.Singleton.getConstants();
        this._ = Singleton_1.Singleton.getLodash();
        this.redis = Singleton_1.Singleton.getRedisInstance();
        setTimeout(function () {
            if (!_this.isInitialized) {
                throw new MongoException_1.default("initializeModel() was not called in the derived class (".concat(_this.model, ")."));
            }
        }, 0);
    }
    /**
     * @function initializeModel
     * @description Initializes the model required functionalities and set a flag to true
     * @returns {Promise<void>}
     */
    MongoModel.prototype.initializeModel = function () {
        this.modelColumns = this.columns();
        this.isInitialized = true;
    };
    /**
     * @function handleException
     * @description Handles SQL exceptions by rejecting with an error message.
     * @param {new (message: string) => MongoException | LogicException} type - The type of the error
     * @param {string} message - The error message.
     * @param {unknown} error - Optional additional error details.
     * @returns {Promise<never>}
     */
    MongoModel.prototype.handleException = function (type, message, error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.reject(new type("".concat(message, " \n ").concat(error || "")))];
            });
        });
    };
    /**
     * @async
     * @function validateColumns
     * @description Validates the columns of the model with the corresponding collection
     * @returns {Promise<MongoException | boolean>}
     */
    MongoModel.prototype.validateColumns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var validationSchema, collectionColumns, modelColumnsKeys, missingColumns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._columnsValidationExcuted) {
                            return [2 /*return*/];
                        }
                        this._columnsValidationExcuted = true;
                        return [4 /*yield*/, this.createValidatedCollection(this.collection, {}, config.configurations().mongoDbName, {}, {}, "rootUser")];
                    case 1:
                        validationSchema = _a.sent();
                        collectionColumns = [];
                        if (!!this._.isEmpty(validationSchema)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCollectionFieldNames(this.collection, {}, config.configurations().mongoDbName, {}, "rootUser")];
                    case 2:
                        collectionColumns = _a.sent();
                        if (!this._.isEmpty(collectionColumns)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not retrieve column name of the collection ".concat(this.collection, " of the database ").concat(this.db.databaseName))];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        modelColumnsKeys = Object.keys(this.modelColumns);
                        modelColumnsKeys = modelColumnsKeys.filter(function (key) { return key !== "_id"; });
                        collectionColumns = collectionColumns.filter(function (key) { return key !== "_id"; });
                        missingColumns = modelColumnsKeys.filter(function (key) { return !collectionColumns.includes(key); });
                        if (!missingColumns.length) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "The following column(s) \"".concat(missingColumns.join(", "), "\" from \"").concat(this.model, "\" do(es) not exist in the collection \"").concat(this.collection, "\""))];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function escapeDatabaseName
     * @description Return the collection name with the database prefix
     * @param {string} collection - name of the collection
     * @returns {Promise<string>}
     */
    MongoModel.prototype.escapeDatabaseName = function (collection) {
        if (collection === void 0) { collection = this.collection; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._.isEmpty(collection)) {
                    return [2 /*return*/, ""];
                }
                return [2 /*return*/, this._.replace(collection, /^.*\./, "")];
            });
        });
    };
    /**
     * @async
     * @function validateMongoTypes
     * @description Return object's indexes of an array or object's indexes as camelCased
     * @param {any} filter
     * @param {boolean} isFilter
     * @throws {MongoException}
     * @returns {Promise<void>}
     */
    MongoModel.prototype.validateMongoTypes = function (filter, isFilter) {
        if (isFilter === void 0) { isFilter = false; }
        return __awaiter(this, void 0, void 0, function () {
            var validateBSONType, _i, _a, key;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validateBSONType = function (value, expectedType, key, isFilter) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (isFilter && typeof value === "object" && !Array.isArray(value) && value !== null) {
                                            return [2 /*return*/]; // Skip validation for complex operators like $in, $or, etc.
                                        }
                                        if (!(expectedType === null && value !== null)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected null but ").concat(value, " given"))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                    case 2:
                                        if (!(expectedType === undefined && value !== undefined)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected undefined but ").concat(value, " given"))];
                                    case 3: return [2 /*return*/, _a.sent()];
                                    case 4:
                                        if (!(expectedType === Array && !Array.isArray(value))) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Array but ").concat(value, " given"))];
                                    case 5: return [2 /*return*/, _a.sent()];
                                    case 6:
                                        if (!(expectedType === Boolean && typeof value !== "boolean")) return [3 /*break*/, 8];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Boolean but ").concat(value, " given"))];
                                    case 7: return [2 /*return*/, _a.sent()];
                                    case 8:
                                        if (!(expectedType === String && typeof value !== "string")) return [3 /*break*/, 10];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected String but ").concat(value, " given"))];
                                    case 9: return [2 /*return*/, _a.sent()];
                                    case 10:
                                        if (!(expectedType === Date && !(value instanceof Date))) return [3 /*break*/, 12];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Date but ").concat(value, " given"))];
                                    case 11: return [2 /*return*/, _a.sent()];
                                    case 12:
                                        if (!(expectedType === mongodb_1.Binary && !(value instanceof mongodb_1.Binary))) return [3 /*break*/, 14];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Binary but ").concat(value, " given"))];
                                    case 13: return [2 /*return*/, _a.sent()];
                                    case 14:
                                        if (!(expectedType === mongodb_1.ObjectId && !(value instanceof mongodb_1.ObjectId))) return [3 /*break*/, 16];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected ObjectId but ").concat(value, " given"))];
                                    case 15: return [2 /*return*/, _a.sent()];
                                    case 16:
                                        if (!(expectedType === mongodb_1.Decimal128 && !(value instanceof mongodb_1.Decimal128))) return [3 /*break*/, 18];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Decimal128 but ").concat(value, " given"))];
                                    case 17: return [2 /*return*/, _a.sent()];
                                    case 18:
                                        if (!(expectedType === mongodb_1.Int32 && !(value instanceof mongodb_1.Int32))) return [3 /*break*/, 20];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Int32 but ").concat(value, " given"))];
                                    case 19: return [2 /*return*/, _a.sent()];
                                    case 20:
                                        if (!(expectedType === mongodb_1.Double && !(value instanceof mongodb_1.Double))) return [3 /*break*/, 22];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Double but ").concat(value, " given"))];
                                    case 21: return [2 /*return*/, _a.sent()];
                                    case 22:
                                        if (!(expectedType === mongodb_1.MinKey && !(value instanceof mongodb_1.MinKey))) return [3 /*break*/, 24];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected MinKey but ").concat(value, " given"))];
                                    case 23: return [2 /*return*/, _a.sent()];
                                    case 24:
                                        if (!(expectedType === mongodb_1.BSONSymbol && !(value instanceof mongodb_1.BSONSymbol))) return [3 /*break*/, 26];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected BSONSymbol but ").concat(value, " given"))];
                                    case 25: return [2 /*return*/, _a.sent()];
                                    case 26:
                                        if (!(expectedType === mongodb_1.BSONRegExp && !(value instanceof mongodb_1.BSONRegExp || value instanceof RegExp))) return [3 /*break*/, 28];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected BSONRegExp but ").concat(value, " given"))];
                                    case 27: return [2 /*return*/, _a.sent()];
                                    case 28:
                                        if (!(expectedType === mongodb_1.Code && !(value instanceof mongodb_1.Code))) return [3 /*break*/, 30];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Code but ").concat(value, " given"))];
                                    case 29: return [2 /*return*/, _a.sent()];
                                    case 30:
                                        if (!(expectedType === mongodb_1.Timestamp && !(value instanceof mongodb_1.Timestamp))) return [3 /*break*/, 32];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Timestamp but ").concat(value, " given"))];
                                    case 31: return [2 /*return*/, _a.sent()];
                                    case 32:
                                        if (!(expectedType === mongodb_1.UUID && !(value instanceof mongodb_1.UUID))) return [3 /*break*/, 34];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected UUID but ").concat(value, " given"))];
                                    case 33: return [2 /*return*/, _a.sent()];
                                    case 34:
                                        if (!(expectedType === Object && typeof value !== "object")) return [3 /*break*/, 36];
                                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Invalid type for ".concat(key, ", expected Object but ").concat(value, " given"))];
                                    case 35: return [2 /*return*/, _a.sent()];
                                    case 36: return [2 /*return*/];
                                }
                            });
                        }); };
                        _i = 0, _a = Object.keys(filter);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        return [4 /*yield*/, validateBSONType(filter[key], this.modelColumns[key], key, isFilter)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function getConnection
     * @description Gets a connection from mongo database
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - user role to get the connection for
     * @param {string} dbName - placeholder for db name
     * @param {DbOptions} dbConnectionOptions - placeholder for db connection options
     * @param {MongoClient | undefined} client - placeholder for client
     * @throws {MongoException}
     * @returns {Promise<void>}
     */
    MongoModel.prototype.getConnection = function (userRole, dbName, dbConnectionOptions, client, serverApi) {
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbConnectionOptions === void 0) { dbConnectionOptions = {}; }
        if (client === void 0) { client = undefined; }
        if (serverApi === void 0) { serverApi = {
            version: "1",
            strict: true,
            deprecationErrors: true
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var isFromSession, createClient, mongoDb, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._columnsValidationExcuted) return [3 /*break*/, 2];
                        //? the function is implemented here due to initializeModel function as synchronous function
                        //* before initating a connection to mongoDB the model columns will be checked
                        return [4 /*yield*/, this.validateColumns()];
                    case 1:
                        //? the function is implemented here due to initializeModel function as synchronous function
                        //* before initating a connection to mongoDB the model columns will be checked
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        isFromSession = false;
                        createClient = undefined;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 10]);
                        mongoDb = Singleton_1.Singleton.getMongoDbInstance(userRole, dbName, serverApi);
                        if (!client) return [3 /*break*/, 4];
                        createClient = client;
                        isFromSession = true;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, mongoDb.pool()];
                    case 5:
                        createClient = _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, mongoDb.connect(createClient)];
                    case 7:
                        _a.sent();
                        if (!this.db || this.db.databaseName !== dbName || dbName !== config.configurations().mongoDbName) {
                            this.db = createClient.db(dbName, dbConnectionOptions);
                        }
                        this.connection = { client: createClient, mongoDb: this.db, isFromSession: isFromSession };
                        return [2 /*return*/, this.connection];
                    case 8:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Failed to get MongoDB connection: ".concat(error_1))];
                    case 9: return [2 /*return*/, _a.sent()];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    //*****************************************************************************\\
    //*******************************READ-OPERATIONS*******************************\\
    /**
     * @function describeCollection
     * @description Describes a Collection in the database
     * @param {string} collection - Collection name
     * @param {string} dbName - Database name
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - user role to get the connection for - default is readWriteAnyDatabaseUser
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.describeCollection = function (collection, options, dbName, dbOptions, clientOptions, userRole) {
        if (collection === void 0) { collection = this.collection; }
        if (options === void 0) { options = {}; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (userRole === void 0) { userRole = "readWriteAnyDatabaseUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedResult, command, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Collection name is required to describe the collection.")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        _a.trys.push([2, 7, 9, 11]);
                        cacheKey = "mongo:describeCollection:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _a.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        command = { collStats: collection };
                        return [4 /*yield*/, this.runCommand(command, options, clientOptions, dbName, dbOptions, userRole)];
                    case 4:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error describing collection '".concat(collection, "': ").concat(error_2))];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9: return [4 /*yield*/, this.redis.quit()];
                    case 10:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function stats
     * @description Get all the db statistics.
     * @param {DbStatsOptions} options - placeholder for stats options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName - placeholder for mongo database name
     * @param {DbOptions} dbOptions - placeholder for mongo database option
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.stats = function (options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, statsOptions, result, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:stats:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        statsOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.stats(statsOptions)];
                    case 4:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        error_3 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not get the stats for the db ".concat(dbName, "! \n Error: ").concat(error_3))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function getCollectionNames
     * @description List all collections of this database with optional filter.
     * @param {Document} filter - placeholder for filtering collections
     * @param {ListCollectionsOptions} options - placeholder for list collections option
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder for client options
     * @param {string} dbName - placeholder for mongo database name
     * @param {DbOptions} dbOptions - placeholder for mongo database options
     * @throws {MongoException}
     * @returns {Promise<string[]>}
     */
    MongoModel.prototype.getCollectionNames = function (filter, options, clientOptions, dbName, dbOptions) {
        var _a;
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _b, mongoDb, client, isFromSession, cacheKey, cachedResult, getCollectionNamesOptions, collections, collectionNames, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _b = _c.sent(), mongoDb = _b.mongoDb, client = _b.client, isFromSession = _b.isFromSession;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:getCollectionNames:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _c.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        getCollectionNamesOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.listCollections(filter, getCollectionNamesOptions).toArray()];
                    case 4:
                        collections = (_a = (_c.sent())) !== null && _a !== void 0 ? _a : [];
                        collectionNames = collections.map(function (collection) { return collection.name; });
                        if (!collectionNames) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, collectionNames, config.configurations().redisCacheExpiry)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, collectionNames];
                    case 7:
                        error_4 = _c.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error retrieving collection names! \n Error: ".concat(error_4))];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _c.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function countDocuments
     * @description Gets the number of documents matching the filter. For a fast count of the total documents in a collection see Collection#estimatedDocumentCount estimatedDocumentCount. Note: When migrating from Collection#count count to Collection#countDocuments countDocuments the following query operators must be replaced:
     * | Operator | Replacement |
     * | -------- | ----------- |
     * | `$where` | [`$expr`][1] |
     * | `$near`  | [`$geoWithin`][2] with [`$center`][3] |
     * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
     * @param {Partial<this["modelColumns"]>} query - placeholder for mongoDB query
     * @param {CountDocumentsOptions} options - placeholder for query options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined } clientOptions - placeholder for client options
     * @param {string} collection - placeholder for collection name
     * @param {string} dbName - placeholder for mongo database name
     * @param {DbOptions} connectionOptions - placeholder for connection options
     * @throws {MongoException}
     * @returns {Promise<number>}
     */
    MongoModel.prototype.countDocuments = function (query, options, clientOptions, collection, dbName, connectionOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (connectionOptions === void 0) { connectionOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, countDocumentsOptions, result, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(query, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readUser", dbName, connectionOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 10, 14]);
                        cacheKey = "mongo:countDocuments:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 4:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        countDocumentsOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).countDocuments(query, countDocumentsOptions)];
                    case 5:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, result];
                    case 8:
                        error_5 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error counting documents! \n Error: ".concat(error_5))];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        if (!!isFromSession) return [3 /*break*/, 12];
                        return [4 /*yield*/, client.close()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [4 /*yield*/, this.redis.quit()];
                    case 13:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @description Get the list of all indexes information for the collection.
     * @function listCollections
     * @param {Document} filter - placeholder for filter
     * @param {ListCollectionsOptions} options - placeholder for query options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder for client options
     * @param {string} dbName - placeholder for mongo database name
     * @param {DbOptions} dbOptions - placeholder for connection options
     * @throws {MongoException}
     * @returns {Promise<Document[]>}
     */
    MongoModel.prototype.listCollections = function (filter, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, listCollectionsOptions, result, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:listCollections:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        listCollectionsOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.listCollections(filter, listCollectionsOptions).toArray()];
                    case 4:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        error_6 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not list collections! \n Error: ".concat(error_6))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function listIndexes
     * @description lists all indexes from mongo db
     * @param {ListIndexesOptions} options - placeholder
     * @param {string} collection - placeholder
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder
     * @param {string} dbName - placeholder
     * @param {DbOptions} dbOptions - placeholder
     * @throws {MongoException}
     * @returns {Promise<Document[]>}
     */
    MongoModel.prototype.listIndexes = function (options, collection, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (collection === void 0) { collection = this.collection; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, listIndexesOptions, result, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:listIndexes:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        listIndexesOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).listIndexes(listIndexesOptions).toArray()];
                    case 4:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        error_7 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not list indexes! \n Error: ".concat(error_7))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function listSearchIndexes
     * @description Returns all search indexes for the current collection.
     * @param {ListSearchIndexesOptions} options
     * @param {string} collection
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Document[]>}
     */
    MongoModel.prototype.listSearchIndexes = function (options, collection, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (collection === void 0) { collection = this.collection; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, listSearchIndexesOptions, result, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:listSearchIndexes:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        listSearchIndexesOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).listSearchIndexes(listSearchIndexesOptions).toArray()];
                    case 4:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        error_8 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not list search indexes! \n Error: ".concat(error_8))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function dbAggregate
     * @description Execute an aggregation framework pipeline against the database, needs MongoDB >= 3.6
     * @param {Document[]} pipeline
     * @param {AggregateOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<this["modelColumns"][]>}
     */
    MongoModel.prototype.dbAggregate = function (pipeline, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, dbAggregateOptions, cursor, results, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:dbAggregate:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        dbAggregateOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        cursor = mongoDb.aggregate(pipeline, dbAggregateOptions);
                        return [4 /*yield*/, cursor.toArray()];
                    case 4:
                        results = _b.sent();
                        if (!results) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, results, config.configurations().redisCacheExpiry)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, results];
                    case 7:
                        error_9 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not perform aggregation! \n Error: ".concat(error_9))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function aggregate
     * @description Execute an aggregation framework pipeline against the collection, needs MongoDB >= 2.2
     * @param {Document[]} pipeline
     * @param {AggregateOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<this["modelColumns"][]>}
     */
    MongoModel.prototype.aggregate = function (pipeline, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, aggregateOptions, cursor, results, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 13]);
                        cacheKey = "mongo:aggregate:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        aggregateOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        cursor = mongoDb
                            .collection(collection)
                            .aggregate(pipeline, aggregateOptions);
                        return [4 /*yield*/, cursor.toArray()];
                    case 4:
                        results = _b.sent();
                        if (!results) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, results, config.configurations().redisCacheExpiry)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, results];
                    case 7:
                        error_10 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error performing aggregation! \n Error: ".concat(error_10))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function findOne
     * @description Fetches the first document that matches the filter
     * @param {Partial<this["modelColumns"]>} criteria - placeholder
     * @param {FindOptions} options - placeholder
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder
     * @param {string} collection - placeholder
     * @param {string} dbName - placeholder
     * @param {DbOptions} dbOptions - placeholder
     * @throws {MongoException}
     * @returns {Promise<this["modelColumns"] | null>}
     */
    MongoModel.prototype.findOne = function (criteria, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, findOneOptions, result, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(criteria, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 10, 14]);
                        cacheKey = "mongo:findOne:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 4:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        findOneOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).findOne(criteria, findOneOptions)];
                    case 5:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, result];
                    case 8:
                        error_11 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error finding document! \n Error: ".concat(error_11))];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        if (!!isFromSession) return [3 /*break*/, 12];
                        return [4 /*yield*/, client.close()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [4 /*yield*/, this.redis.quit()];
                    case 13:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @description Creates a cursor for a filter that can be used to iterate over results from MongoDB
     * @param {Partial<this["modelColumns"]>} criteria
     * @param {FindOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Filter<this["modelColumns"]>[]>}
     */
    MongoModel.prototype.find = function (criteria, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, findOptions, result, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(criteria, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 10, 14]);
                        cacheKey = "mongo:find:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 4:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        findOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).find(criteria, findOptions).toArray()];
                    case 5:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, result];
                    case 8:
                        error_12 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error finding documents! \n Error: ".concat(error_12))];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        if (!!isFromSession) return [3 /*break*/, 12];
                        return [4 /*yield*/, client.close()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [4 /*yield*/, this.redis.quit()];
                    case 13:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function distinct
     * @description The distinct command returns a list of distinct values for the given key across a collection.
     * @param {K} key
     * @param {Partial<this["modelColumns"]>} criteria
     * @param {DistinctOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<void[]>}
     */
    MongoModel.prototype.distinct = function (key, criteria, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, cachedResult, distinctOptions, result, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(criteria)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 10, 14]);
                        cacheKey = "mongo:distinct:".concat(collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 4:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        distinctOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).distinct(key, criteria, distinctOptions)];
                    case 5:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, result];
                    case 8:
                        error_13 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error retrieving distinct values! \n Error: ".concat(error_13))];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        if (!!isFromSession) return [3 /*break*/, 12];
                        return [4 /*yield*/, client.close()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [4 /*yield*/, this.redis.quit()];
                    case 13:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function watch
     * @description Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
     * @param {Document[]} pipeline
     * @param {ChangeStreamOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @throws {MongoException}
     * @param {DbOptions} dbOptions
     * @returns {Promise<ChangeStream<ChangeStreamDocument<Partial<this["modelColumns"]>>>>}
     */
    MongoModel.prototype.watch = function (pipeline, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, watchOptions, error_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 3, 5, 8]);
                        watchOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [2 /*return*/, mongoDb.collection(collection).watch(pipeline, watchOptions)];
                    case 3:
                        error_14 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error opening change stream! \n Error: ".concat(error_14))];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        if (!!isFromSession) return [3 /*break*/, 7];
                        return [4 /*yield*/, client.close()];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function getUsers
     * @description gets all users from admin database
     * @param {RunCommandOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - user role to get the connection for - default is userAdminUser
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.getUsers = function (options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoAdminDb; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "userAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedResult, result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 7, 9]);
                        cacheKey = "mongo:getUsers:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 1:
                        cachedResult = _a.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        return [4 /*yield*/, this.runCommand({ usersInfo: 1 }, options, clientOptions, dbName, dbOptions, userRole)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                    case 5:
                        error_15 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not create User! \n Error: ".concat(error_15))];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [4 /*yield*/, this.redis.quit()];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function getRoles
     * @description Gets roles from admin database
     * @param {RunCommandOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - user role to get the connection for - default is userAdminUser
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.getRoles = function (options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoAdminDb; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "userAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedResult, result, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 7, 9]);
                        cacheKey = "mongo:getRoles:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 1:
                        cachedResult = _a.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        return [4 /*yield*/, this.runCommand({ rolesInfo: 1 }, options, clientOptions, dbName, dbOptions, userRole)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                    case 5:
                        error_16 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error fetching roles for the database ".concat(dbName, "! \n Error: ").concat(error_16))];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [4 /*yield*/, this.redis.quit()];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function getSiblingDB
     * @description Get a reference to another database in the same MongoDB instance.
     * @param {string} siblingDbName - The name of the sibling database to connect to.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
     * @param {string} currentDbName - The current database name, defaults to the application's database name.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'dbAdminUser'.
     * @throws {MongoException} - Throws an exception if the connection fails.
     * @returns {Promise<Db>} - Returns a promise that resolves to the sibling database connection.
     */
    MongoModel.prototype.getSiblingDB = function (siblingDbName, dbOptions, clientOptions, currentDbName, userRole) {
        if (dbOptions === void 0) { dbOptions = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (currentDbName === void 0) { currentDbName = config.configurations().mongoDbName; }
        if (userRole === void 0) { userRole = "dbAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, isFromSession, cacheKey, cachedResult, result, error_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, currentDbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, 8, 12]);
                        cacheKey = "mongo:getSiblingDB:".concat(this.collection);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _b.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        result = client.db(siblingDbName, dbOptions);
                        if (!result) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, result];
                    case 6:
                        error_17 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not get sibling DB: ".concat(siblingDbName, "! \n Error: ").concat(error_17))];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        if (!!isFromSession) return [3 /*break*/, 10];
                        return [4 /*yield*/, client.close()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.redis.quit()];
                    case 11:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function currentOp
     * @description Get a snapshot of the currently running operations on the MongoDB instance.
     * @param {Document} commandOptions - Options to pass to the currentOp command (e.g., filtering on operations).
     * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
     * @param {string} dbName - Name of the database to run the command against, defaults to 'admin'.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'clusterMonitorUser'.
     * @throws {MongoException} - Throws an exception if the command fails.
     * @returns {Promise<Document>} - Returns a promise that resolves to the current operations snapshot.
     */
    MongoModel.prototype.currentOp = function (commandOptions, options, clientOptions, dbName, dbOptions, userRole) {
        if (commandOptions === void 0) { commandOptions = {}; }
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoAdminDb; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "clusterMonitorUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, runCommandOptions, command, error_18;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 6, 9]);
                        runCommandOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        command = __assign({ currentOp: 1 }, commandOptions);
                        return [4 /*yield*/, mongoDb.command(command, runCommandOptions)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        error_18 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error running currentOp command! \n Error: ".concat(error_18))];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        if (!!isFromSession) return [3 /*break*/, 8];
                        return [4 /*yield*/, client.close()];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function getCollectionFieldNames
     * @description Get a snapshot of the currently running operations on the MongoDB instance.
     * @param {string} collectionName - name of the collection
     * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
     * @param {string} dbName - Name of the database to run the command against, defaults to 'admin'.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'rootUser'.
     * @throws {MongoException} - Throws an exception if the command fails.
     * @returns {Promise<Document>} - Returns an array of strings or an empty array of the fields names
     */
    MongoModel.prototype.getCollectionFieldNames = function (collectionName, options, dbName, dbOptions, userRole) {
        var _a, _b, _c;
        if (collectionName === void 0) { collectionName = this.collection; }
        if (options === void 0) { options = {}; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "rootUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var client, cacheKey, cachedResult, collectionInfo, collectionDetails, validator_1, fieldNames, error_19;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, dbName, dbOptions, undefined, undefined)];
                    case 1:
                        client = (_d.sent()).client;
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 12, 14, 16]);
                        cacheKey = "mongo:getCollectionFieldNames:".concat(collectionName);
                        return [4 /*yield*/, this.redis.getCachedResult(cacheKey)];
                    case 3:
                        cachedResult = _d.sent();
                        if (cachedResult) {
                            return [2 /*return*/, cachedResult];
                        }
                        return [4 /*yield*/, this.runCommand({ listCollections: 1, filter: { name: collectionName } }, options, { clientFromSession: client }, dbName, dbOptions, userRole)];
                    case 4:
                        collectionInfo = _d.sent();
                        if (!((_b = (_a = collectionInfo === null || collectionInfo === void 0 ? void 0 : collectionInfo["cursor"]) === null || _a === void 0 ? void 0 : _a.firstBatch) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 9];
                        collectionDetails = collectionInfo["cursor"].firstBatch[0];
                        validator_1 = (_c = collectionDetails === null || collectionDetails === void 0 ? void 0 : collectionDetails.options) === null || _c === void 0 ? void 0 : _c.validator;
                        if (!validator_1) return [3 /*break*/, 7];
                        fieldNames = Object.keys(validator_1.properties || {});
                        if (!fieldNames) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, fieldNames, config.configurations().redisCacheExpiry)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [2 /*return*/, fieldNames];
                    case 7: return [2 /*return*/, []];
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.handleException(MongoException_1.default, "Collection \"".concat(collectionName, "\" does not exist."))];
                    case 10: return [2 /*return*/, _d.sent()];
                    case 11: return [3 /*break*/, 16];
                    case 12:
                        error_19 = _d.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error retrieving collection field names: ".concat(error_19))];
                    case 13: return [2 /*return*/, _d.sent()];
                    case 14: return [4 /*yield*/, this.redis.quit()];
                    case 15:
                        _d.sent();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    //*****************************************************************************\\
    //******************************WRITE-OPERATIONS*******************************\\
    /**
     * @async
     * @function createValidatedCollection
     * @description Creates a new collection with schema validation.
     * @param {string} collectionName - Name of the collection.
     * @param {CreateCollectionOptions} options - Additional create collection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'rootUser'.
     * @throws {MongoException}
     * @returns {Promise<Collection<Document>>}
     */
    MongoModel.prototype.createValidatedCollection = function (collectionName, options, dbName, dbOptions, RunCommandOptions, userRole) {
        var _a, _b, _c;
        if (collectionName === void 0) { collectionName = this.collection; }
        if (options === void 0) { options = {}; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (RunCommandOptions === void 0) { RunCommandOptions = {}; }
        if (userRole === void 0) { userRole = "rootUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var _d, mongoDb, client, collectionInfo, validationSchema, collectionDetails, _i, _e, _f, columnName, columnType, bsonType, description, _g, _h, _j, columnName, columnType, bsonType, description, collectionOptions, error_20;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, config.configurations().mongoDbName, undefined, undefined)];
                    case 1:
                        _d = _k.sent(), mongoDb = _d.mongoDb, client = _d.client;
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 9, 11, 13]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", collectionName)];
                    case 3:
                        _k.sent();
                        return [4 /*yield*/, this.runCommand({ listCollections: 1, filter: { name: collectionName } }, RunCommandOptions, { clientFromSession: client }, dbName, dbOptions, userRole)];
                    case 4:
                        collectionInfo = _k.sent();
                        validationSchema = {
                            bsonType: "object",
                            required: __spreadArray([], Object.keys(this.modelColumns), true),
                            properties: {}
                        };
                        if (!((_b = (_a = collectionInfo === null || collectionInfo === void 0 ? void 0 : collectionInfo["cursor"]) === null || _a === void 0 ? void 0 : _a.firstBatch) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 7];
                        collectionDetails = collectionInfo["cursor"].firstBatch[0];
                        if (!((_c = collectionDetails.options) === null || _c === void 0 ? void 0 : _c.validator)) return [3 /*break*/, 5];
                        return [2 /*return*/, mongoDb.collection(collectionName)];
                    case 5:
                        for (_i = 0, _e = Object.entries(this.modelColumns); _i < _e.length; _i++) {
                            _f = _e[_i], columnName = _f[0], columnType = _f[1];
                            bsonType = "string";
                            description = "Field ".concat(columnName, " is required");
                            if (columnType === String)
                                bsonType = "string";
                            else if (columnType === mongodb_1.Int32)
                                bsonType = "int";
                            else if (columnType === mongodb_1.Double)
                                bsonType = "double";
                            else if (columnType === Boolean)
                                bsonType = "bool";
                            else if (columnType === null)
                                bsonType = "null";
                            else if (Array.isArray(columnType))
                                bsonType = "array";
                            else if (columnType === Object)
                                bsonType = "object";
                            else if (columnType === undefined)
                                bsonType = "undefined";
                            else if (columnType === Date)
                                bsonType = "date";
                            else if (columnType === mongodb_1.Binary)
                                bsonType = "binData";
                            else if (columnType === mongodb_1.ObjectId)
                                bsonType = "objectId";
                            else if (columnType === mongodb_1.MinKey)
                                bsonType = "minKey";
                            else if (columnType === mongodb_1.BSONSymbol)
                                bsonType = "symbol";
                            else if (columnType === mongodb_1.BSONRegExp)
                                bsonType = "regex";
                            else if (columnType === mongodb_1.Code)
                                bsonType = "javascript";
                            else if (columnType === mongodb_1.Timestamp)
                                bsonType = "timestamp";
                            else if (columnType === mongodb_1.Decimal128)
                                bsonType = "decimal";
                            else if (columnType === mongodb_1.UUID)
                                bsonType = "binData";
                            validationSchema.properties[columnName] = {
                                bsonType: bsonType,
                                description: description
                            };
                        }
                        return [4 /*yield*/, this.runCommand({
                                collMod: collectionName,
                                validator: validationSchema
                            }, RunCommandOptions, { clientFromSession: client }, dbName, dbOptions, userRole)];
                    case 6:
                        _k.sent();
                        return [2 /*return*/, mongoDb.collection(collectionName)];
                    case 7:
                        for (_g = 0, _h = Object.entries(this.modelColumns); _g < _h.length; _g++) {
                            _j = _h[_g], columnName = _j[0], columnType = _j[1];
                            bsonType = "string";
                            description = "Field ".concat(columnName, " is required");
                            if (columnType === String)
                                bsonType = "string";
                            else if (columnType === mongodb_1.Int32)
                                bsonType = "int";
                            else if (columnType === mongodb_1.Double)
                                bsonType = "double";
                            else if (columnType === Boolean)
                                bsonType = "bool";
                            else if (columnType === null)
                                bsonType = "null";
                            else if (Array.isArray(columnType))
                                bsonType = "array";
                            else if (columnType === Object)
                                bsonType = "object";
                            else if (columnType === undefined)
                                bsonType = "undefined";
                            else if (columnType === Date)
                                bsonType = "date";
                            else if (columnType === mongodb_1.Binary)
                                bsonType = "binData";
                            else if (columnType === mongodb_1.ObjectId)
                                bsonType = "objectId";
                            else if (columnType === mongodb_1.MinKey)
                                bsonType = "minKey";
                            else if (columnType === mongodb_1.BSONSymbol)
                                bsonType = "symbol";
                            else if (columnType === mongodb_1.BSONRegExp)
                                bsonType = "regex";
                            else if (columnType === mongodb_1.Code)
                                bsonType = "javascript";
                            else if (columnType === mongodb_1.Timestamp)
                                bsonType = "timestamp";
                            else if (columnType === mongodb_1.Decimal128)
                                bsonType = "decimal";
                            else if (columnType === mongodb_1.UUID)
                                bsonType = "binData";
                            validationSchema.properties[columnName] = {
                                bsonType: bsonType,
                                description: description
                            };
                        }
                        collectionOptions = __assign(__assign({}, options), { validator: validationSchema });
                        return [4 /*yield*/, mongoDb.createCollection(collectionName, collectionOptions)];
                    case 8: return [2 /*return*/, _k.sent()];
                    case 9:
                        error_20 = _k.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error creating validated collection: ".concat(error_20))];
                    case 10: return [2 /*return*/, _k.sent()];
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _k.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function repairDatabase
     * @description Repairs the specified database by using the MongoDB `repairDatabase` command.
     * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
     * @param {string} dbName - Name of the database to repair, defaults to 'admin'.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'dbAdminUser'.
     * @throws {MongoException} - Throws an exception if the command fails.
     * @returns {Promise<Document>} - Returns a promise that resolves to the result of the repairDatabase command.
     */
    MongoModel.prototype.repairDatabase = function (options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoAdminDb; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "dbAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, runCommandOptions, command, error_21;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, 7, 11]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 3:
                        _b.sent();
                        runCommandOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        command = { repairDatabase: 1 };
                        return [4 /*yield*/, mongoDb.command(command, runCommandOptions)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        error_21 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error running repairDatabase command! \n Error: ".concat(error_21))];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        if (!!isFromSession) return [3 /*break*/, 9];
                        return [4 /*yield*/, client.close()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.redis.quit()];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function killOp
     * @description Terminate a running operation on the MongoDB server.
     * @param {number} operationId - The ID of the operation to terminate.
     * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
     * @param {string} dbName - Name of the database to run the command against, defaults to 'admin'.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'clusterManagerUser'.
     * @throws {MongoException} - Throws an exception if the command fails.
     * @returns {Promise<Document>} - Returns a promise that resolves to the result of the killOp command.
     */
    MongoModel.prototype.killOp = function (operationId, options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoAdminDb; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "clusterManagerUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, runCommandOptions, command, error_22;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 6, 9]);
                        runCommandOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        command = { killOp: 1, op: operationId };
                        return [4 /*yield*/, mongoDb.command(command, runCommandOptions)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        error_22 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error running killOp command! \n Error: ".concat(error_22))];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        if (!!isFromSession) return [3 /*break*/, 8];
                        return [4 /*yield*/, client.close()];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function createView
     * @description Creates a view in the MongoDB database.
     * @param {string} viewName - The name of the view to create.
     * @param {string} sourceCollection - The name of the source collection the view is based on.
     * @param {Array<Document>} pipeline - An array of aggregation pipeline stages that defines the view.
     * @param {RunCommandOptions} options - Optional command options.
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
     * @param {string} dbName - The database name, defaults to the application's database name.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'dbAdminUser'.
     * @throws {MongoException} - Throws an exception if the view cannot be created.
     * @returns {Promise<Document>} - Returns a promise that resolves to the result of the create view operation.
     */
    MongoModel.prototype.createView = function (viewName, sourceCollection, pipeline, options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "dbAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var command, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = {
                            create: viewName,
                            viewOn: sourceCollection,
                            pipeline: pipeline
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 6, 8]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.runCommand(command, options, clientOptions, dbName, dbOptions, userRole)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_23 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not drop role! \n Error: ".concat(error_23))];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [4 /*yield*/, this.redis.quit()];
                    case 7:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function dropRole
     * @description Drops a role from the MongoDB database.
     * @param {string} roleName - The name of the role to drop.
     * @param {RunCommandOptions} options - Optional command options.
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
     * @param {string} dbName - The database name, defaults to 'admin' for global roles.
     * @param {DbOptions} dbOptions - Optional database connection options.
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'userAdminUser'.
     * @throws {MongoException} - Throws an exception if the role cannot be dropped.
     * @returns {Promise<Document>} - Returns a promise that resolves to the result of the drop role operation.
     */
    MongoModel.prototype.dropRole = function (roleName, options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoAdminDb; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "userAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var command, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        command = { dropRole: roleName };
                        return [4 /*yield*/, this.runCommand(command, options, clientOptions, dbName, dbOptions, userRole)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_24 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not drop role! \n Error: ".concat(error_24))];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function dropCollection
     * @description Drop a collection from the database, removing it permanently. New accesses will create a new collection.
     * @param {string} collectionName
     * @param {DropCollectionOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<boolean>}
     */
    MongoModel.prototype.dropCollection = function (collectionName, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, dropCollectionOptions, error_25;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("dbAdminUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, 7, 11]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 3:
                        _b.sent();
                        dropCollectionOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.dropCollection(collectionName, dropCollectionOptions)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        error_25 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error dropping collection '".concat(collectionName, "'! \n ").concat(error_25))];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        if (!!isFromSession) return [3 /*break*/, 9];
                        return [4 /*yield*/, client.close()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.redis.quit()];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function createUser
     * @description creates a user
     * @param {{user: string; pwd: string; roles: Array<{ role: "read" | "readWrite" | "dbAdmin" | "userAdmin" | "clusterAdmin" }>}} user
     * @param {RunCommandOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.createUser = function (user, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var result, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.runCommand({
                                createUser: user.user,
                                pwd: user.pwd,
                                roles: user.roles.map(function (role) { return Object.assign({}, role, { db: dbName }); })
                            }, options, clientOptions, dbName, dbOptions, "userAdminUser")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_26 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not create User! \n Error: ".concat(error_26))];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function dropUser
     * @description drops a user from a database
     * @param {{ username: string }} user
     * @param {RunCommandOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.dropUser = function (user, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var result, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.runCommand({ dropUser: user.username }, options, clientOptions, dbName, dbOptions, "userAdminUser")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_27 = _a.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Failed to drop user!. \n Error: ".concat(error_27))];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function runCommand
     * @description Execute a command as userAdminUser.
     * @param {Document} command
     * @param {RunCommandOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @param {keyof {
     *    __systemUser: string;
     *    internalUser: string;
     *    rootUser: string;
     *    readAnyDatabaseUser: string;
     *    readWriteAnyDatabaseUser: string;
     *    userAdminAnyDatabaseUser: string;
     *    dbAdminAnyDatabaseUser: string;
     *    readUser: string;
     *    readWriteUser: string;
     *    dbAdminUser: string;
     *    userAdminUser: string;
     *    dbOwnerUser: string;
     *    enableShardingUser: string;
     *    clusterAdminUser: string;
     *    clusterManagerUser: string;
     *    clusterMonitorUser: string;
     *    hostManagerUser: string;
     *    backupUser: string;
     *    restoreUser: string;
     * }} userRole - The user role to use for the operation. Defaults to 'userAdminUser'.
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.runCommand = function (command, options, clientOptions, dbName, dbOptions, userRole) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        if (userRole === void 0) { userRole = "userAdminUser"; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, runCommandOptions, error_28;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection(userRole, dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession, {
                            deprecationErrors: true,
                            strict: false,
                            version: "1"
                        })];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 6, 9]);
                        runCommandOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.command(command, runCommandOptions)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        error_28 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error running command! \n Error: ".concat(error_28))];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        if (!!isFromSession) return [3 /*break*/, 8];
                        return [4 /*yield*/, client.close()];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function renameCollection
     * @description Rename a collection.
     * @param {string} oldName
     * @param {string} newName
     * @param {RenameOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Document>}
     */
    MongoModel.prototype.renameCollection = function (oldName, newName, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, renameCollectionOptions, error_29;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("dbAdminUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, 7, 11]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 3:
                        _b.sent();
                        renameCollectionOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.renameCollection(oldName, newName, renameCollectionOptions)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        error_29 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error renaming collection!. \n Error: ".concat(error_29))];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        if (!!isFromSession) return [3 /*break*/, 9];
                        return [4 /*yield*/, client.close()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.redis.quit()];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function createCollection
     * @description Create a new collection on a server with the specified options. Use this to create capped collections. More information about command options available at https://www.mongodb.com/docs/manual/reference/command/create/
     * @param {string} collectionName
     * @param {CreateCollectionOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Collection<Document>>}
     */
    MongoModel.prototype.createCollection = function (collectionName, options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, createCollectionOptions, error_30;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("dbAdminUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 6, 9]);
                        createCollectionOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.createCollection(collectionName, createCollectionOptions)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        error_30 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error creating collection! \n Error:".concat(error_30))];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        if (!!isFromSession) return [3 /*break*/, 8];
                        return [4 /*yield*/, client.close()];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function dropDatabase
     * @description Drop a database, removing it permanently from the server.
     * @param {DropDatabaseOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<boolean>}
     */
    MongoModel.prototype.dropDatabase = function (options, clientOptions, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, dropDatabaseOptions, error_31;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("dbAdminUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, 7, 11]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 3:
                        _b.sent();
                        dropDatabaseOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.dropDatabase(dropDatabaseOptions)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        error_31 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error dropping database: ".concat(error_31))];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        if (!!isFromSession) return [3 /*break*/, 9];
                        return [4 /*yield*/, client.close()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.redis.quit()];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function findAndModify
     * @description Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
     * @param {Partial<this["modelColumns"]>} filter
     * @param {Partial<this["modelColumns"]>} update
     * @param {FindOneAndUpdateOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<WithId<Document> | null>}
     */
    MongoModel.prototype.findAndModify = function (filter, update, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, findAndModifyOptions, error_32;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 1:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, 7, 11]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 3:
                        _b.sent();
                        findAndModifyOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).findOneAndUpdate(filter, update, findAndModifyOptions)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        error_32 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error performing find and modify! \n Error: ".concat(error_32))];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        if (!!isFromSession) return [3 /*break*/, 9];
                        return [4 /*yield*/, client.close()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, this.redis.quit()];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function findOneAndDelete
     * @description Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
     * @param {Partial<this["modelColumns"]>} filter
     * @param {FindOneAndDeleteOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<WithId<Document> | null>}
     */
    MongoModel.prototype.findOneAndDelete = function (filter, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, findOneAndDeleteOptions, error_33;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, 8, 12]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 4:
                        _b.sent();
                        findOneAndDeleteOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).findOneAndDelete(filter, findOneAndDeleteOptions)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        error_33 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error performing find and delete! \n Error: ".concat(error_33))];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        if (!!isFromSession) return [3 /*break*/, 10];
                        return [4 /*yield*/, client.close()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.redis.quit()];
                    case 11:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function findOneAndUpdate
     * @description Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
     * @param {Partial<this["modelColumns"]>} filter
     * @param {Partial<this["modelColumns"]>} update
     * @param {FindOneAndUpdateOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<WithId<Document> | null>}
     */
    MongoModel.prototype.findOneAndUpdate = function (filter, update, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, findOneAndUpdateOptions, error_34;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.validateMongoTypes(update)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 3:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 7, 9, 13]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 5:
                        _b.sent();
                        findOneAndUpdateOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb
                                .collection(collection)
                                .findOneAndUpdate(filter, { $set: update }, findOneAndUpdateOptions)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        error_34 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error performing find and update! \n Error: ".concat(error_34))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function findOneAndReplace
     * @description Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.
     * @param {Partial<this["modelColumns"]>} filter
     * @param {WithoutId<Partial<this["modelColumns"]>>} replacement
     * @param {FindOneAndReplaceOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<WithId<Document> | null>}
     */
    MongoModel.prototype.findOneAndReplace = function (filter, replacement, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, findOneAndReplaceOptions, error_35;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.validateMongoTypes(replacement)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 3:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 7, 9, 13]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 5:
                        _b.sent();
                        findOneAndReplaceOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb
                                .collection(collection)
                                .findOneAndReplace(filter, replacement, findOneAndReplaceOptions)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        error_35 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Error performing find and replace! \n Error: ".concat(error_35))];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!!isFromSession) return [3 /*break*/, 11];
                        return [4 /*yield*/, client.close()];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [4 /*yield*/, this.redis.quit()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function insertOne
     * @description Inserts a single document into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document. This behavior can be overridden by setting the forceServerObjectId flag.
     * @param {OptionalId<Partial<this["modelColumns"]>>} document
     * @param {InsertOneOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<InsertOneResult<Document>>}
     */
    MongoModel.prototype.insertOne = function (document, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, insertOptions, error_36;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(document)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, 8, 12]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 4:
                        _b.sent();
                        insertOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).insertOne(document, insertOptions)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        error_36 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not insert the document! \n Error: ".concat(error_36))];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        if (!!isFromSession) return [3 /*break*/, 10];
                        return [4 /*yield*/, client.close()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.redis.quit()];
                    case 11:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function insertMany
     * @description Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document. This behavior can be overridden by setting the forceServerObjectId flag.
     * @param {OptionalId<Partial<this["modelColumns"]>>[]} documents
     * @param {BulkWriteOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<InsertManyResult<Filter<this["modelColumns"]>>>}
     */
    MongoModel.prototype.insertMany = function (documents, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, documents_1, document_1, _a, mongoDb, client, isFromSession, insertManyOptions, error_37;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, documents_1 = documents;
                        _b.label = 1;
                    case 1:
                        if (!(_i < documents_1.length)) return [3 /*break*/, 4];
                        document_1 = documents_1[_i];
                        return [4 /*yield*/, this.validateMongoTypes(document_1)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 5:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 9, 11, 15]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 7:
                        _b.sent();
                        insertManyOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).insertMany(documents, insertManyOptions)];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        error_37 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not insert the documents! \n Error: ".concat(error_37))];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11:
                        if (!!isFromSession) return [3 /*break*/, 13];
                        return [4 /*yield*/, client.close()];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [4 /*yield*/, this.redis.quit()];
                    case 14:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function bulkWrite
     * @description Perform a bulkWrite operation without a fluent API
     * @param {AnyBulkWriteOperation<this["modelColumns"]>[]} operations
     * @param {BulkWriteOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<BulkWriteResult>}
     */
    MongoModel.prototype.bulkWrite = function (operations, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, operations_1, operation, updateOp, updateOp, deleteOp, deleteOp, _a, mongoDb, client, isFromSession, bulkWriteOptions, error_38;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, operations_1 = operations;
                        _b.label = 1;
                    case 1:
                        if (!(_i < operations_1.length)) return [3 /*break*/, 14];
                        operation = operations_1[_i];
                        if (!("insertOne" in operation)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validateMongoTypes(operation.insertOne.document)];
                    case 2:
                        _b.sent(); // Strict validation for insertOne
                        _b.label = 3;
                    case 3:
                        if (!("updateOne" in operation)) return [3 /*break*/, 6];
                        updateOp = operation.updateOne;
                        return [4 /*yield*/, this.validateMongoTypes(updateOp.filter, true)];
                    case 4:
                        _b.sent();
                        if (!(updateOp.update && "$set" in updateOp.update)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.validateMongoTypes(updateOp.update.$set)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        if (!("updateMany" in operation)) return [3 /*break*/, 9];
                        updateOp = operation.updateMany;
                        return [4 /*yield*/, this.validateMongoTypes(updateOp.filter, true)];
                    case 7:
                        _b.sent();
                        if (!(updateOp.update && "$set" in updateOp.update)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.validateMongoTypes(updateOp.update.$set)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        if (!("deleteOne" in operation)) return [3 /*break*/, 11];
                        deleteOp = operation.deleteOne;
                        return [4 /*yield*/, this.validateMongoTypes(deleteOp.filter, true)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11:
                        if (!("deleteMany" in operation)) return [3 /*break*/, 13];
                        deleteOp = operation.deleteMany;
                        return [4 /*yield*/, this.validateMongoTypes(deleteOp.filter, true)];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13:
                        _i++;
                        return [3 /*break*/, 1];
                    case 14: return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 15:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 16;
                    case 16:
                        _b.trys.push([16, 19, 21, 25]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 17:
                        _b.sent();
                        bulkWriteOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).bulkWrite(operations, bulkWriteOptions)];
                    case 18: return [2 /*return*/, _b.sent()];
                    case 19:
                        error_38 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not perform the bulk write operation! \n Error: ".concat(error_38))];
                    case 20: return [2 /*return*/, _b.sent()];
                    case 21:
                        if (!!isFromSession) return [3 /*break*/, 23];
                        return [4 /*yield*/, client.close()];
                    case 22:
                        _b.sent();
                        _b.label = 23;
                    case 23: return [4 /*yield*/, this.redis.quit()];
                    case 24:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function deleteOne
     * @description Delete a document from a collection
     * @param {Partial<this["modelColumns"]> | undefined} filter
     * @param {DeleteOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<DeleteResult>}
     */
    MongoModel.prototype.deleteOne = function (filter, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, deleteOneOptions, error_39;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, 8, 12]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 4:
                        _b.sent();
                        deleteOneOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).deleteOne(filter, deleteOneOptions)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        error_39 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not delete the document! \n Error: ".concat(error_39))];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        if (!!isFromSession) return [3 /*break*/, 10];
                        return [4 /*yield*/, client.close()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.redis.quit()];
                    case 11:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function deleteMany
     * @description Delete multiple documents from a collection
     * @param {Partial<this["modelColumns"]> | undefined} filter
     * @param {DeleteOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<DeleteResult>}
     */
    MongoModel.prototype.deleteMany = function (filter, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, deleteManyOptions, error_40;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 2:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, 8, 12]);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 4:
                        _b.sent();
                        deleteManyOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).deleteMany(filter, deleteManyOptions)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6:
                        error_40 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not delete the documents! \n Error: ".concat(error_40))];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        if (!!isFromSession) return [3 /*break*/, 10];
                        return [4 /*yield*/, client.close()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.redis.quit()];
                    case 11:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function updateOne
     * @description Update a single document in a collection
     * @param {Partial<this["modelColumns"]>} filter
     * @param {Partial<this["modelColumns"]> | Partial<this["modelColumns"]>[]} update
     * @param {UpdateOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<UpdateResult<Document>>}
     */
    MongoModel.prototype.updateOne = function (filter, update, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, updateOneOptions, result, error_41;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.validateMongoTypes(update)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 3:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 9, 11, 15]);
                        cacheKey = "mongo:updateOne:".concat(collection);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 5:
                        _b.sent();
                        updateOneOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).updateOne(filter, { $set: update }, updateOneOptions)];
                    case 6:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/, result];
                    case 9:
                        error_41 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not update the document! \n Error: ".concat(error_41))];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11:
                        if (!!isFromSession) return [3 /*break*/, 13];
                        return [4 /*yield*/, client.close()];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [4 /*yield*/, this.redis.quit()];
                    case 14:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function updateMany
     * @description Update multiple documents in a collection
     * @param {Partial<this["modelColumns"]>} filter
     * @param {Partial<this["modelColumns"]> | Partial<this["modelColumns"]>[]} update
     * @param {UpdateOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<UpdateResult<Document>>}
     */
    MongoModel.prototype.updateMany = function (filter, update, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, updateManyOptions, result, error_42;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.validateMongoTypes(update)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 3:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 9, 11, 15]);
                        cacheKey = "mongo:updateMany:".concat(collection);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 5:
                        _b.sent();
                        updateManyOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).updateMany(filter, { $set: update }, updateManyOptions)];
                    case 6:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/, result];
                    case 9:
                        error_42 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not update the documents! \n Error: ".concat(error_42))];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11:
                        if (!!isFromSession) return [3 /*break*/, 13];
                        return [4 /*yield*/, client.close()];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [4 /*yield*/, this.redis.quit()];
                    case 14:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @async
     * @function replaceOne
     * @description Replace a document in a collection with another document
     * @param {Partial<this["modelColumns"]>} filter
     * @param {WithoutId<Partial<this["modelColumns"]>>} replacement
     * @param {ReplaceOptions} options
     * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
     * @param {string} collection
     * @param {string} dbName
     * @param {DbOptions} dbOptions
     * @throws {MongoException}
     * @returns {Promise<Document | UpdateResult<Document>>}
     */
    MongoModel.prototype.replaceOne = function (filter, replacement, options, clientOptions, collection, dbName, dbOptions) {
        if (options === void 0) { options = {}; }
        if (clientOptions === void 0) { clientOptions = undefined; }
        if (collection === void 0) { collection = this.collection; }
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (dbOptions === void 0) { dbOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, mongoDb, client, isFromSession, cacheKey, replaceOneOptions, result, error_43;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateMongoTypes(filter, true)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.validateMongoTypes(replacement)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getConnection("readWriteUser", dbName, dbOptions, clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.clientFromSession)];
                    case 3:
                        _a = _b.sent(), mongoDb = _a.mongoDb, client = _a.client, isFromSession = _a.isFromSession;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 9, 11, 15]);
                        cacheKey = "mongo:replaceOne:".concat(collection);
                        return [4 /*yield*/, this.redis.invalidateCacheForCollection("mongo", this.collection)];
                    case 5:
                        _b.sent();
                        replaceOneOptions = __assign(__assign({}, options), { session: clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.session });
                        return [4 /*yield*/, mongoDb.collection(collection).replaceOne(filter, replacement, replaceOneOptions)];
                    case 6:
                        result = (_b.sent());
                        if (!result) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.redis.cacheResult(cacheKey, result)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/, result];
                    case 9:
                        error_43 = _b.sent();
                        return [4 /*yield*/, this.handleException(MongoException_1.default, "Could not replace the document! \n Error: ".concat(error_43))];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11:
                        if (!!isFromSession) return [3 /*break*/, 13];
                        return [4 /*yield*/, client.close()];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [4 /*yield*/, this.redis.quit()];
                    case 14:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return MongoModel;
}());
exports.default = MongoModel;
