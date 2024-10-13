"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class NullPointerException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you try to access an object
 * with the help of a reference variable whose current value is null or empty
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class NullPointerException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("NullPointerException", message, statusCode);
		Object.setPrototypeOf(this, NullPointerException.prototype);
	}
};
