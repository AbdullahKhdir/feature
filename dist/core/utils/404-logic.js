"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.exception = exports.siteNotFound = exports.csrf = void 0;
var capitalize = function (s) { return s && s[0].toUpperCase() + s.slice(1); };
function csrf(req, object) {
    if (object === void 0) { object = {}; }
    var _object = {
        nav_title: capitalize(req.method) + ' request was interrupted!',
        path: '/404/',
        is_authenticated: null,
        error: 'Invalid CSRF token',
        warning: 'Please do not alter or delete the csrf token!',
        success: null,
        status_code: 403,
        status_title: 'Invalid CSRF token',
        status_description: 'Please do not alter or delete the csrf token!',
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}
exports.csrf = csrf;
function siteNotFound(req, object) {
    if (object === void 0) { object = {}; }
    var _object = {
        nav_title: '',
        path: '/404/',
        is_authenticated: null,
        error: null,
        warning: null,
        success: null,
        status_code: 404,
        status_title: "UH OH! You're lost.",
        status_description: "The page you are looking for does not exist.\n        How you got here is a mystery. But you can click the button below\n        to go back to the homepage.",
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}
exports.siteNotFound = siteNotFound;
function exception(req, object) {
    if (object === void 0) { object = {}; }
    var _object = {
        nav_title: '',
        path: '/404/',
        is_authenticated: false,
        error: null,
        warning: null,
        success: null,
        status_code: 500,
        status_title: "UH OH! Exception is thrown.",
        status_description: "This message will only be seen from the developers.",
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}
exports.exception = exception;
function error(req, object) {
    if (object === void 0) { object = {}; }
    var _object = {
        nav_title: '',
        path: '/404/',
        is_authenticated: false,
        error: null,
        warning: null,
        success: null,
        status_code: 500,
        status_title: "UH OH! Unexpected error has ocurred.",
        status_description: "Please contact the support team.",
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}
exports.error = error;
