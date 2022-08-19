const Lodash = require("../utils/Lodash");

module.exports = (req, res, next) => {
    const __ = new Lodash().__;
    const _flash_array = req.flash();
    let error     = null;
    let warning   = null;
    let success   = null;
    let post_data = null;
    let get_data  = null;
    if (typeof _flash_array['error'] !== 'undefined') {
        error     = _flash_array['error'];
    }
    if (typeof _flash_array['warning'] !== 'undefined') {
        warning   = _flash_array['warning'];        
    }
    if (typeof _flash_array['success'] !== 'undefined') {
        success   = _flash_array['success'];
    }
    if (typeof _flash_array['post_data'] !== 'undefined') {
        post_data = _flash_array['post_data'];
    }
    if (typeof _flash_array['get_data'] !== 'undefined') {
        get_data  = _flash_array['get_data'];
    }
    res.locals.error     = error;
    res.locals.warning   = warning;
    res.locals.success   = success;
    res.locals.post_data = post_data;
    res.locals.get_data  = get_data;
    req.props            = () => _flash_array;
    req.setProp          = (key, value) => { 
        if (__.isEmpty(key) || __.isEmpty(value)) {
            return false;
        }
        req.flash(key, value);
        return true;
    }
}