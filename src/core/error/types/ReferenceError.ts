"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class ReferenceError
 * @constructor
 * @extends ApiError
 * @description This exception is thrown when a reference made to a variable/item is broken.
 * That is the variable/item doesn’t exist.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class ReferenceError extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("ReferenceError", message, statusCode);
		Object.setPrototypeOf(this, ReferenceError.prototype);
	}
};
