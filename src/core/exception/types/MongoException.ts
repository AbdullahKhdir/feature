"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class MongoException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs while executing faulty queries on mongo databse
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class MongoException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("MongoException", message, statusCode);
		Object.setPrototypeOf(this, MongoException.prototype);
	}
};
