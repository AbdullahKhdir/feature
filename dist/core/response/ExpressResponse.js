'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressResponse = void 0;
var config = __importStar(require("../config"));
var Singleton_1 = require("../Singleton/Singleton");
/**
 * @class Response
 * @constructor
 * @description Class Response is used to define the Response Objects
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
// export = class ExpressResponse implements Response {
var ExpressResponse = /** @class */ (function () {
    function ExpressResponse(status_code, response_status, message) {
        if (message === void 0) { message = ''; }
        this.message = message;
        this.status_code = status_code;
        this.response_status = response_status;
        this.codes = Singleton_1.Singleton.getConstants();
        this.express = Singleton_1.Singleton.getExpress();
    }
    /**
     * @function renderAsJson
     * @description Sends a json response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Object data
     * @param Number status
     * @returns Response
    */
    ExpressResponse.prototype.renderAsJson = function (res, data, status) {
        if (status === void 0) { status = this.codes.HTTPS_STATUS.SUCCESS.OK; }
        res.type(this.codes.RESPONSE.TYPES.JSON);
        if (typeof this.status_code === 'undefined') {
            return res.status(status).json(ExpressResponse.sanitize(data));
        }
        return res.status(this.status_code).json(ExpressResponse.sanitize(data));
    };
    /**
     * @function render
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String template
     * @param Object options
     * @param Function callback
     * @param Number status
     * @returns Response
    */
    ExpressResponse.prototype.render = function (res, template, options, callback, status) {
        if (options === void 0) { options = {}; }
        if (callback === void 0) { callback = null; }
        if (status === void 0) { status = this.codes.HTTPS_STATUS.SUCCESS.OK; }
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof this.status_code === 'undefined') { // @ts-ignore 
            return res.status(status).render(template, options, callback);
        } // @ts-ignore 
        return res.status(this.status_code).render(template, options, callback);
    };
    /**
     * @function redirect
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String url
     * @param Number status
     * @returns Response
    */
    ExpressResponse.prototype.redirect = function (res, url, status) {
        if (status === void 0) { status = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY; }
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof this.status_code === 'undefined') {
            res.redirect(status, url);
            return res.end();
        }
        res.redirect(this.status_code, url);
        return res.end();
    };
    /**
     * @function toSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String url
     * @param Number status
     * @returns Response
    */
    ExpressResponse.prototype.toSameSite = function (res, status) {
        if (status === void 0) { status = this.codes.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT; }
        res.type(this.codes.RESPONSE.TYPES.HTML);
        res.redirect(status, res.req.route.path);
        return res.end();
    };
    /**
     * @function postToSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String url
     * @param Number status
     * @returns Response
    */
    ExpressResponse.prototype.postToSameSite = function (res, status) {
        if (status === void 0) { status = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY; }
        res.type(this.codes.RESPONSE.TYPES.HTML);
        res.redirect(status, res.req.route.path);
        return res.end();
    };
    /**
     * @function siteNotFound
     * @description 404 html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    ExpressResponse.prototype.siteNotFound = function (res) {
        return this.render(res, '404', { page_title: 'Page not found', path: '/404/' }, null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND);
    };
    /**
     * @function onErrorValidation
     * @description renders all the validation errors back to the user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Object errors
     * @returns Response
    */
    ExpressResponse.prototype.onErrorValidation = function (res, errors) {
        var status = null;
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof errors !== 'undefined') {
            if (errors.length >= 0) {
                var obj_warnings_1 = {};
                errors.forEach(function (error, index) {
                    var _a;
                    Object.assign(obj_warnings_1, (_a = {}, _a[index] = "".concat(error.msg), _a));
                });
                res.req.flash('validation_errors', JSON.stringify(obj_warnings_1));
            }
        }
        if (res.req.method === this.codes.REQUEST.TYPE.GET) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT;
        }
        else if (res.req.method === this.codes.REQUEST.TYPE.POST) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY;
        }
        res.redirect(status, res.req.route.path);
        return res.end();
    };
    /**
     * @function invalidCsrfResponse
     * @description 404 html page for invalid csrf response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    ExpressResponse.prototype.invalidCsrfResponse = function (res) {
        return this.render(res, '404', {
            page_title: 'Post request was interrupted!',
            path: '/404/',
            is_authenticated: null,
            error: 'Invalid CSRF token',
            warning: 'Please do not alter or delete the csrf token!',
            success: null
        }, null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN);
    };
    /**
     * @function onError
     * @description 404 html page on throwing an error
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
     // TODO: Create and design general error page
    */
    ExpressResponse.prototype.onError = function (res, error) {
        if (error === void 0) { error = ''; }
        if (config.configurations().environment === 'development') {
            return this.render(res, '404', {
                page_title: 'Unexpected Error!',
                path: '/404/',
                is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                error: error.toString(),
                warning: error.toString(),
                success: null
            }, null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN);
        }
        else if (config.configurations().environment === 'production') {
            return this.render(res, '404', {
                page_title: 'Unexpected Error!',
                path: '/404/',
                is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                warning: 'Please contact the support team!'
            }, null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN);
        }
        return res.end();
    };
    /**
     * @function send
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String body
     * @param Number status
     * @returns Response
    */
    ExpressResponse.prototype.send = function (res, body, status) {
        if (status === void 0) { status = this.codes.HTTPS_STATUS.SUCCESS.OK; }
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof this.status_code === 'undefined') {
            res.status(status).send(body);
            return res.end();
        }
        res.status(this.status_code).send(body);
        return res.end();
    };
    /**
     * @function sanitize
     * @description Prepares and cleans the json data to be send in the response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns object
    */
    ExpressResponse.sanitize = function (response) {
        var clone = {};
        Object.assign(clone, response);
        for (var i in clone)
            if (typeof clone[i] === 'undefined')
                delete clone[i];
        return clone;
    };
    return ExpressResponse;
}());
exports.ExpressResponse = ExpressResponse;