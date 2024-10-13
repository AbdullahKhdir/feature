"use strict";

import { SequelizeStoreConstructor } from "../custom_types";
import ExpressSession from "./ExpressSession";

/**
 * @class ExpressSequelizeSession
 * @constructor
 * @description Class ExpressSequelizeSession to define and initiate the express mysql session
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */

export = class ExpressSequelizeSession extends ExpressSession {
	protected mysqlSession: SequelizeStoreConstructor;
	constructor() {
		super();

		if (!ExpressSession.expressSession) {
			throw new Error("Express session is not initialized!");
		}

		this.mysqlSession = require("connect-session-sequelize")(ExpressSession.expressSession.Store);
	}
};
