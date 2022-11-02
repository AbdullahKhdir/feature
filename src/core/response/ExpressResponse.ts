'use strict';

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ReadStream } from 'node:fs';
import * as config from '../config';
import ApiError from '../error/ApiError';
import ApiException from '../exception/ApiException';
import { Singleton } from '../Singleton/Singleton';
import { csrf, siteNotFound, error as _error } from '../utils/undefined-routes-logic';

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
        // res.redirect(status, res.req.route.path);
        res.redirect(status, res.req.url);
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
     * @description undefined_routes html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    siteNotFound(res: Response) : Response{
        return this.render(res, 'undefined_routes', siteNotFound(res), null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND);
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
            if (typeof errors === 'object' && typeof errors[Symbol.iterator] === 'function') {
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
            } else if (typeof errors === 'string') {
                const error = errors;
                res.req.flash('validation_errors', JSON.stringify({error: error}));
                res.req.flash('errored_inputs', JSON.stringify({error: error}));
            }
        }
        if (res.req.method === this.codes.REQUEST.TYPE.GET) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT
        } else if (res.req.method === this.codes.REQUEST.TYPE.POST) {
            status = this.codes.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY;
        }
        
        res.redirect(status, res.req.url);
        return res.end();
    }

    /**
     * @function onErrorValidation
     * @description renders all the validation errors back to the user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Object errors
     * @returns Response
    */
    sendPdf(res: Response, pdf: PDFKit.PDFDocument | ReadStream, pdf_name = 'pdf', to_download = false) {
        let date    = new Date();
        let year    = date.getFullYear();
        let month   = (date.getMonth() + 1);
        let day     = date.getDate();
        let hours   = date.getHours();
        let minutes = date.getMinutes();
        res.setHeader('Content-Type', this.codes.RESPONSE.TYPES.PDF);
        res.setHeader('Content-Disposition', `${to_download ? 'attachment' : 'inline'}; filename="${year}_${month}_${day}_${hours}_${minutes}_${pdf_name}"`);
        if (pdf instanceof ReadStream) {
            return pdf.pipe(res);
        } else {
            pdf.pipe(res);
            return pdf.end();
        }
    }

    /**
     * @function invalidCsrfResponse
     * @description undefined_routes html page for invalid csrf response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    invalidCsrfResponse(req: Request, res: Response) : Response{
        return this.render(res, 'undefined_routes', csrf(res), null, this.codes.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN);
    }

    /**
     * @function onError
     * @description undefined_routes html page on throwing an error
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    onError(res: Response, next: NextFunction, error: Error | string | {message: string; statusCode: number}) : Response | void {
        if (config.configurations().environment === 'development') {
            if (typeof error === 'string') {
                let _error = new Error(error);
                //@ts-ignore
                _error.statusCode = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(_error);
            } else if (error instanceof Error) {
                // @ts-ignore
                error.statusCode = error.statusCode ? error.statusCode : Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(error);
            } else if (typeof error === 'object' && typeof error !== 'string' 
                && typeof error !== 'function' && typeof error !== 'boolean' 
                && typeof error !== 'number') {
                return next(error);
            }
            
            return this.render(res, 'undefined_routes', {
                nav_title: '', 
                path: '/undefined_routes/',
                is_authenticated: res?.req?.session?.is_authenticated,
                error:   null,
                warning: null,
                success: null,
                status_code: 500,
                status_title: "Unexpected error",
                status_description: Singleton.getLodash().capitalize(error_message!) || `Please contact the support team!`,
                url: '/',
                label: 'Home'
            }, null, this.codes.HTTPS_STATUS.SERVER_ERRORS.SERVICE_UNAVAILABLE);                
        } else if (config.configurations().environment === 'production') {
            var error_message = '';
            if (error instanceof Error && error !instanceof ApiException) {
                // @ts-ignore
                error.statusCode = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(error);
            } else if (error !instanceof ApiException && typeof error === 'string') {
                let _error = new Error(error);
                //@ts-ignore
                _error.statusCode = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(_error);
            } else if (error !instanceof ApiException && typeof error === 'object') {
                return next(error);
            }
            
            return this.render(res, 'undefined_routes', {
                nav_title: '', 
                path: '/undefined_routes/',
                is_authenticated: res?.req?.session?.is_authenticated,
                error:   null,
                warning: null,
                success: null,
                status_code: 500,
                status_title: "Unexpected error",
                status_description: Singleton.getLodash().capitalize(error_message!) || `Please contact the support team!`,
                url: '/',
                label: 'Home'
            }, null, this.codes.HTTPS_STATUS.SERVER_ERRORS.SERVICE_UNAVAILABLE);
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