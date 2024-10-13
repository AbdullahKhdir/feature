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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
var socket_io_1 = __importDefault(require("socket.io"));
var Application_1 = __importDefault(require("../../app/Application"));
var PDFDocument_1 = __importDefault(require("../../app/plugins/PDFDocument"));
var Uploader_1 = __importDefault(require("../../app/plugins/Uploader"));
var Constants_1 = __importDefault(require("../../app/utils/Constants"));
var Lodash_1 = __importDefault(require("../../app/utils/Lodash"));
var Api_1 = __importDefault(require("../api/Api"));
var Database_1 = __importDefault(require("../database/Database"));
var Express_1 = require("../framework/Express");
var Bodyparser_1 = __importDefault(require("../node/Bodyparser"));
var FileSystem_1 = __importDefault(require("../node/FileSystem"));
var Path_1 = __importDefault(require("../node/Path"));
var Pagination_1 = __importDefault(require("../utils/Pagination"));
var I18next_1 = __importDefault(require("../../app/plugins/I18next"));
var ExpressSession_1 = __importDefault(require("../framework/ExpressSession"));
var MongoDb_1 = __importDefault(require("../database/MongoDb"));
var config = __importStar(require("../config"));
var Redis_1 = __importDefault(require("../redis/Redis"));
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
    //*******************************\\
    //* Pagination getter functions *\\
    //*******************************\\
    Singleton.getPagination = function () {
        return Pagination_1.default.getPagination();
    };
    //*****************************\\
    //* Database getter functions *\\
    //*****************************\\
    Singleton.getDb = function () {
        return Database_1.default.getDbInstance();
    };
    Singleton.getDbSession = function () {
        return Database_1.default.getDbInstance().getMysqlInstance;
    };
    //**************************************************\\
    //* API getter function *\\
    //**************************************************\\
    Singleton.getApis = function () {
        if (this.apis) {
            return this.apis;
        }
        return (this.apis = new Api_1.default());
    };
    Singleton.getRedisInstance = function (options) {
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
        return Redis_1.default.getRedisInstance(options);
    };
    //**************************************************\\
    //* Database and Express Sessions getter functions *\\
    //**************************************************\\
    Singleton.getExpressSession = function () {
        if (!ExpressSession_1.default.expressSession) {
            new ExpressSession_1.default();
        }
        return ExpressSession_1.default.expressSession;
    };
    Singleton.getMysqlStore = function () {
        return this.getDb().getMysqlStore;
    };
    Object.defineProperty(Singleton, "pool", {
        /**
         * @function getTransaction
         * @version 1.0.0
         * @description initializes the connection object to have connection object
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns {Promise<PoolConnection>}
         */
        get: function () {
            return Singleton.getDb().pool;
        },
        enumerable: false,
        configurable: true
    });
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
    //***************************\\
    //* I18next getter function *\\
    //***************************\\
    Singleton.getI18n = function () {
        return I18next_1.default.getI18nextInstance();
    };
    //*****************************\\
    //* Constants getter function *\\
    //*****************************\\
    Singleton.getConstants = function () {
        return Constants_1.default.getConstantsInstance();
    };
    Singleton.getConstantsInstance = function () {
        return Constants_1.default.instance();
    };
    Singleton.getMongoDbInstance = function (username, dbName, serverApi) {
        if (dbName === void 0) { dbName = config.configurations().mongoDbName; }
        if (serverApi === void 0) { serverApi = {
            version: "1",
            strict: true,
            deprecationErrors: true
        }; }
        return MongoDb_1.default.getInstance(username, dbName, serverApi);
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
        return Uploader_1.default.getUploaderInstance().getMulter;
    };
    Singleton.configUploader = function (options, instance) {
        if (instance === void 0) { instance = Singleton.getUploader(); }
        return Uploader_1.default.getUploaderInstance().configureUploader(options, instance);
    };
    Singleton.buildUploader = function (options) {
        return Uploader_1.default.getUploaderInstance()._buildUploader(options);
    };
    Singleton.asyncUploader = function (req, res, uploader) {
        return Uploader_1.default.getUploaderInstance().asyncUpload(req, res, uploader);
    };
    //******************************\\
    //* FileSystem getter function *\\
    //******************************\\
    Singleton.getPromisifyFileSystem = function () {
        return FileSystem_1.default.getPromisifyFileSystemInstance();
    };
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
            return (this.instance = new Singleton());
        },
        enumerable: false,
        configurable: true
    });
    //******************************\\
    //* Model getter function      *\\
    //******************************\\
    Singleton.getModel = function (model_name) {
        if (model_name) {
            var Model = null;
            if (model_name === "ExampleModel") {
                Model = require("../../app/models/example_model/" + model_name);
            }
            else {
                Model = require("../../app/models/shop/" + model_name);
            }
            if (Model) {
                return new Model();
            }
        }
        return;
    };
    //*******************************\\
    //* Server getter function      *\\
    //*******************************\\
    Singleton.setSocket = function (server) {
        if (this.io_instance) {
            return this.io_instance;
        }
        return (this.io_instance = new socket_io_1.default.Server(server));
    };
    //*******************************\\
    //* PDFDocument getter function *\\
    //*******************************\\
    Singleton.getPdfMaker = function () {
        return PDFDocument_1.default.getPDFDocumentInstance().getPdfKit;
    };
    return Singleton;
}());
exports.Singleton = Singleton;
