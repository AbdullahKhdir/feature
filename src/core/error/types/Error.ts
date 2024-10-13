"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class Error
 * @constructor
 * @extends ApiError
 * @description The Error class is a copy of the native error class with added property like statusCode
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class Error extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
	) {
		super("Error", message, statusCode);
		Object.setPrototypeOf(this, Error.prototype);
	}
};
