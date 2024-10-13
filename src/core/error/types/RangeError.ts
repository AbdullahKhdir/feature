"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class RangeError
 * @constructor
 * @extends ApiError
 * @description This is thrown when a number is outside an allowable range of values.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class RangeError extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("RangeError", message, statusCode);
		Object.setPrototypeOf(this, RangeError.prototype);
	}
};
