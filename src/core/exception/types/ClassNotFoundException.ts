"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class ClassNotFoundException
 * @constructor
 * @extends ApiException
 * @description This type of exception is thrown when the required class is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class ClassNotFoundException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("ClassNotFoundException", message, statusCode);
		Object.setPrototypeOf(this, ClassNotFoundException.prototype);
	}
};
