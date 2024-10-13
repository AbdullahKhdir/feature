"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class IllegalArgumentException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs
 * whenever an inappropriate or incorrect argument is passed to a method
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class IllegalArgumentException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
	) {
		super("IllegalArgumentException", message, statusCode);
		Object.setPrototypeOf(this, IllegalArgumentException.prototype);
	}
};
