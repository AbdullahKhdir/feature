"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
var Application_1 = __importDefault(require("../../app/Application"));
var PDFDocument_1 = __importDefault(require("../../app/plugins/PDFDocument"));
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
    //******************************\\
    //* Model getter function      *\\
    //******************************\\
    Singleton.getModel = function (model_name) {
        if (model_name) {
            var Model = null;
            if (model_name === 'ExampleModel') {
                Model = require('../../app/models/example_model/' + model_name);
            }
            else {
                Model = require('../../app/models/shop/' + model_name);
            }
            if (Model) {
                return new Model();
            }
        }
        return;
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
