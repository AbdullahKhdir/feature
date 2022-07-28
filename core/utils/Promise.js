'use strict';

const { Request, Response, NextFunction } = require('express');
const { environment } = require('../config');
 
/**
 * @class AsyncHandler
 * @constructor
 * @description Better Promise Management
    The callback is replaced by Promises and now the Promise chain is replaced by the async/await.
    This greatly enhances the coding experience.
    One problem with this implementation is to write the ugly try/catch block.
    In order to give it sugar, I have created a middleware function asyncHandler.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Promise {
    
    constructor() {
    }

    static asyncFunction = (request = Request, response = Response, next = NextFunction) => new Promise();
    static asyncHandler  = (execution = AsyncHandler.asyncFunction) => (req = Request, res = Response, next = NextFunction) => {
        /**
         * @function setCookie
         * @description sets a simple cookie
         * @param {String} object 
         * @param {Object} object
         * @param {Number} expires milliseconds * seconds * minutes * hours * days * weeks * months (one day is the auto value)
         * @param {String} domain
         * @param {String} path
         * @param {Bool}   secure
         * @param {Bool}   http_only
         * @param {String} same_site
         * @returns void
         * @example
         * Set-Cookie: <cookie-name>=<cookie-value>
           Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
           Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
           Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
           Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
           Set-Cookie: <cookie-name>=<cookie-value>; Secure
           Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
           Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
           Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
           Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure
         */
        if(typeof res !== 'undefined') {
            res.setCookie = (
                object,
                expires   = new Date((1000 * 60 * 60 * 24 * 1 * 1 * 1) + Date.now()).toUTCString(),
                domain    = null,
                path      = null,
                secure    = environment === 'production' ? true : null,
                http_only = true,
                same_site = environment === 'production' ? 'Strict' : null,
            ) => {
                let _cookie = '';
                if (!expires) {
                    expires = new Date((1000 * 60 * 60 * 24 * 1 * 1 * 1) + Date.now()).toUTCString();
                }
                if (typeof object === 'string') {
                    _cookie = object + '; ' + 'Expires=' + expires + '; ';
    
                    domain       ? _cookie = _cookie + 'Domain='+domain+'; '      : _cookie;
                    path         ? _cookie = _cookie + 'Path='+path+'; '          : _cookie;
                    secure       ? _cookie = _cookie + 'secure; '                 : _cookie;
                    http_only    ? _cookie = _cookie + 'http_only; '              : _cookie;
                    same_site    ? _cookie = _cookie + 'SameSite='+same_site+'; ' : _cookie;
    
                    res.setHeader('Set-Cookie', _cookie);
                } else if (typeof object === 'object') {
                    for (const key in object) {
                        if (Object.hasOwnProperty.call(object, key)) {
                            _cookie = key + '=' + object[key]+ '; ' + 'Expires=' + expires + '; '; 
                        }
                    }
    
                    domain       ? _cookie = _cookie + 'Domain='+domain+'; '      : _cookie;
                    path         ? _cookie = _cookie + 'Path='+path+'; '          : _cookie;
                    secure       ? _cookie = _cookie + 'Secure; '                 : _cookie;
                    http_only    ? _cookie = _cookie + 'HttpOnly; '              : _cookie;
                    same_site    ? _cookie = _cookie + 'SameSite='+same_site+'; ' : _cookie;
    
                    res.setHeader('Set-Cookie', _cookie);
                }
            };
        }
        execution(req, res, next).catch(next);
    };
}