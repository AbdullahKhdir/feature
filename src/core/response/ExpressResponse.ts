'use strict';

import { Response } from 'express';
import * as config from '../config';
import { Singleton } from '../Singleton/Singleton';

/**
 * @class Response
 * @constructor
 * @description Class Response is used to define the Response Objects 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
// export = class ExpressResponse implements Response {
export abstract class ExpressResponse {
    protected message: string;
    protected status_code: number;
    protected response_status: string;
    protected readonly codes: any;
    protected readonly express;
    constructor(status_code? : any, response_status? : any, message : string = '') {
        this.message         = message;
        this.status_code     = status_code;
        this.response_status = response_status;
        this.codes           = Singleton.getConstants();
        this.express         = Singleton.getExpress();
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
    renderAsJson(res: Response, data: any, status = this.codes.HTTPS_STATUS.SUCCESS.OK) : Response {
        res.type(this.codes.RESPONSE.TYPES.JSON);
        if (typeof this.status_code === 'undefined') {
            return res.status(status).json(ExpressResponse.sanitize(data));
        }
        return res.status(this.status_code).json(ExpressResponse.sanitize(data));
    }

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
    render(res: Response, template : any, options = {}, callback = null, status: any = this.codes.HTTPS_STATUS.SUCCESS.OK) : Response {
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof this.status_code === 'undefined') {// @ts-ignore 
            return res.status(status).render(template, options, callback);
        }// @ts-ignore 
        return res.status(this.status_code).render(template, options, callback);
    }

    /**
     * @function redirect
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String url
     * @param Number status
     * @returns Response
    */
    redirect(res: Response, url: any, status : any = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY) : Response {
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof this.status_code === 'undefined') {
            res.redirect(status, url);
            return res.end();
            
        }
        res.redirect(this.status_code, url);
        return res.end();
    }

    /**
     * @function toSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String url
     * @param Number status
     * @returns Response
    */
    toSameSite(res: Response, status: any = this.codes.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT) : Response{
        res.type(this.codes.RESPONSE.TYPES.HTML);
        res.redirect(status, res.req.route.path);
        return res.end();
    }

    /**
     * @function postToSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String url
     * @param Number status
     * @returns Response
    */
    postToSameSite(res: Response, status: any  = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY) : Response{
        res.type(this.codes.RESPONSE.TYPES.HTML);
        res.redirect(status, res.req.route.path);
        return res.end();
    }

    /**
     * @function siteNotFound
     * @description 404 html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    siteNotFound(res: Response) : Response{
        return this.render(
            res,
            '404',
            {page_title: 'Page not found', path: '/404/'},
            null,
            this.codes.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND
        );
    }

    /**
     * @function onErrorValidation
     * @description renders all the validation errors back to the user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Object errors
     * @returns Response
    */
    onErrorValidation(res: Response, errors: any) : Response {
        let status = null;
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof errors !== 'undefined') {
            if (errors.length >= 0) {
                let obj_warnings = {};
                let errored_params = {};
                errors.forEach((error: any, index: any) => {
                    Object.assign(obj_warnings, {[index]:`${error.msg}`});
                    Object.assign(errored_params, {[index]:`${error.param}`});
                });
                res.req.flash('validation_errors', JSON.stringify(obj_warnings));
                res.req.flash('errored_inputs', JSON.stringify(errored_params));
            }
        }
        if (res.req.method === this.codes.REQUEST.TYPE.GET) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT
        } else if (res.req.method === this.codes.REQUEST.TYPE.POST) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY;
        }
        res.redirect(status, res.req.route.path);
        return res.end();
    }

    /**
     * @function invalidCsrfResponse
     * @description 404 html page for invalid csrf response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    invalidCsrfResponse(res: Response) : Response{
        return this.render(
            res,
            '404',
            {
                page_title: 'Post request was interrupted!', 
                path: '/404/',
                is_authenticated: null,
                error:   'Invalid CSRF token',
                warning: 'Please do not alter or delete the csrf token!',
                success: null
            },
            null,
            this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN
        );
    }

    /**
     * @function onError
     * @description 404 html page on throwing an error
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
     // TODO: Create and design general error page 
    */
    onError(res: Response, error: any = '') : Response {
        if (config.configurations().environment === 'development') {
            return this.render(
                res,
                '404',
                {
                    page_title: 'Unexpected Error!', 
                    path: '/404/',
                    is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                    error:   error.toString(),
                    warning: error.toString(),
                    success: null
                },
                null,
                this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN
            );
        } else if (config.configurations().environment === 'production') {
            return this.render(
                res,
                '404',
                {
                    page_title: 'Unexpected Error!', 
                    path: '/404/',
                    is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                    warning: 'Please contact the support team!'
                },
                null,
                this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN
            );
        }
        return res.end();
    }

    /**
     * @function send
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param String body
     * @param Number status
     * @returns Response
    */
    send(res: Response, body: any, status = this.codes.HTTPS_STATUS.SUCCESS.OK) : Response {
        res.type(this.codes.RESPONSE.TYPES.HTML);
        if (typeof this.status_code === 'undefined') {
            res.status(status).send(body);
            return res.end();
        }
        res.status(this.status_code).send(body);
        return res.end();
    }
 
    /**
     * @function sanitize
     * @description Prepares and cleans the json data to be send in the response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns object
    */
    static sanitize(response: Response) {
        const clone: any = {};
        Object.assign(clone, response);
        for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
        return clone;
    }
}