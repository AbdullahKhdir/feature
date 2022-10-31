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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var endpoints_1 = require("../api/apis_endpoints/endpoints");
var RuntimeException_1 = __importDefault(require("../exception/types/RuntimeException"));
var ExpressResponse_1 = require("../response/ExpressResponse");
var Singleton_1 = require("../Singleton/Singleton");
var Promise_1 = __importDefault(require("../utils/Promise"));
module.exports = /** @class */ (function (_super) {
    __extends(Routes, _super);
    function Routes() {
        var _this = _super.call(this) || this;
        /*
        * This line of code is responsible for the
        * difference between "/route" and "/route/"
        */
        var options = {
            caseSensitive: false,
            mergeParams: true,
            // If the parent and the child have conflicting param names, the child’s value take precedence.
            strict: false, // Enable strict routing.
        };
        _this.express = Singleton_1.Singleton.getExpress();
        _this.__ = Singleton_1.Singleton.getLodash();
        _this.express.getExpress.Router(options);
        _this.router = _this.express.getExpress.Router(options);
        /*
            ? DEMO OF THE CORS CONFIGURATIONS
        */
        _this.corsOptions = {
            origin: 'https://localhost:8010.com',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            preflightContinue: false,
            maxAge: 86400,
            allowedHeaders: ['Content-Type', 'Authorization'],
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        return _this;
    }
    /**
     * @function _
     * @description  gets an instance of the Routes class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {Routes}
     */
    Routes.prototype._ = function () {
        return this.router;
    };
    /**
     * @function Route
     * @description  Initiate new route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} method
     * @param {String} url
     * @param {Object} middleware
     * @param {Function} callback
     * @return ExpressRoute
    */
    Routes.prototype.route = function (method, url, middleware, callback) {
        if (typeof method === 'undefined' || method === '' || method == null) {
            return new RuntimeException_1.default('Route does not have an http method!');
        }
        if (typeof url === 'undefined' || url === '' || url == null) {
            return new RuntimeException_1.default('Route does not have an http url!');
        }
        if (typeof callback === 'undefined' || this.__.isString(callback) || callback == null) {
            return new RuntimeException_1.default('Route does not have a callback!');
        }
        if (typeof middleware !== 'object' && middleware.length <= 0 && typeof callback === 'function') {
            return new RuntimeException_1.default('Middlewares could not be implemented!');
        }
        var _middleware = [];
        for (var key in middleware) {
            if (Object.hasOwnProperty.call(middleware, key)) {
                _middleware.push(middleware[key]);
            }
        }
        if (this.__.capitalize(method) === 'Get' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().get(url, _middleware, (0, Promise_1.default)(callback));
        }
        if (this.__.capitalize(method) === 'Post' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().post(url, _middleware, (0, Promise_1.default)(callback));
        }
        if (this.__.capitalize(method) === 'Put' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().put(url, _middleware, (0, Promise_1.default)(callback));
        }
        if (this.__.capitalize(method) === 'Patch' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().patch(url, _middleware, (0, Promise_1.default)(callback));
        }
        if (this.__.capitalize(method) === 'Delete' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().delete(url, _middleware, (0, Promise_1.default)(callback));
        }
        return new RuntimeException_1.default('Route could not be deployed!');
    };
    /**
     * @function isApiEndpoint
     * @description  check if the url matches a string of api endpoints array
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Request} req
     * @return boolean
     */
    Routes.prototype.isApiEndpoint = function (req) {
        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                return true;
            }
        });
        return false;
    };
    return Routes;
}(ExpressResponse_1.ExpressResponse));
