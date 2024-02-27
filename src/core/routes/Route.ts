'use strict';

import { ENDPOINTS } from '../api/apis_endpoints/endpoints';
import RuntimeException from '../exception/types/RuntimeException';
import { ExpressResponse } from '../response/ExpressResponse';
import { Singleton } from '../Singleton/Singleton';
import asyncHandler from '../utils/Promise';
import {Request} from 'express';

/**
 * @class Routes
 * @constructor
 * @description Class Routes is used to define the routes Object and set the configurations
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Routes extends ExpressResponse{
    
    protected router;
    protected override express;
    protected corsOptions;
    protected __;
    constructor() {
        super();
        /*
        * This line of code is responsible for the 
        * difference between "/route" and "/route/" 
        */
        const options = {
            caseSensitive: false, // Do not treat “/Foo” and “/foo” as the same.
            mergeParams: true,    // Preserve the req.params values from the parent router.
                                  // If the parent and the child have conflicting param names, the child’s value take precedence.
            strict: false,        // Enable strict routing.
        }
        this.express    = Singleton.getExpress();
        this.__         = Singleton.getLodash();
        this.express.getExpress.Router(options);
        this.router     = this.express.getExpress.Router(options);
        
        /*
            ? DEMO OF THE CORS CONFIGURATIONS 
        */
        this.corsOptions = {
            origin:               'https://localhost:8010.com',
            methods:              ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            preflightContinue:    false,
            maxAge:               86400,
            allowedHeaders:       ['Content-Type', 'Authorization'],
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }
    }

    /**
     * @function _
     * @description  gets an instance of the Routes class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {Routes}
     */
    _() {
        return this.router;
    }

    /**
     * @function Route
     * @description  Initiate new route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} method
     * @param {String} url
     * @param {Object} middleware
     * @param {Function} callback
     * @return ExpressRoute
    */
    route(method: string, url: string, middleware: any, callback: any, is_api_endpoint: boolean = false) : any {
        if (typeof method === 'undefined' || method === '' || method == null) {
            return new RuntimeException('Route does not have an http method!')
        }

        if (typeof url === 'undefined' || url === '' || url == null) {
            return new RuntimeException('Route does not have an http url!')
        }

        if (typeof callback === 'undefined' || this.__.isString(callback) || callback == null) {
            return new RuntimeException('Route does not have a callback!')
        }

        if (typeof middleware !== 'object' && middleware.length <= 0 && typeof callback === 'function') {
            return new RuntimeException('Middlewares could not be implemented!')
        }

        var _middleware: Array<any> = [];
        for (const key in middleware) {
            if (Object.hasOwnProperty.call(middleware, key)) {
                _middleware.push(middleware[key]);
            }
        }

        if (is_api_endpoint) {
            ENDPOINTS.push(url)
        }

        if (this.__.capitalize(method) === 'Get' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().get(url, _middleware, asyncHandler(callback));
        }

        if (this.__.capitalize(method) === 'Post' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().post(url, _middleware, asyncHandler(callback));
        }

        if (this.__.capitalize(method) === 'Put' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().put(url, _middleware, asyncHandler(callback));
        }
        
        if (this.__.capitalize(method) === 'Patch' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().patch(url, _middleware, asyncHandler(callback));
        }
        
        if (this.__.capitalize(method) === 'Delete' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().delete(url, _middleware, asyncHandler(callback));
        }

        return new RuntimeException('Route could not be deployed!');
    }

    /**
     * @function isApiEndpoint
     * @description  check if the url matches a string of api endpoints array
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Request} req
     * @return boolean
    */
    isApiEndpoint(req: Request) : boolean {
        if (ENDPOINTS.length > 0) {
            ENDPOINTS.forEach((endpoint: any) => {
                if (ENDPOINTS.includes(req.headers.referer || '')
                || ENDPOINTS.includes(req.originalUrl || '')
                || ENDPOINTS.includes(req.url || '')) {
                    return true;
                }
            });
        }
        return false;
    }
}