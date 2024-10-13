"use strict";

import { Response } from "express";
import { Singleton } from "../../Singleton/Singleton";
import { ExpressResponse } from "../ExpressResponse";

/**
 * @class JsonResponse
 * @constructor
 * @extends Response
 * @description Class JsonResponse is used to send the response as json object
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class JsonResponse extends ExpressResponse {
	protected data: any;
	protected jsonMessage: string;
	protected code: number;
	constructor(code: number, message: string, data: any) {
		const _constants = Singleton.getConstants();
		super(code || _constants.HTTPS_STATUS.SUCCESS.OK, message);
		this.jsonMessage = message;
		this.data = data;
		this.code = code;
	}

	/**
	 * @function sendAsJson
	 * @description Sends json response to the client
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param Response res
	 * @returns Response
	 */
	sendAsJson(res: Response) {
		return super.renderAsJson(
			res,
			Object.assign(
				{ status_code: this.code || Singleton.getConstants().HTTPS_STATUS.SUCCESS.OK },
				{ message: this.jsonMessage },
				{ data: this.data }
			)
		);
	}
};
