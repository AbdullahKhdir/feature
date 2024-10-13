"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class BadMethodCallException
 * @constructor
 * @extends ApiException
 * @description This is thrown when a function or operation failed
 * due to missing parameter or config
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class BadMethodCallException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
	) {
		super("BadMethodCallException", message, statusCode);
		Object.setPrototypeOf(this, BadMethodCallException.prototype);
	}
};
