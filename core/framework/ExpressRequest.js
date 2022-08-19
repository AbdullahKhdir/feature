'use strict';

const Express = require('./Express');

/**
 * @class ExpressRequest
 * @constructor
 * @extends Express
 * @description Class ExpressRequest to define and initiate the request object
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ExpressRequest extends Express {
    constructor({ Request } = super()) {
        super();
        this.request = Request;
    }
}