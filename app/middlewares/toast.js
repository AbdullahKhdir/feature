module.exports = (req, res, next) => {
    const _flash_array = req.flash();
    let error   = null;
    let warning = null;
    let success = null;
    if (typeof _flash_array['error'] !== 'undefined') {
        error   = _flash_array['error'];
    }
    if (typeof _flash_array['warning'] !== 'undefined') {
        warning = _flash_array['warning'];        
    }
    if (typeof _flash_array['success'] !== 'undefined') {
        success = _flash_array['success'];
    }
    res.locals.error   = error;
    res.locals.warning = warning;
    res.locals.success = success;
    next();
}