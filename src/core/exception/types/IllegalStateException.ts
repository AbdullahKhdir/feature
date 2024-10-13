"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class IllegalStateException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when the state of the environment
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class IllegalStateException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.CONFLICT
	) {
		super("IllegalStateException", message, statusCode);
		Object.setPrototypeOf(this, IllegalStateException.prototype);
	}
};
