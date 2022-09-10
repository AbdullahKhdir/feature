'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Express = void 0;
var workerpool_1 = __importDefault(require("../worker_pool/workerpool"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
/**
 * @class Express
 * @constructor
 * @description Class Express to define and initiate the express framework
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
var Express = /** @class */ (function () {
    function Express() {
        this.framework = express_1.default;
        this.express_cors = cors_1.default;
    }
    Express.getExpressInstance = function () {
        if (this.express_instance) {
            return this.express_instance;
        }
        return this.express_instance = new Express();
    };
    Object.defineProperty(Express.prototype, "getExpress", {
        get: function () {
            return this.framework;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @function getWorkerPool
     * @description Returns an instance of the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Workerpool
    */
    Express.prototype.getWorkerPool = function () {
        return workerpool_1.default.getWorkerPoolInstance();
    };
    return Express;
}());
exports.Express = Express;
