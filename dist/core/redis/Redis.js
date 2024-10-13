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
var redis_1 = require("redis");
var config = __importStar(require("../config"));
var LogicException_1 = __importDefault(require("../exception/types/LogicException"));
module.exports = (_a = /** @class */ (function () {
        function Redis(options) {
            this.redis = (0, redis_1.createClient)(options);
            this.redis.on("error", function (err) {
                console.error("Redis Client Error:", err);
            });
        }
        /**
         * @static
         * @function getInstanceCount
         * @description Returns how many instances are currently initiated.
         * @returns {number}
         */
        Redis.getInstanceCount = function () {
            return Redis.instanceCount;
        };
        /**
         * @static
         * @function getRedisInstance
         * @description Inits or returns the Redis client instance
         * @returns {Redis}
         */
        Redis.getRedisInstance = function (options) {
            if (options === void 0) { options = {
                url: config.configurations().redisUrl,
                socket: {
                    port: config.configurations().redisSocket.redisSocketPort,
                    host: config.configurations().redisSocket.redisSocketHost,
                    keepAlive: config.configurations().redisSocket.redisKeepAlive,
                    noDelay: config.configurations().redisSocket.redisNoDelay,
                    reconnectStrategy: function (retries) { return Math.min(retries * 50, 2000); }
                },
                database: config.configurations().redisDatabase,
                disableOfflineQueue: config.configurations().redisDisableOfflineQueue
            }; }
            if (!this.instance) {
                this.instance = new Redis(options);
                Redis.instanceCount++;
            }
            return this.instance;
        };
        /**
         * @async
         * @function connect
         * @description Ensures that the client is connected.
         * @returns {Promise<void>}
         */
        Redis.prototype.connect = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.redis.isOpen) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.connect()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @description
         * Forcibly terminates the connection without sending the QUIT command.
           Typically used when you need to quickly close a connection without waiting for any remaining commands to be processed.
           This might leave some commands unprocessed, making it less ideal for most use cases.
         * @returns {Promise<void>}
         */
        Redis.prototype.disconnect = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redis.disconnect()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @description
         * Recommended for a clean shutdown.
           Gracefully closes the connection to the Redis server.
           It sends the QUIT command to the Redis server, which allows the server to close the connection cleanly.
           Ensures that any pending commands are completed before the connection is closed.
         * @returns {Promise<void>}
         */
        Redis.prototype.quit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis.isOpen) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.quit()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function redisSet
         * @description Sets a key and value for the query.
         * @returns {Promise<string | null>}
         */
        Redis.prototype.redisSet = function (key, value, options) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.set(key, value, options)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_1 = _a.sent();
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function redisGet
         * @description Retrieves the value from the Redis cache system of the saved query.
         * @param {string | Buffer} key - A placeholder as string or Buffer to get the saved query from that key.
         * @returns {Promise<string | null>}
         */
        Redis.prototype.redisGet = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_2 = _a.sent();
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function hSet
         * @description Sets a hash field-value pair or multiple fields at once.
         * @param {string | Buffer} key - The key of the hash.
         * @param {string | Buffer | Record<string, string | Buffer | number>} field - The field name or an object containing multiple fields.
         * @param {string | Buffer | number} [value] - The value for the specified field, required if the field is not an object.
         * @returns {Promise<number>} - The number of fields that were newly added.
         * @throws {LogicException} - Throws an error if value is required but not provided.
         */
        Redis.prototype.hSet = function (key, field, value) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            if (!(typeof field === "object" && !Buffer.isBuffer(field))) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.redis.hSet(key, field)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            if (!value) {
                                throw new LogicException_1.default("Value is required when setting a single field.");
                            }
                            return [4 /*yield*/, this.redis.hSet(key, field, value)];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5:
                            error_3 = _a.sent();
                            throw error_3;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function hGet
         * @description Retrieves the value of a hash field.
         * @param {string | Buffer} key - The key of the hash.
         * @param {string | Buffer} field - The field name within the hash.
         * @returns {Promise<string | Buffer | null>} - Returns the value of the field as a string or Buffer, or null if the field does not exist.
         */
        Redis.prototype.hGet = function (key, field) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.hGet(key, field)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, result !== null && result !== void 0 ? result : null];
                        case 3:
                            error_4 = _a.sent();
                            throw error_4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function hGetAll
         * @description Retrieves all fields and values of a hash as an object.
         * @param {string | Buffer} key - The key of the hash.
         * @returns {Promise<Record<string, string>>} - Returns an object where each key-value pair corresponds to a field and its value as strings.
         */
        Redis.prototype.hGetAll = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.hGetAll(key)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_5 = _a.sent();
                            throw error_5;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function hGetAllWithBuffers
         * @description Retrieves all fields and values of a hash as an object, converting values to Buffers if needed.
         * @param {string | Buffer} key - The key of the hash.
         * @returns {Promise<Record<string, string | Buffer>>} - Returns an object where each key-value pair corresponds to a field and its value.
         */
        Redis.prototype.hGetAllWithBuffers = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result, convertedResult, _i, _a, _b, field, value, error_6;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, this.redis.hGetAll(key)];
                        case 2:
                            result = _c.sent();
                            convertedResult = {};
                            for (_i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
                                _b = _a[_i], field = _b[0], value = _b[1];
                                convertedResult[field] = value;
                            }
                            return [2 /*return*/, convertedResult];
                        case 3:
                            error_6 = _c.sent();
                            throw error_6;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function lPush
         * @description Pushes one or more values to the head of a list.
         * @param {string | Buffer} key - The key of the list.
         * @param {...(string | Buffer | number)[]} values - One or more values to push to the list.
         * @returns {Promise<number>} - Returns the length of the list after the push operation.
         */
        Redis.prototype.lPush = function (key) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var stringValues, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            stringValues = values.map(function (value) { return value.toString(); });
                            return [4 /*yield*/, this.redis.lPush(key, stringValues)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_7 = _a.sent();
                            throw error_7;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function rPush
         * @description Pushes one or more values to the tail of a list.
         * @param {string | Buffer} key - The key of the list.
         * @param {...(string | Buffer | number)[]} values - One or more values to push to the list.
         * @returns {Promise<number>} - Returns the length of the list after the push operation.
         */
        Redis.prototype.rPush = function (key) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var stringValues, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            stringValues = values.map(function (value) { return value.toString(); });
                            return [4 /*yield*/, this.redis.rPush(key, stringValues)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_8 = _a.sent();
                            throw error_8;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function lPop
         * @description Removes and returns the first element of the list stored at the specified key.
         * @param {string | Buffer} key - The key of the list.
         * @returns {Promise<string | Buffer | null>} - Returns the value of the first element, or null if the list is empty or does not exist.
         */
        Redis.prototype.lPop = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.lPop(key)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, result !== null && result !== void 0 ? result : null];
                        case 3:
                            error_9 = _a.sent();
                            throw error_9;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function rPop
         * @description Removes and returns the last element of the list stored at the specified key.
         * @param {string | Buffer} key - The key of the list.
         * @returns {Promise<string | Buffer | null>} - Returns the value of the last element, or null if the list is empty or does not exist.
         */
        Redis.prototype.rPop = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.rPop(key)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, result !== null && result !== void 0 ? result : null];
                        case 3:
                            error_10 = _a.sent();
                            throw error_10;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function sAdd
         * @description Adds one or more members to a set. Automatically serializes objects.
         * @param {string | Buffer} key - The key of the set.
         * @param {...(string | Buffer | number | Object)[]} values - One or more values to add to the set.
         * @returns {Promise<number>} - Returns the number of elements that were added to the set (excluding duplicates).
         */
        Redis.prototype.sAdd = function (key) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var stringValues, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            stringValues = values.map(function (value) {
                                return typeof value === "object" && value !== null ? JSON.stringify(value) : value.toString();
                            });
                            return [4 /*yield*/, this.redis.sAdd(key, stringValues)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_11 = _a.sent();
                            throw error_11;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function sMembers
         * @description Retrieves and deserializes all objects from a Redis set.
         * @param {string | Buffer} key - The key of the set.
         * @returns {Promise<(Object | string)[]>} - Returns an array of deserialized objects or original strings.
         */
        Redis.prototype.sMembers = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var members, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.sMembers(key)];
                        case 2:
                            members = _a.sent();
                            return [2 /*return*/, members.map(function (member) {
                                    try {
                                        return JSON.parse(member);
                                    }
                                    catch (_a) {
                                        return member;
                                    }
                                })];
                        case 3:
                            error_12 = _a.sent();
                            throw error_12;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function sIsMember
         * @description Checks if a given value is a member of a set.
         * @param {string | Buffer} key - The key of the set.
         * @param {string | Buffer | number | Object} value - The value to check for membership in the set.
         * @returns {Promise<boolean>} - Returns true if the value is a member of the set, false otherwise.
         */
        Redis.prototype.sIsMember = function (key, value) {
            return __awaiter(this, void 0, void 0, function () {
                var stringValue, result, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            stringValue = typeof value === "object" && value !== null ? JSON.stringify(value) : value.toString();
                            return [4 /*yield*/, this.redis.sIsMember(key, stringValue)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, Boolean(result)];
                        case 3:
                            error_13 = _a.sent();
                            throw error_13;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function zAdd
         * @description Adds one or more members with scores to a sorted set.
         * @param {string | Buffer} key - The key of the sorted set.
         * @param {...{ score: number, member: string | Buffer | Object }} members - One or more members with scores to add to the sorted set.
         * @returns {Promise<number>} - Returns the number of new members added to the sorted set (not including updated members).
         */
        Redis.prototype.zAdd = function (key) {
            var members = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                members[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var formattedMembers, result, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.connect()];
                        case 2:
                            _a.sent();
                            formattedMembers = members.map(function (_a) {
                                var score = _a.score, member = _a.member;
                                return ({
                                    score: score,
                                    value: typeof member === "object" && member !== null ? JSON.stringify(member) : member.toString()
                                });
                            });
                            return [4 /*yield*/, this.redis.zAdd(key, formattedMembers.map(function (_a) {
                                    var score = _a.score, value = _a.value;
                                    return ({ score: score, value: value });
                                }))];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 4:
                            error_14 = _a.sent();
                            throw error_14;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function zRange
         * @description Retrieves a range of members from a sorted set based on rank or score.
         * @param {string} key - The key of the sorted set.
         * @param {number} start - The starting index or score.
         * @param {number} stop - The ending index or score.
         * @param {boolean} [withScores=false] - Whether to include scores in the result.
         * @returns {Promise<string[] | { member: string; score: number }[]>} - Returns an array of members or an array of objects with members and scores.
         */
        Redis.prototype.zRange = function (key, start, stop, withScores) {
            if (withScores === void 0) { withScores = false; }
            return __awaiter(this, void 0, void 0, function () {
                var result, _a, membersWithScores, i, member, score, error_15;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _b.sent();
                            if (!withScores) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.redis.zRange(key, start, stop, { WITHSCORES: true })];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.redis.zRange(key, start, stop)];
                        case 4:
                            _a = _b.sent();
                            _b.label = 5;
                        case 5:
                            result = _a;
                            if (withScores && Array.isArray(result)) {
                                membersWithScores = [];
                                for (i = 0; i < result.length; i += 2) {
                                    member = result[i];
                                    score = parseFloat(result[i + 1]);
                                    membersWithScores.push({ member: member, score: score });
                                }
                                return [2 /*return*/, membersWithScores];
                            }
                            return [2 /*return*/, result];
                        case 6:
                            error_15 = _b.sent();
                            throw error_15;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function zScore
         * @description Retrieves the score associated with a given member in a sorted set.
         * @param {string} key - The key of the sorted set.
         * @param {string | Buffer | number} member - The member whose score is to be retrieved.
         * @returns {Promise<number | null>} - Returns the score as a number if the member exists, or null if the member does not exist.
         */
        Redis.prototype.zScore = function (key, member) {
            return __awaiter(this, void 0, void 0, function () {
                var memberStr, result, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            memberStr = typeof member === "number" ? member.toString() : member;
                            return [4 /*yield*/, this.redis.zScore(key, memberStr)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, result !== null ? result : null];
                        case 3:
                            error_16 = _a.sent();
                            throw error_16;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         // todo useful for chat applications
         * @async
         * @function publish
         * @description Publishes a message to a specified channel.
         * @param {string} channel - The channel to publish the message to.
         * @param {string | Object} message - The message to be published. Objects are serialized to JSON.
         * @returns {Promise<number>} - Returns the number of subscribers that received the message.
         */
        Redis.prototype.publish = function (channel, message) {
            return __awaiter(this, void 0, void 0, function () {
                var messageStr, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            messageStr = typeof message === "object" ? JSON.stringify(message) : message;
                            return [4 /*yield*/, this.redis.publish(channel, messageStr)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_17 = _a.sent();
                            throw error_17;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         // todo useful for chat applications
         * @async
         * @function subscribe
         * @description Subscribes to a specified channel and handles incoming messages.
         * @example
            await subscribe('myChannel', (message) => {
                console.log('Message received from myChannel:', message);
            });
         * @param {string} channel - The channel to subscribe to.
         * @param {(message: string) => void} onMessage - Callback function to handle messages.
         * @returns {Promise<void>} - Resolves when subscription is set up.
         * @info connection must be quitted after calling unsubscription
         */
        Redis.prototype.subscribe = function (channel, onMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.subscribe(channel, function (message) {
                                    onMessage(message);
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_18 = _a.sent();
                            throw error_18;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function unsubscribe
         * @description unsubscribe from a channel and quit gracefully
         * @param {string} channel - channel name
         * @returns {Promise<void>}
         */
        Redis.prototype.unsubscribe = function (channel) {
            return __awaiter(this, void 0, void 0, function () {
                var error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.redis.unsubscribe(channel)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_19 = _a.sent();
                            throw error_19;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function executeMulti
         * @description Executes multiple Redis commands atomically using a transaction, with optional WATCH.
         * @param {string} key - The key to watch if `watch` is true.
         * @param {Array<(multi: ReturnType<typeof client.multi>) => Promise<void>>} operations - An array of functions that add commands to the multi block.
         * @param {boolean} watch - Indicates whether to watch the specified key before executing the transaction.
         * @returns {Promise<any[]>} - Returns an array of results for each command in the transaction.
         * @example
         * const results = await executeMulti('user:1', [
         *   async (multi) => multi.set('user:1:name', 'Alice'),
         *   async (multi) => multi.incr('user:1:loginCount')
         * ], true);
         * console.log(results);
         */
        Redis.prototype.executeMulti = function (key, operations, watch) {
            if (watch === void 0) { watch = false; }
            return __awaiter(this, void 0, void 0, function () {
                var multi, _i, operations_1, operation, results, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 10]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            if (!watch) return [3 /*break*/, 3];
                            //? Watch the specified key.
                            return [4 /*yield*/, this.redis.watch(key)];
                        case 2:
                            //? Watch the specified key.
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            multi = this.redis.multi();
                            _i = 0, operations_1 = operations;
                            _a.label = 4;
                        case 4:
                            if (!(_i < operations_1.length)) return [3 /*break*/, 7];
                            operation = operations_1[_i];
                            return [4 /*yield*/, operation(multi)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [4 /*yield*/, multi.exec()];
                        case 8:
                            results = _a.sent();
                            if (results === null) {
                                //? Transaction aborted due to changes on the watched key.
                                return [2 /*return*/, []];
                            }
                            //? Transaction results
                            return [2 /*return*/, results];
                        case 9:
                            error_20 = _a.sent();
                            throw error_20;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function expire
         * @description Sets an expiration time (TTL) for a key.
         * @param {string} key - The key for which to set the expiration time.
         * @param {number} seconds - The time-to-live (TTL) in seconds.
         * @returns {Promise<boolean>} - Returns true if the expiration time was set, false otherwise.
         * @example
         * const isExpiredSet = await expire('user:1:session', 3600);
         * console.log(isExpiredSet); // true if the TTL was successfully set, false otherwise.
         */
        Redis.prototype.expire = function (key, seconds) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_21;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.redis.connect()];
                        case 2:
                            _b.sent();
                            _a = Boolean;
                            return [4 /*yield*/, this.redis.expire(key, seconds)];
                        case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                        case 4:
                            error_21 = _b.sent();
                            throw error_21;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function xAdd
         * @description Adds an entry to a Redis stream.
         * @param {string} key - The name of the stream.
         * @param {string} id - The ID for the entry (use '*' to auto-generate based on time).
         * @param {Record<string, string | number>} fields - An object containing field-value pairs for the entry.
         * @returns {Promise<string>} - Returns the ID of the added entry.
         * @example
         * const entryId = await xAdd('mystream', '*', { user: 'alice', action: 'login' });
         * console.log('Entry ID:', entryId);
         */
        Redis.prototype.xAdd = function (key, id, fields, options) {
            if (id === void 0) { id = "*"; }
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var fieldValues, _i, _a, _b, field, value, entryId, error_22;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _c.sent();
                            fieldValues = [];
                            for (_i = 0, _a = Object.entries(fields); _i < _a.length; _i++) {
                                _b = _a[_i], field = _b[0], value = _b[1];
                                fieldValues.push(field, value.toString());
                            }
                            return [4 /*yield*/, this.redis.xAdd(key, id, fieldValues, options)];
                        case 2:
                            entryId = _c.sent();
                            return [2 /*return*/, entryId];
                        case 3:
                            error_22 = _c.sent();
                            throw error_22;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function xRange
         * @description Retrieves a range of entries from a Redis stream.
         * @param {string} key - The name of the stream.
         * @param {string} start - The starting ID of the range (use '0' for the beginning).
         * @param {string} end - The ending ID of the range (use '+' for the end).
         * @param {number} [count] - Optional. The maximum number of entries to retrieve.
         * @returns {Promise<Array<{ id: string, fields: Record<string, string> }>>} - Returns an array of stream entries.
         * @example
         * const entries = await xRange('mystream', '0', '+', 10);
         * console.log(entries);
         */
        Redis.prototype.xRange = function (key, start, end, count) {
            return __awaiter(this, void 0, void 0, function () {
                var options, result, entries, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            options = count !== undefined ? { COUNT: count } : undefined;
                            return [4 /*yield*/, this.redis.xRange(key, start, end, options)];
                        case 2:
                            result = _a.sent();
                            entries = result.map(function (_a) {
                                var id = _a.id, message = _a.message;
                                return { id: id, fields: message };
                            });
                            return [2 /*return*/, entries];
                        case 3:
                            error_23 = _a.sent();
                            throw error_23;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function del
         * @description Deletes one or more keys.
         * @param {...(string | Buffer)[]} keys - One or more keys to delete.
         * @returns {Promise<number>} - Returns the number of keys that were deleted.
         */
        Redis.prototype.del = function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var error_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.del(keys)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_24 = _a.sent();
                            throw error_24;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function incr
         * @description Increments the number stored at the key by one.
         * @param {string} key - The key of the number to increment.
         * @returns {Promise<number>} - Returns the new value of the key.
         */
        Redis.prototype.incr = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var error_25;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.incr(key)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_25 = _a.sent();
                            throw error_25;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function decr
         * @description Decrements the number stored at the key by one.
         * @param {string} key - The key of the number to decrement.
         * @returns {Promise<number>} - Returns the new value of the key.
         */
        Redis.prototype.decr = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var error_26;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.decr(key)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_26 = _a.sent();
                            throw error_26;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function incrBy
         * @description Increments the number stored at the key by a specified value.
         * @param {string} key - The key of the number to increment.
         * @param {number} increment - The value to increment by.
         * @returns {Promise<number>} - Returns the new value of the key.
         */
        Redis.prototype.incrBy = function (key, increment) {
            return __awaiter(this, void 0, void 0, function () {
                var error_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.incrBy(key, increment)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_27 = _a.sent();
                            throw error_27;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function decrBy
         * @description Decrements the number stored at the key by a specified value.
         * @param {string} key - The key of the number to decrement.
         * @param {number} decrement - The value to decrement by.
         * @returns {Promise<number>} - Returns the new value of the key.
         */
        Redis.prototype.decrBy = function (key, decrement) {
            return __awaiter(this, void 0, void 0, function () {
                var error_28;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.decrBy(key, decrement)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_28 = _a.sent();
                            throw error_28;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function setEx
         * @description Sets a key with an expiration time.
         * @param {string} key - The key to set.
         * @param {number} seconds - Time-to-live (TTL) in seconds.
         * @param {string | Buffer} value - The value to set.
         * @returns {Promise<string>} - Returns 'OK' if successful.
         */
        Redis.prototype.setEx = function (key, seconds, value) {
            return __awaiter(this, void 0, void 0, function () {
                var error_29;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.setEx(key, seconds, value)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_29 = _a.sent();
                            throw error_29;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function keys
         * @description Finds all keys matching a pattern.
         * @param {string} pattern - The pattern to match keys against (e.g., 'user:*').
         * @returns {Promise<string[]>} - Returns an array of matching keys.
         */
        Redis.prototype.keys = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var error_30;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.keys(pattern)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_30 = _a.sent();
                            throw error_30;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function exists
         * @description Checks if a key exists.
         * @param {string} key - The key to check.
         * @returns {Promise<boolean>} - Returns true if the key exists, false otherwise.
         */
        Redis.prototype.exists = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_31;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _b.sent();
                            _a = Boolean;
                            return [4 /*yield*/, this.redis.exists(key)];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                        case 3:
                            error_31 = _b.sent();
                            throw error_31;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function incrEx
         * @description Increments a key and sets a TTL if the key does not already exist.
         * @param {string} key - The key to increment.
         * @param {number} seconds - Time-to-live (TTL) in seconds if the key is created.
         * @returns {Promise<number>} - Returns the new value after increment.
         */
        Redis.prototype.incrEx = function (key, seconds) {
            return __awaiter(this, void 0, void 0, function () {
                var value, error_32;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.incr(key)];
                        case 2:
                            value = _a.sent();
                            if (!(value === 1)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.redis.expire(key, seconds)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, value];
                        case 5:
                            error_32 = _a.sent();
                            throw error_32;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function cacheResult
         * @description Stores a result in Redis with an expiry time.
         * @param {string} key - The key under which to store the result.
         * @param {any} value - The value to cache.
         * @param {number} expiration - Expiration time in seconds.
         * @returns {Promise<void>}
         */
        Redis.prototype.cacheResult = function (key, value, expiration) {
            if (expiration === void 0) { expiration = config.configurations().redisCacheExpiry; }
            return __awaiter(this, void 0, void 0, function () {
                var error_33;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.setEx(key, expiration, JSON.stringify(value))];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_33 = _a.sent();
                            throw error_33;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function getCachedResult
         * @description Retrieves a cached result from Redis.
         * @param {string} key - The key of the cached result.
         * @returns {Promise<any | null>}
         */
        Redis.prototype.getCachedResult = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_34;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.redisGet(key)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result ? JSON.parse(result) : null];
                        case 2:
                            error_34 = _a.sent();
                            throw error_34;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @async
         * @function invalidateCacheForCollection
         * @description Invalidating cache for a collection on wildcard *
         * @param {string} collectionName
         * @returns {Promise<void>}
         */
        Redis.prototype.invalidateCacheForCollection = function (prefix, collectionName) {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, keys;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "".concat(prefix, ":*:").concat(collectionName, "*");
                            return [4 /*yield*/, this.keys(pattern)];
                        case 1:
                            keys = _a.sent();
                            if (!(keys && keys.length)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.del.apply(this, keys)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return Redis;
    }()),
    _a.instanceCount = 0,
    _a);
