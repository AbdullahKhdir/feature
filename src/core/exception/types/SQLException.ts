"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class SQLException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs while executing faulty queries on a database related to the SQL syntax
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class SQLException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("SQLException", message, statusCode);
		Object.setPrototypeOf(this, SQLException.prototype);
	}
};
