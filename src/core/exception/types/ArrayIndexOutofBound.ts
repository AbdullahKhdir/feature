"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class ArrayIndexOutOfBound
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you try to access an array with an invalid index value.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class ArrayIndexOutOfBound extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
	) {
		super("ArrayIndexOutOfBound", message, statusCode);
		Object.setPrototypeOf(this, ArrayIndexOutOfBound.prototype);
	}
};
