'use strict';

const Lodash = require('../../app/utils/Lodash');
const Express = require('../framework/Express');
const _Promise = require('../utils/Promise');

/**
 * @class Routes
 * @constructor
 * @extends Express
 * @description Class Routes is used to define the routes Object and set the configurations
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Routes extends Express {
    
    constructor() {
        super();

        if (typeof this.router !== 'undefined') {
            return this._();
        }
        this.framework = new Express().framework
        
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
        this.framework.Router(options);
        this.router     = this.framework.Router(options);
        this.express    = this.framework;
        this.__         = new Lodash().__;

        /*
            ? DEMO OF THE CORS CONFIGURATIONS 
        */
        this.corsOptions = {
            origin:               'http://localhost:8010.com',
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
     * @function getExpressInstance
     * @description  gets an instance of the Express class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {Express}
     */
    getExpressInstance() {
        return this.express;
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
    route(method, url, middleware, callback) {
        if (typeof method === 'undefined' || method === '' || method == null) {
            method = 'Get';
        }

        if (typeof url === 'undefined' || url === '' || url == null) {
            return false;
        }
        
        if (typeof callback === 'undefined' || this.__.isString(callback) || callback == null) {
            return false;
        }

        if (typeof middleware !== 'object' && middleware.length <= 0) {
            return false;
        }

        const _middleware = [];
        for (const key in middleware) {
            if (Object.hasOwnProperty.call(middleware, key)) {
                _middleware.push(middleware[key]);
            }
        }
        
        if (this.__.capitalize(method) === 'Get' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().get(url, _middleware, _Promise.asyncHandler(callback));
        }

        if (this.__.capitalize(method) === 'Post' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().post(url, _middleware, _Promise.asyncHandler(callback));
        }

        if (this.__.capitalize(method) === 'Put' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().put(url, _middleware, _Promise.asyncHandler(callback));
        }
        
        if (this.__.capitalize(method) === 'Patch' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().patch(url, _middleware, _Promise.asyncHandler(callback));
        }
        
        if (this.__.capitalize(method) === 'Delete' && !this.__.isEmpty(url) && typeof callback === 'function') {
            return this._().delete(url, _middleware, _Promise.asyncHandler(callback));
        }
    }
}