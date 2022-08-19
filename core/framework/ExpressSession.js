'use strict';

const Express = require('./Express');

/**
 * @class ExpressSession
 * @constructor
 * @extends ExpressSession
 * @description Class ExpressSession to define and initiate the express session 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ExpressSession extends Express {
    
    constructor(express_session = require('express-session')) {
        super();
        this.express_session = express_session;
    }
}