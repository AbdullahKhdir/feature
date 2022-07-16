'use strict';

/**
 * @class ExpressSession
 * @constructor
 * @extends ExpressSession
 * @description Class ExpressSession to define and initiate the express session 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ExpressSession {
    
    constructor(express_session = require('express-session')) {
        this.express_session = express_session;
    }
}