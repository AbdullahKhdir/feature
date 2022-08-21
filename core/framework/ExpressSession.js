'use strict';

const Response = require('../response/Response');

/**
 * @class ExpressSession
 * @constructor
 * @extends Response
 * @description Class ExpressSession to define and initiate the express session 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ExpressSession extends Response {
    
    constructor(express_session = require('express-session')) {
        super();
        this.express_session = express_session;
    }
}