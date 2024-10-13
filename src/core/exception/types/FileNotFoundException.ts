"use strict";

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class FileNotFoundException
 * @constructor
 * @extends ApiException
 * @description This is used to identify When file is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class FileNotFoundException extends ApiException {
	constructor(
		message: string = "",
		statusCode: number = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.NOT_FOUND
	) {
		super("FileNotFoundException", message, statusCode);
		Object.setPrototypeOf(this, FileNotFoundException.prototype);
	}
};
