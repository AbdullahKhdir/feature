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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressResponse = void 0;
var node_fs_1 = require("node:fs");
var config = __importStar(require("../config"));
var ApiException_1 = __importDefault(require("../exception/ApiException"));
var Singleton_1 = require("../Singleton/Singleton");
var undefined_routes_logic_1 = require("../utils/undefined-routes-logic");
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
        // res.redirect(status, res.req.route.path);
        res.redirect(status, res.req.url);
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
     * @description undefined_routes html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    ExpressResponse.prototype.siteNotFound = function (res) {
        return this.render(res, 'undefined_routes', (0, undefined_routes_logic_1.siteNotFound)(res), null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND);
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
            if (typeof errors === 'object' && typeof errors[Symbol.iterator] === 'function') {
                if (errors.length >= 0) {
                    var obj_warnings_1 = {};
                    var errored_params_1 = {};
                    errors.forEach(function (error, index) {
                        var _a, _b;
                        Object.assign(obj_warnings_1, (_a = {}, _a[index] = "".concat(error.msg), _a));
                        Object.assign(errored_params_1, (_b = {}, _b[index] = "".concat(error.param), _b));
                    });
                    res.req.flash('validation_errors', JSON.stringify(obj_warnings_1));
                    res.req.flash('errored_inputs', JSON.stringify(errored_params_1));
                }
            }
            else if (typeof errors === 'string') {
                var error = errors;
                res.req.flash('validation_errors', JSON.stringify({ error: error }));
                res.req.flash('errored_inputs', JSON.stringify({ error: error }));
            }
        }
        if (res.req.method === this.codes.REQUEST.TYPE.GET) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT;
        }
        else if (res.req.method === this.codes.REQUEST.TYPE.POST) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY;
        }
        res.redirect(status, res.req.url);
        return res.end();
    };
    /**
     * @function onErrorValidation
     * @description renders all the validation errors back to the user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Object errors
     * @returns Response
    */
    ExpressResponse.prototype.sendPdf = function (res, pdf, pdf_name, to_download) {
        if (pdf_name === void 0) { pdf_name = 'pdf'; }
        if (to_download === void 0) { to_download = false; }
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        res.setHeader('Content-Type', this.codes.RESPONSE.TYPES.PDF);
        res.setHeader('Content-Disposition', "".concat(to_download ? 'attachment' : 'inline', "; filename=\"").concat(year, "_").concat(month, "_").concat(day, "_").concat(hours, "_").concat(minutes, "_").concat(pdf_name, "\""));
        if (pdf instanceof node_fs_1.ReadStream) {
            return pdf.pipe(res);
        }
        else {
            pdf.pipe(res);
            return pdf.end();
        }
    };
    /**
     * @function invalidCsrfResponse
     * @description undefined_routes html page for invalid csrf response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    ExpressResponse.prototype.invalidCsrfResponse = function (req, res) {
        return this.render(res, 'undefined_routes', (0, undefined_routes_logic_1.csrf)(res), null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN);
    };
    /**
     * @function onError
     * @description undefined_routes html page on throwing an error
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    ExpressResponse.prototype.onError = function (res, next, error) {
        var _a, _b, _c, _d;
        if (config.configurations().environment === 'development') {
            if (typeof error === 'string') {
                var _error_1 = new Error(error);
                //@ts-ignore
                _error_1.statusCode = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(_error_1);
            }
            else if (error instanceof Error) {
                // @ts-ignore
                error.statusCode = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(error);
            }
            else if (typeof error === 'object' && typeof error !== 'string'
                && typeof error !== 'function' && typeof error !== 'boolean'
                && typeof error !== 'number') {
                return next(error);
            }
            return this.render(res, 'undefined_routes', {
                nav_title: '',
                path: '/undefined_routes/',
                is_authenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.is_authenticated,
                error: null,
                warning: null,
                success: null,
                status_code: 500,
                status_title: "Unexpected error",
                status_description: Singleton_1.Singleton.getLodash().capitalize(error_message) || "Please contact the support team!",
                url: '/',
                label: 'Home'
            }, null, this.codes.HTTPS_STATUS.SERVER_ERRORS.SERVICE_UNAVAILABLE);
        }
        else if (config.configurations().environment === 'production') {
            var error_message = '';
            if (error instanceof Error && error instanceof ApiException_1.default) {
                // @ts-ignore
                error.statusCode = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(error);
            }
            else if (error instanceof ApiException_1.default && typeof error === 'string') {
                var _error_2 = new Error(error);
                //@ts-ignore
                _error_2.statusCode = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(_error_2);
            }
            else if (error instanceof ApiException_1.default && typeof error === 'object') {
                return next(error);
            }
            return this.render(res, 'undefined_routes', {
                nav_title: '',
                path: '/undefined_routes/',
                is_authenticated: (_d = (_c = res === null || res === void 0 ? void 0 : res.req) === null || _c === void 0 ? void 0 : _c.session) === null || _d === void 0 ? void 0 : _d.is_authenticated,
                error: null,
                warning: null,
                success: null,
                status_code: 500,
                status_title: "Unexpected error",
                status_description: Singleton_1.Singleton.getLodash().capitalize(error_message) || "Please contact the support team!",
                url: '/',
                label: 'Home'
            }, null, this.codes.HTTPS_STATUS.SERVER_ERRORS.SERVICE_UNAVAILABLE);
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
