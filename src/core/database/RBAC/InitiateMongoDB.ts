"use strict";

import { Singleton } from "../../Singleton/Singleton";
import MongoDb from "../MongoDb";

/**
 * @class InitiateMongoDB
 * @constructor
 * @description To start initiating the RBAC for mongoDB
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
class InitiateMongoDB {
	constructor() {}

	static execute() {
		MongoDb.intitateMongoDbForApplication();
	}
}

InitiateMongoDB.execute();
