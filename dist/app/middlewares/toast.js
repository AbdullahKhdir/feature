"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = void 0;
var Singleton_1 = require("../../core/Singleton/Singleton");
function toast(req, res, next, app) {
    var __ = Singleton_1.Singleton.getLodash();
    var _flash_array = req.flash();
    var validation_errors = null;
    var errored_inputs = null;
    var error = null;
    var warning = null;
    var success = null;
    var post_data = null;
    var get_data = null;
    if (typeof _flash_array['error'] !== 'undefined') {
        error = _flash_array['error'];
    }
    if (typeof _flash_array['warning'] !== 'undefined') {
        warning = _flash_array['warning'];
    }
    if (typeof _flash_array['success'] !== 'undefined') {
        success = _flash_array['success'];
    }
    if (typeof _flash_array['post_data'] !== 'undefined') {
        post_data = _flash_array['post_data'][0];
    }
    if (typeof _flash_array['get_data'] !== 'undefined') {
        get_data = _flash_array['get_data'];
    }
    if (typeof _flash_array['validation_errors'] !== 'undefined') {
        validation_errors = JSON.parse(_flash_array['validation_errors']);
    }
    if (typeof _flash_array['errored_inputs'] !== 'undefined') {
        errored_inputs = JSON.parse(_flash_array['errored_inputs']);
    }
    res.locals['error'] = error;
    res.locals['warning'] = warning;
    res.locals['success'] = success;
    res.locals['validation_errors'] = validation_errors;
    res.locals['errored_inputs'] = errored_inputs;
    res.locals['post_data'] = post_data !== null && post_data !== void 0 ? post_data : {};
    res.locals['get_data'] = get_data;
    res.locals['csrf'] = req.csrfToken();
    app.locals.error = error;
    app.locals.warning = warning;
    app.locals.success = success;
    app.locals.post_data = post_data;
    app.locals.get_data = get_data;
    req.props = function () { return _flash_array; };
    req.setProp = function (key, value) {
        if (__.isEmpty(key) || __.isEmpty(value)) {
            return false;
        }
        req.flash(key, value);
        return true;
    };
}
exports.toast = toast;
