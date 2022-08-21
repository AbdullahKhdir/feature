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
    static asyncHandler  = (execution = Promise.asyncFunction) => (req = Request, res = Response, next = NextFunction) => {
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
                let options = {};
                options.expires = expires;
                if (!expires) {
                    expires  = expires;
                    options.expires = new Date((1000 * 60 * 60 * 24 * 1 * 1 * 1) + Date.now());
                }
                if (typeof object === 'string') {
                    const _key   = object.substr(0, object.indexOf('='));
                    const _value = object.substr(_key.length + 1);
                    _cookie = object + '; ' + 'Expires=' + expires + '; ';
                    
                    domain      ? _cookie = _cookie + 'Domain='+domain+'; '      : _cookie;
                    domain      ? options.domain = domain                        : options.domain  = '';

                    path        ? _cookie = _cookie + 'Path='+path+'; '          : _cookie;
                    path        ? options.path = path                            : options.path    = '';
                    
                    secure      ? _cookie = _cookie + 'secure; '                 : _cookie;
                    secure      ? options.secure = true                          : options.secure  = null;
                    
                    http_only   ? _cookie = _cookie + 'http_only; '              : _cookie;
                    http_only   ? options.HttpOnly = true                       : options.HttpOnly = false;
                    
                    same_site   ? _cookie = _cookie + 'SameSite='+same_site+'; ' : _cookie;
                    same_site   ? options.SameSite = same_site                  : options.SameSite = 'null';
                    
                    res.setHeader('Set-Cookie', _cookie);
                    res.cookie(_key, _value, options);
                } else if (typeof object === 'object') {
                    var _key   = '';
                    var _value = '';
                    for (const key in object) {
                        if (Object.hasOwnProperty.call(object, key)) {
                            _key   = key;
                            _value = object[key];
                            _cookie = key + '=' + object[key]+ '; ' + 'Expires=' + expires + '; '; 
                        }
                    }
                    console.log(_cookie);
                    domain      ? _cookie = _cookie + 'Domain='+domain+'; '      : _cookie;
                    domain      ? options.domain = domain                        : options.domain  = '';

                    path        ? _cookie = _cookie + 'Path='+path+'; '          : _cookie;
                    path        ? options.path = path                            : options.path    = '';
                    
                    secure      ? _cookie = _cookie + 'secure; '                 : _cookie;
                    secure      ? options.secure = true                          : options.secure  = null;
                    
                    http_only   ? _cookie = _cookie + 'http_only; '              : _cookie;
                    http_only   ? options.HttpOnly = true                        : options.HttpOnly = false;
                    
                    same_site   ? _cookie = _cookie + 'SameSite='+same_site+'; ' : _cookie;
                    same_site   ? options.SameSite = same_site                   : options.SameSite = 'null';
    
                    res.setHeader('Set-Cookie', _cookie);
                    res.cookie(_key, _value, options);
                }
            },
            res.onLogOut = (name, options = []) => {
                res.clearCookie(name, options);
            }
        }
        execution(req, res, next).catch(next);
    };
}