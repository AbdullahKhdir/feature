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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
var mongodb_1 = require("mongodb");
var config = __importStar(require("../config"));
var MongoException_1 = __importDefault(require("../exception/types/MongoException"));
var Singleton_1 = require("../Singleton/Singleton");
module.exports = (_a = /** @class */ (function () {
        function MongoDb(username, password, serverApi, dbName, authSource) {
            if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
            if (authSource === void 0) { authSource = config.configurations().mongoDbName; }
            this.client = new mongodb_1.MongoClient(config
                .configurations()
                .mongoDbUri.replace("<username>", username)
                .replace("<password>", encodeURIComponent(password))
                .replace("<database>", dbName)
                .replace("<replicaSet>", config.configurations().mongoReplicaSet)
                .replace("<authSource>", authSource), Object.assign({}, config.configurations().mongoDbOptions, serverApi.version && serverApi.strict && serverApi.deprecationErrors ? { serverApi: serverApi } : {}));
        }
        /**
         * @function getInstance
         * @description gets the mongoDB instance
         * @returns {MongoDb}
         */
        MongoDb.getInstance = function (username, dbName, serverApi) {
            if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
            if (serverApi === void 0) { serverApi = {
                version: "1",
                strict: true,
                deprecationErrors: true
            }; }
            var notAdminUsers = [
                "readUser",
                "readWriteUser",
                "dbAdminUser",
                "userAdminUser",
                "dbOwnerUser",
                "enableShardingUser"
            ];
            if (!MongoDb.instance) {
                MongoDb.instance = new MongoDb(username, config.configurations()["".concat(username, "Password")], serverApi.version && serverApi.deprecationErrors && serverApi.strict
                    ? {
                        version: serverApi.version,
                        deprecationErrors: serverApi.deprecationErrors,
                        strict: serverApi.strict
                    }
                    : {}, dbName, notAdminUsers.includes(username)
                    ? config.configurations().mongoDbName
                    : config.configurations().mongoAdminDb);
                MongoDb.instanceCount++;
            }
            return MongoDb.instance;
        };
        /**
         * @async
         * @function pool
         * @description gets the pool property
         * @returns {Promise<MongoClient>}
         */
        MongoDb.prototype.pool = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client];
                });
            });
        };
        /**
         * @async
         * @function db
         * @description gets the db property
         * @returns {Promise<Db>}
         */
        MongoDb.prototype.db = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.dbObject];
                });
            });
        };
        /**
         * @async
         * @function getConnection
         * @description getConnection
         * @returns {Promise<MongoClient>}
         */
        MongoDb.prototype.getConnection = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isMongoDBConnected()];
                        case 1:
                            if (!(_a.sent())) {
                                throw new MongoException_1.default("Connection to MongoDB is not established!");
                            }
                            return [2 /*return*/, this.connectionObject];
                    }
                });
            });
        };
        /**
         * @async
         * @description connects to mongoDB
         * @param client - placeholder for a client
         * @returns {Promise<any>}
         */
        MongoDb.prototype.connect = function (client) {
            if (client === void 0) { client = this.client; }
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, error_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.isMongoDBConnected(client, config.configurations().mongoDbName)];
                        case 1:
                            if (!!(_d.sent())) return [3 /*break*/, 4];
                            _a = this;
                            return [4 /*yield*/, client.connect()];
                        case 2:
                            _a.connectionObject = _d.sent();
                            _c = (_b = MongoDb.poolStatus).push;
                            return [4 /*yield*/, this.connectionPoolStatus(client)];
                        case 3:
                            _c.apply(_b, [_d.sent()]);
                            _d.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_1 = _d.sent();
                            throw new MongoException_1.default("Could not establish connection for MongoDB! \n Error: ".concat(error_1));
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function close
         * @description closes the connection
         * @returns {Promise<any>}
         */
        MongoDb.prototype.close = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.close()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            throw new MongoException_1.default("Could not close the MongoDB connection! \n Error: ".concat(error_2));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function isMongoDBConnected
         * @param client - placeholder for client
         * @param dbName - placeholder for database name
         * @returns {Promise<boolean>}
         */
        MongoDb.prototype.isMongoDBConnected = function (client, dbName) {
            if (client === void 0) { client = this.client; }
            if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, client.db(dbName).command({ ping: 1 })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            error_3 = _a.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @function connectionPoolStatus
         * @param client
         * @returns {Promise<{count: Function; cleanUp: Function;}>}
         */
        MongoDb.prototype.connectionPoolStatus = function (client) {
            return __awaiter(this, void 0, void 0, function () {
                function onCheckout() {
                    checkedOut++;
                }
                function onCheckin() {
                    checkedOut--;
                }
                function onClose() {
                    client.removeListener("connectionCheckedOut", onCheckout);
                    client.removeListener("connectionCheckedIn", onCheckin);
                    checkedOut = NaN;
                }
                var checkedOut;
                return __generator(this, function (_a) {
                    checkedOut = 0;
                    // Decreases count of connections checked out of the pool when connectionCheckedIn event is triggered
                    client.on("connectionCheckedIn", onCheckin);
                    // Increases count of connections checked out of the pool when connectionCheckedOut event is triggered
                    client.on("connectionCheckedOut", onCheckout);
                    // Cleans up event listeners when client is closed
                    client.on("close", onClose);
                    return [2 /*return*/, {
                            count: function () { return checkedOut; },
                            cleanUp: onClose
                        }];
                });
            });
        };
        /**
         * @function getInstanceCount
         * @description gets how many times the instance has been initated
         * @returns {number}
         */
        MongoDb.getInstanceCount = function () {
            return MongoDb.instanceCount;
        };
        /**
         * @async
         * @description a function that creates mongoDB and initiate the user roles for read, readWrite, userAdmin and admin
         * @returns {Promise<any>}
         */
        MongoDb.intitateMongoDbForApplication = function () {
            return __awaiter(this, void 0, void 0, function () {
                var constants, rowClientConnection, rowDbConnection, adminDocuments, _i, adminDocuments_1, user, mongoDbDocuments, _a, mongoDbDocuments_1, user, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            constants = Singleton_1.Singleton.getConstants();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 10, , 11]);
                            rowClientConnection = new mongodb_1.MongoClient(config.configurations().mongoDbRowUri, Object.assign({}, config.configurations().mongoDbOptions));
                            rowDbConnection = rowClientConnection.db(config.configurations().mongoDbRowUri, {});
                            adminDocuments = [
                                {
                                    name: config.configurations().__systemUser,
                                    password: encodeURIComponent(config.configurations().__systemUserPassword),
                                    role: constants.MONGO_DB.RBAC.INTERNAL_AND_SPECIAL_ROLES.__system
                                },
                                {
                                    name: config.configurations().internalUser,
                                    password: encodeURIComponent(config.configurations().internalUserPassword),
                                    role: constants.MONGO_DB.RBAC.INTERNAL_AND_SPECIAL_ROLES.internal
                                },
                                {
                                    name: config.configurations().rootUser,
                                    password: encodeURIComponent(config.configurations().rootUserPassword),
                                    role: constants.MONGO_DB.RBAC.SUPERUSER_ROLES.root
                                },
                                {
                                    name: config.configurations().readAnyDatabaseUser,
                                    password: encodeURIComponent(config.configurations().readAnyDatabaseUserPassword),
                                    role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.readAnyDatabase
                                },
                                {
                                    name: config.configurations().readWriteAnyDatabaseUser,
                                    password: encodeURIComponent(config.configurations().readWriteAnyDatabaseUserPassword),
                                    role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.readWriteAnyDatabase
                                },
                                {
                                    name: config.configurations().userAdminAnyDatabaseUser,
                                    password: encodeURIComponent(config.configurations().userAdminAnyDatabaseUserPassword),
                                    role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.userAdminAnyDatabase
                                },
                                {
                                    name: config.configurations().dbAdminAnyDatabaseUser,
                                    password: encodeURIComponent(config.configurations().dbAdminAnyDatabaseUserPassword),
                                    role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.dbAdminAnyDatabase
                                },
                                {
                                    name: config.configurations().readUser,
                                    password: encodeURIComponent(config.configurations().readUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.read
                                },
                                {
                                    name: config.configurations().readWriteUser,
                                    password: encodeURIComponent(config.configurations().readWriteUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.readWrite
                                },
                                {
                                    name: config.configurations().dbAdminUser,
                                    password: encodeURIComponent(config.configurations().dbAdminUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.dbAdmin
                                },
                                {
                                    name: config.configurations().userAdminUser,
                                    password: encodeURIComponent(config.configurations().userAdminUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.userAdmin
                                },
                                {
                                    name: config.configurations().dbOwnerUser,
                                    password: encodeURIComponent(config.configurations().dbOwnerUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.dbOwner
                                },
                                {
                                    name: config.configurations().enableShardingUser,
                                    password: encodeURIComponent(config.configurations().enableShardingUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.enableSharding
                                },
                                {
                                    name: config.configurations().clusterAdminUser,
                                    password: encodeURIComponent(config.configurations().clusterAdminUserPassword),
                                    role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.clusterAdmin
                                },
                                {
                                    name: config.configurations().clusterManagerUser,
                                    password: encodeURIComponent(config.configurations().clusterManagerUserPassword),
                                    role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.clusterManager
                                },
                                {
                                    name: config.configurations().clusterMonitorUser,
                                    password: encodeURIComponent(config.configurations().clusterMonitorUserPassword),
                                    role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.clusterMonitor
                                },
                                {
                                    name: config.configurations().hostManagerUser,
                                    password: encodeURIComponent(config.configurations().hostManagerUserPassword),
                                    role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.hostManager
                                },
                                {
                                    name: config.configurations().backupUser,
                                    password: encodeURIComponent(config.configurations().backupUserPassword),
                                    role: constants.MONGO_DB.RBAC.Backup_And_Restoration_Roles.backup
                                },
                                {
                                    name: config.configurations().restoreUser,
                                    password: encodeURIComponent(config.configurations().restoreUserPassword),
                                    role: constants.MONGO_DB.RBAC.Backup_And_Restoration_Roles.restore
                                }
                            ];
                            _i = 0, adminDocuments_1 = adminDocuments;
                            _b.label = 2;
                        case 2:
                            if (!(_i < adminDocuments_1.length)) return [3 /*break*/, 5];
                            user = adminDocuments_1[_i];
                            return [4 /*yield*/, rowDbConnection.command({
                                    createUser: user.name,
                                    pwd: user.password,
                                    roles: [{ role: user.role, db: config.configurations().mongoAdminDb }]
                                }, {})];
                        case 3:
                            _b.sent();
                            console.log(constants.COLORS.BgGreen, "\u2714 User ".concat(user.name, " with the role ").concat(user.role, " for the database ").concat(config.configurations().mongoAdminDb, " created successfully \u2714."));
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            mongoDbDocuments = [
                                {
                                    name: config.configurations().readUser,
                                    password: encodeURIComponent(config.configurations().readUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.read
                                },
                                {
                                    name: config.configurations().readWriteUser,
                                    password: encodeURIComponent(config.configurations().readWriteUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.readWrite
                                },
                                {
                                    name: config.configurations().dbAdminUser,
                                    password: encodeURIComponent(config.configurations().dbAdminUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.dbAdmin
                                },
                                {
                                    name: config.configurations().userAdminUser,
                                    password: encodeURIComponent(config.configurations().userAdminUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.userAdmin
                                },
                                {
                                    name: config.configurations().dbOwnerUser,
                                    password: encodeURIComponent(config.configurations().dbOwnerUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.dbOwner
                                },
                                {
                                    name: config.configurations().enableShardingUser,
                                    password: encodeURIComponent(config.configurations().enableShardingUserPassword),
                                    role: constants.MONGO_DB.RBAC.USER_ROLES.enableSharding
                                }
                            ];
                            _a = 0, mongoDbDocuments_1 = mongoDbDocuments;
                            _b.label = 6;
                        case 6:
                            if (!(_a < mongoDbDocuments_1.length)) return [3 /*break*/, 9];
                            user = mongoDbDocuments_1[_a];
                            return [4 /*yield*/, rowDbConnection.command({
                                    createUser: user.name,
                                    pwd: user.password,
                                    roles: [{ role: user.role, db: config.configurations().mongoDbName }]
                                }, {})];
                        case 7:
                            _b.sent();
                            console.log(constants.COLORS.BgGreen, "\u2714 User ".concat(user.name, " with the role ").concat(user.role, " for the database ").concat(config.configurations().mongoDbName, " created successfully \u2714."));
                            _b.label = 8;
                        case 8:
                            _a++;
                            return [3 /*break*/, 6];
                        case 9:
                            console.log("Restart MongoDB with authentication enabled in the configuration file and add replicaSet to enable the transactions.");
                            return [3 /*break*/, 11];
                        case 10:
                            error_4 = _b.sent();
                            console.error(constants.COLORS.BgRed, "\u00D7\u00D7 Error initializing MongoDB \u00D7\u00D7 \n Error:", error_4);
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        return MongoDb;
    }()),
    _a.instanceCount = 0,
    _a.poolStatus = [],
    _a);
