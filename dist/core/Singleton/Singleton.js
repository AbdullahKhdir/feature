"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
var Application_1 = __importDefault(require("../../app/Application"));
var Uploader_1 = __importDefault(require("../../app/plugins/Uploader"));
var Constants_1 = __importDefault(require("../../app/utils/Constants"));
var Lodash_1 = __importDefault(require("../../app/utils/Lodash"));
var Db_1 = __importDefault(require("../database/Db"));
var Express_1 = require("../framework/Express");
var Bodyparser_1 = __importDefault(require("../node/Bodyparser"));
var FileSystem_1 = __importDefault(require("../node/FileSystem"));
var Path_1 = __importDefault(require("../node/Path"));
/**
 * @class Singleton
 * @constructor
 * @description
 * Class Singleton is used to get instances of all singleton classes and plugins
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
var Singleton = /** @class */ (function () {
    function Singleton() {
    }
    //*****************************\\
    //* Database getter functions *\\
    //*****************************\\
    Singleton.getDb = function () {
        return Db_1.default.getDbInstance();
    };
    Singleton.getDbSession = function () {
        return Db_1.default.getDbInstance().getMysqlInstance;
    };
    //**************************************************\\
    //* Database and Express Sessions getter functions *\\
    //**************************************************\\
    Singleton.getExpressSession = function () {
        // return ExpressSession.getExpressSessionInstance();
    };
    Singleton.getExpressMysqlSession = function () {
        // return ExpressMysqlSession.getExpressMysqlSessionInstance();
    };
    //****************************\\
    //* Express getter functions *\\
    //****************************\\
    Singleton.getExpress = function () {
        return Express_1.Express.getExpressInstance();
    };
    Singleton.getWorkerPool = function () {
        return Express_1.Express.getExpressInstance().getWorkerPool();
    };
    //*******************************\\
    //* Application getter function *\\
    //*******************************\\
    Singleton.getApplication = function () {
        return Application_1.default.getAppInstance;
    };
    Singleton.getExpressApp = function () {
        return Application_1.default.getAppInstance.getActiveExpress;
    };
    //**************************\\
    //* Lodash getter function *\\
    //**************************\\
    Singleton.getLodash = function () {
        return Lodash_1.default.getLodashInstance();
    };
    //*****************************\\
    //* Constants getter function *\\
    //*****************************\\
    Singleton.getConstants = function () {
        return Constants_1.default.getConstantsInstance();
    };
    //************************\\
    //* Path getter function *\\
    //************************\\
    Singleton.getPath = function () {
        return Path_1.default.getPathInstance();
    };
    //************************\\
    //* Path getter function *\\
    //************************\\
    Singleton.getUploader = function () {
        return Uploader_1.default.getMulterInstance();
    };
    //******************************\\
    //* FileSystem getter function *\\
    //******************************\\
    Singleton.getFileSystem = function () {
        return FileSystem_1.default.getFileSystemInstance();
    };
    //******************************\\
    //* BodyParser getter function *\\
    //******************************\\
    Singleton.getBodyParser = function () {
        return Bodyparser_1.default.getBodyParserInstance();
    };
    Object.defineProperty(Singleton, "getSingletonInstance", {
        //******************************\\
        //* Singleton getter function *\\
        //******************************\\
        get: function () {
            if (this.instance) {
                return this.instance;
            }
            return this.instance = new Singleton();
        },
        enumerable: false,
        configurable: true
    });
    return Singleton;
}());
exports.Singleton = Singleton;
