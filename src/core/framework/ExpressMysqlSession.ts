'use strict';


import ExpressSession from './ExpressSession';

/**
 * @class ExpressMysqlSession
 * @constructor
 * @description Class ExpressMysqlSession to define and initiate the express mysql session 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ExpressMysqlSession extends ExpressSession {
    
    public mysql_session;
    constructor() {
        super();
        this.mysql_session = require('express-mysql-session')(ExpressSession.getExpressSession)
    }
}