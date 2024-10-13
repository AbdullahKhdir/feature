"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class RuntimeException
 * @constructor
 * @extends ApiException
 * @description RuntimeException is the superclass of those exceptions that can be thrown during the normal operation
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class RuntimeException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("RuntimeException", message, statusCode);
		Object.setPrototypeOf(this, RuntimeException.prototype);
	}
};
