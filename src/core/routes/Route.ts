'use strict';

import { Router } from 'express';
import Lodash from '../../app/utils/Lodash';
import { Express } from '../framework/Express';
import { ExpressResponse } from '../response/ExpressResponse';
import { Singleton } from '../Singleton/Singleton';
import asyncHandler from '../utils/Promise';

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
    route(method: string, url: string, middleware: any, callback: any) : Router {
        if (typeof method === 'undefined' || method === '' || method == null) {
            method = 'Get';
        }

        if (typeof url === 'undefined' || url === '' || url == null) {
            return this._().get('/404', asyncHandler(callback));
        }

        if (typeof callback === 'undefined' || this.__.isString(callback) || callback == null) {
            return this._().get('/404', asyncHandler(callback));
        }

        if (typeof middleware !== 'object' && middleware.length <= 0 && typeof callback === 'function') {
            return this._().get('/404', asyncHandler(callback));
        }

        const _middleware = [];
        for (const key in middleware) {
            if (Object.hasOwnProperty.call(middleware, key)) {
                _middleware.push(middleware[key]);
            }
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
        return this._().get('/404');
    }
}