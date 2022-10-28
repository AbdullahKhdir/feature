import { NextFunction, Request, Response } from 'express';
import { Singleton } from '../../core/Singleton/Singleton';

export function toast(req: Request, res: Response, next: NextFunction, app: any) {
    const __ = Singleton.getLodash();
    const _flash_array : any = req.flash();
    let validation_errors = null;
    let errored_inputs = null;
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
        post_data = _flash_array['post_data'][0];
    }
    if (typeof _flash_array['get_data'] !== 'undefined') {
        get_data  = _flash_array['get_data'];
    }
    if (typeof _flash_array['validation_errors'] !== 'undefined') {
        validation_errors  = JSON.parse(_flash_array['validation_errors']);
    }
    if (typeof _flash_array['errored_inputs'] !== 'undefined') {
        errored_inputs  = JSON.parse(_flash_array['errored_inputs']);
    }
    res.locals['error']               = error;
    res.locals['warning']             = warning;
    res.locals['success']             = success;
    res.locals['validation_errors']   = validation_errors;
    res.locals['errored_inputs']      = errored_inputs;
    res.locals['post_data']           = post_data ?? {};
    res.locals['get_data']            = get_data;
    res.locals['csrf']                = typeof req.csrfToken === 'function' ? req.csrfToken() : '';
    
    app.locals.error               = error;
    app.locals.warning             = warning;
    app.locals.success             = success;
    app.locals.post_data           = post_data;
    app.locals.get_data            = get_data;
    
    req.props            = () => _flash_array;
    req.setProp          = (key: any, value: any) => { 
        if (__.isEmpty(key) || __.isEmpty(value)) {
            return false;
        }
        req.flash(key, value);
        return true;
    }
}