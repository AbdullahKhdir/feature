"use strict";

import express_session from "express-session";

/**
 * @class ExpressSession
 * @constructor
 * @extends Response
 * @description Class ExpressSession to define and initiate the express session
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class ExpressSession {
	public static expressSession: typeof express_session;
	constructor() {
		if (!ExpressSession.expressSession) {
			ExpressSession.expressSession = express_session;
		}
	}
};
