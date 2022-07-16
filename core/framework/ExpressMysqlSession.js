'use strict';

const ExpressSession = require('./ExpressSession');

/**
 * @class ExpressMysqlSession
 * @constructor
 * @extends ExpressSession
 * @description Class ExpressMysqlSession to define and initiate the express mysql session 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ExpressMysqlSession extends ExpressSession {
    
    constructor() {
        super();
        this.mysql_session = require('express-mysql-session')(this.express_session);
    }
}