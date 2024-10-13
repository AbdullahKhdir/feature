"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class EvalError
 * @constructor
 * @extends ApiError
 * @description This is used to identify errors when using the global eval() function.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class EvalError extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("EvalError", message, statusCode);
		Object.setPrototypeOf(this, EvalError.prototype);
	}
};
