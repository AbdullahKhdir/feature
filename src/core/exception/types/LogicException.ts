"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class LogicException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you implement logic that does not fullfil
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class LogicException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("LogicException", message, statusCode);
		Object.setPrototypeOf(this, LogicException.prototype);
	}
};
