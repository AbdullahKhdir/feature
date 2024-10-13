"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class NumberFormatException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs
 * when you pass a string to a method that cannot be converted to a number
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class NumberFormatException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
	) {
		super("NumberFormatException", message, statusCode);
		Object.setPrototypeOf(this, NumberFormatException.prototype);
	}
};
