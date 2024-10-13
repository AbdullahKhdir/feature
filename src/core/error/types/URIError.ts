"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class URIError
 * @constructor
 * @extends ApiError
 * @description This indicates that one of the global URI handling functions
 *  was used in a way that is incompatible with its definition.
 * URI (Uniform Resource Indicator) in JS has the functions: decodeURI, decodeURIComponent, etc.
 * If we call any of them with the wrong parameter we will get a URIError
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class URIError extends ApiError {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
	) {
		super("URIError", message, statusCode);
		Object.setPrototypeOf(this, URIError.prototype);
	}
};
