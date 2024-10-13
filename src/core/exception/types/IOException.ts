"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class IOException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs while using file I/O stream operations
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class IOException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("IOException", message, statusCode);
		Object.setPrototypeOf(this, IOException.prototype);
	}
};
