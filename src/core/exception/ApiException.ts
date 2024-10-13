"use strict";

/**
 * @class ApiException
 * @constructor
 * @extends Error
 * @description Class ApiException to throw all kinds of exceptions
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class ApiException extends Error {
	statusCode: number;
	override name: string;

	constructor(name: string, message: string, status_code: number) {
		super(message);

		this.statusCode = status_code;
		this.name = name;

		Object.setPrototypeOf(this, ApiException.prototype);
	}

	override toString() {
		return `${this.name}: ${this.message} (status code: ${this.statusCode})`;
	}
};
