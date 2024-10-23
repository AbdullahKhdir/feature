"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MongoDb_1 = __importDefault(require("../MongoDb"));
/**
 * @class InitiateMongoDB
 * @constructor
 * @description To start initiating the RBAC for mongoDB
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
var InitiateMongoDB = /** @class */ (function () {
    function InitiateMongoDB() {
    }
    InitiateMongoDB.execute = function () {
        MongoDb_1.default.intitateMongoDbForApplication();
    };
    return InitiateMongoDB;
}());
InitiateMongoDB.execute();
