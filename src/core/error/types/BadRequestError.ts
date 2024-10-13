"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class BadRequestError
 * @constructor
 * @extends ApiError
 * @description The 400 Bad Request Error is an HTTP response status code indicating
 *  that the server was unable to process the request sent by the client
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class BadRequestError extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
	) {
		super("BadRequestError", message, statusCode);
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
};
