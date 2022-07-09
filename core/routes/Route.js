'use strict';

const Express = require('../framework/Express');

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
            return this.getRouterInstance();
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
    }

    /**
     * @function getRouterInstance
     * @description  gets an instance of the Routes class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return {Routes}
     */
    getRouterInstance() {
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
}