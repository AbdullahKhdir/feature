'use strict';

import express_session from 'express-session';

/**
 * @class ExpressSession
 * @constructor
 * @extends Response
 * @description Class ExpressSession to define and initiate the express session 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ExpressSession {
    
    public static express_session: typeof express_session;
    constructor() {
        ExpressSession.express_session = express_session;
    }

    static get getExpressSession() {
        if (this.express_session) {
            return this.express_session
        }
        return this.express_session = express_session;
    }
    
}