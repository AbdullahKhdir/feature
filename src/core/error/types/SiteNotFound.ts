"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class SiteNotFound
 * @constructor
 * @extends ApiError
 * @description This exception is thrown when a the site is not registered in the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class SiteNotFound extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.NOT_FOUND
	) {
		super("SiteNotFound", message, statusCode);
		Object.setPrototypeOf(this, SiteNotFound.prototype);
	}
};
