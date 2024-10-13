"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class InternalError
 * @extends ApiException
 * @description This error occurs internally in the JS engine,
 * especially when it has too much data to handle and the stack grows way over its critical limit.
 * This occurs when the JS engine is overwhelmed by too many recursions, too many switch cases, etc
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class InternalError extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("InternalError", message, statusCode);
		Object.setPrototypeOf(this, InternalError.prototype);
	}
};
