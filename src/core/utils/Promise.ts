'use strict';

import { NextFunction, Request, Response } from 'express';

/**
 * @description Better Promise Management
    The callback is replaced by Promises and now the Promise chain is replaced by the async/await.
    This greatly enhances the coding experience.
    One problem with this implementation is to write the ugly try/catch block.
    In order to give it sugar, I have created a middleware function asyncHandler.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export default function(execution: AsyncFunction) {
    return function(req: Request, res: Response, next: NextFunction) : void {
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
            /**
            * @method setCookie
            * @description Sets a new cookie
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @param {Object} object
            * @param {Date} expires
            * @param {String} domain
            * @param {String} path
            * @param {Boolean} secure
            * @param {Boolean} http_only
            * @param {String} same_site
            * @return void
            */
            res.setCookie = (
                object : any,
                expires   = new Date((1000 * 60 * 60 * 24 * 1 * 1 * 1) + Date.now()).toUTCString(),
                domain    = null,
                path      = '/',
                secure    = true,
                http_only = true,
                same_site = 'Strict',
            ) => {
                let _cookie = '';
                let options : any = {};
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
            /**
            * @method onLogOut
            * @description Deletes the registered cookie on logging out
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @param {String} name
            * @param {Array} options
            * @return void
            */
            res.onLogOut = (name: any, options: any = []) => {
                res.clearCookie(name, options);
            },
            /**
            * @method storeInPrivateCache
            * @description Checks wether the cookie should be saved publicly or privatly
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @return void
            */
            res.storeInPrivateCache = () => {
                if (typeof req.session !== 'undefined') {
                    if (typeof req.session.is_authenticated !== 'undefined') {
                        if (req.session.is_authenticated === true) {
                            return true;
                        }
                    }
                }
                return false;
            },
            /**
            * @method longTimeNoCache
            * @description Caches any type of files that dont change very often
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @return void
            */
            res.longTimeNoCache = () => {
                /*
                * You can add a long max-age value and immutable because the content will never change.
                * <script src=/public/js/main.js></script>
                * <img src=/public/img/hero.png?hash=deadbeef width=900 height=400>
                */
                /*
                * For Pictures, files or libs that will never change, not in the near future   
                */
                const store_cache_privatly = res.storeInPrivateCache();
                if (store_cache_privatly === true) {
                    res.set('Cache-Control', 'private, max-age=31536000, immutable'); // 1 year
                } else {
                    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
                }
                return;
            },
            /**
            * @method updatedContentAlways
            * @description Update the cache of files that change very often
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @return void
            */
            res.updatedContentAlways = () => {
                /*
                * For content that's generated dynamically, 
                * or that's static but updated often, 
                * you want a user to always receive the most up-to-date version. 
                * e.g. for landing page
                */
                const store_cache_privatly = res.storeInPrivateCache();
                if (store_cache_privatly === true) {
                    res.set('Cache-Control', 'private, no-cache');
                } else {
                    res.set('Cache-Control', 'public, no-cache');
                }
                return;
            },
            /**
            * @method noCacheNeeded
            * @description Does not cache any response
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @return void
            */
            res.noCacheNeeded = () => {
                /*
                * Preventing storing
                * If you don't want a response stored in caches, use the no-store directive.
                */
                res.set('Cache-Control', 'no-store');
                return;
            },
            /**
            * @method cacheLastResOnErr
            * @description Caches a response and on server side errors return the response for one day only
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @return void
            */
            res.cacheLastResOnErr = () => {
                /*
                * The stale-if-error response directive indicates 
                * that the cache can reuse a stale response when an origin server responds with an error 
                * (500, 502, 503, or 504).
                * In the example above, the response is fresh for 7 days (604800s). 
                * After 7 days it becomes stale, but it can be used for an extra 1 day (86400s) 
                * if the server responds with an error.
                * After a period of time, 
                * the stored response became stale normally. 
                * This means that the client will receive an error response as-is if the origin server sends it.
                */
                const store_cache_privatly = res.storeInPrivateCache();
                if (store_cache_privatly === true) {
                    res.set('Cache-Control', 'private, max-age=604800, stale-if-error=86400');
                } else {
                    res.set('Cache-Control', 'public, max-age=604800, stale-if-error=86400');
                }
                return;
            },
            /**
             @description Caches a response for 180 seconds for a page that changes frequently
            * @version 1.0.0
            * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
            * @return void
            */
            res.cacheLandingPage = () => {
                /*
                * 3 minutes cache for landing page 
                */
                const store_cache_privatly = res.storeInPrivateCache();
                if (store_cache_privatly === true) {
                    res.set('Cache-control', 'private, max-age=60')
                } else {
                    res.set('Cache-control', 'public, max-age=60')
                }
                return;
            }
        }
        execution(req, res, next).catch(next);
    };
} 