'use strict';

const Express = require('./Express');

/**
 * @class Next
 * @constructor
 * @extends Express
 * @description Class Next to define and initiate the next function
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Next extends Express {
    constructor({ NextFunction } = super()) {
        super();
        this.next = NextFunction;
        // console.log(request)
    }
}