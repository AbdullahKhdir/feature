"use strict";

import { NextFunction, Request, Response } from "express";
import { ReadStream } from "node:fs";
import * as config from "../config";
import ApiException from "../exception/ApiException";
import { Singleton } from "../Singleton/Singleton";
import { csrf, siteNotFound, error as _error } from "../utils/undefined-routes-logic";
import CustomError from "../error/types/Error";

/**
 * @class Response
 * @constructor
 * @description Class Response is used to define the Response Objects
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export abstract class ExpressResponse {
	private message: string;
	private statusCode: number;
	protected readonly constants: any;
	protected readonly express;
	protected readonly _;

	constructor(statusCode?: any, message: string = "") {
		this.message = message;
		this.statusCode = statusCode;
		this.constants = Singleton.getConstants();
		this.express = Singleton.getExpress();
		this._ = Singleton.getLodash();
	}

	/**
	 * @function getMessage
	 * @description getter for the property message
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns {string}
	 */
	get getMessage(): string {
		return this.message;
	}

	/**
	 * @function setMessage
	 * @description setter for the property message
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 */
	set setMessage(message: string) {
		this.message = message;
	}

	/**
	 * @function getStatusCode
	 * @description getter for the status code
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns {number}
	 */
	get getStatusCode(): number {
		return this.statusCode;
	}

	/**
	 * @function setStatusCode
	 * @description setter for the property statusCode
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 */
	set setStatusCode(statusCode: number) {
		this.statusCode = statusCode;
	}

	/**
	 * @function renderAsJson
	 * @description Sends a json response
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} resopnse
	 * @param {any} data
	 * @param {number} status
	 * @returns {Response}
	 */
	renderAsJson(resopnse: Response, data: any, status: number = this.constants.HTTPS_STATUS.SUCCESS.OK): Response {
		resopnse.type(this.constants.RESPONSE.TYPES.JSON);
		return resopnse.status(this.getStatusCode ?? status).json(ExpressResponse.sanitize(data));
	}

	/**
	 * @function render
	 * @description Sends a html response
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {string} template
	 * @param {object} options
	 * @param {Function} callback
	 * @param Number status
	 * @returns {Response}
	 */
	render(
		response: Response,
		template: string,
		options: object = {},
		status: number = this.constants.HTTPS_STATUS.SUCCESS.OK,
		callback?: (err: Error | null, html: string) => void
	): Response {
		response.type(this.constants.RESPONSE.TYPES.HTML);

		if (callback) {
			response
				.status(this.getStatusCode ?? status)
				.render(template, options, (error: Error | null, html: string) => {
					if (error) {
						response
							.status(this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR)
							.send(`An error occurred while rendering the page. \n ${error}`);
					} else {
						callback(error, html);
					}
				});

			return response;
		}

		response.status(this.getStatusCode ?? status).render(template, options);

		return response;
	}

	/**
	 * @function redirect
	 * @description redirect response to html page
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {string} url
	 * @param {number} status
	 * @returns {Response}
	 */
	redirect(
		response: Response,
		url: string,
		status: number = this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY
	): Response {
		response.type(this.constants.RESPONSE.TYPES.HTML);
		response.redirect(this.getStatusCode ?? status, url);

		return response;
	}

	/**
	 * @function toSameSite
	 * @description redirect response to html page
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {number} status
	 * @returns {Response}
	 */
	toSameSite(
		response: Response,
		status: number = this.constants.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT
	): Response {
		response.type(this.constants.RESPONSE.TYPES.HTML);
		response.redirect(this.getStatusCode ?? status, response.req.url);

		return response;
	}

	/**
	 * @function postToSameSite
	 * @description redirect response to html page
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {number} status
	 * @returns {Response}
	 */
	postToSameSite(
		response: Response,
		status: number = this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY
	): Response {
		response.type(this.constants.RESPONSE.TYPES.HTML);
		response.redirect(this.getStatusCode ?? status, response.req.route.path);
		return response;
	}

	/**
	 * @function siteNotFound
	 * @description undefined_routes html page
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @returns {Response}
	 */
	siteNotFound(response: Response): Response {
		return this.render(
			response,
			"undefined_routes",
			siteNotFound(response),
			this.constants.HTTPS_STATUS.CLIENT_ERRORS.NOT_FOUND
		);
	}

	/**
	 * @function onErrorValidation
	 * @description renders all the validation errors back to the user
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {object[] | string} errors
	 * @returns {Response}
	 */
	onErrorValidation(response: Response, errors: object[] | string): Response {
		response.type(this.constants.RESPONSE.TYPES.HTML);

		if (!response.req.flash) {
			throw new Error("Flash middleware is not initialized");
		}

		if (typeof errors !== "undefined") {
			if (this._.isArray(errors) && !this._.isEmpty(errors)) {
				let objWarnings = {};
				let erroredParams = {};

				errors.forEach((error: any, index: any) => {
					Object.assign(objWarnings, { [index]: `${error.msg}` });
					Object.assign(erroredParams, { [index]: `${error.param}` });
				});

				response.req.flash("validationErrors", JSON.stringify(objWarnings));
				response.req.flash("erroredInputs", JSON.stringify(erroredParams));
			} else if (typeof errors === "string") {
				const error = errors;
				response.req.flash("validationErrors", JSON.stringify({ error: error }));
				response.req.flash("erroredInputs", JSON.stringify({ error: error }));
			}
		}

		let status = null;
		if (response.req.method === this.constants.REQUEST.TYPE.GET) {
			status = this.constants.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT;
		} else if (response.req.method === this.constants.REQUEST.TYPE.POST) {
			status = this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY;
		} else {
			status = this.constants.HTTPS_STATUS.REDIRECTION.TEMPORARY_REDIRECT;
		}

		response.req.session.save((err: any) => {
			if (err) {
				return response.redirect("/");
			}
			response.redirect(response.req.url || "/");
		});

		return response;
	}

	/**
	 * @function sendPdf
	 * @description returns a pdf file to be downloaded instantly
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {PDFKit.PDFDocument | ReadStream} pdf
	 * @param {string} pdf_name
	 * @param {boolean} to_download
	 * @returns {Response}
	 */
	sendPdf(
		response: Response,
		pdf: PDFKit.PDFDocument | ReadStream,
		pdf_name: string = "pdf",
		to_download: boolean = false
	): Response {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");

		response.setHeader("Content-Type", this.constants.RESPONSE.TYPES.PDF);
		response.setHeader(
			"Content-Disposition",
			`${
				to_download ? "attachment" : "inline"
			}; filename="${year}_${month}_${day}_${hours}_${minutes}_${pdf_name}.pdf"`
		);

		pdf.pipe(response);

		return response;
	}

	/**
	 * @function invalidCsrfResponse
	 * @description undefined_routes html page for invalid csrf response
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @returns {Response}
	 */
	invalidCsrfResponse(response: Response): Response {
		return this.render(
			response,
			"undefined_routes",
			csrf(response),
			undefined,
			this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN
		);
	}

	/**
	 * @function onError
	 * @description undefined_routes html page on throwing an error
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {NextFunction} next
	 * @param {Error | string | { message?: string; statusCode: number }} error
	 * @returns {Response | void}
	 */
	onError(
		response: Response,
		next: NextFunction,
		error: Error | string | { message?: string; statusCode: number }
	): Response | void {
		const environment = config.configurations().environment;
		const detailedError = this.getDetailedError();
		let error_message =
			typeof error === "string" ? error : error instanceof Error ? error.stack ?? "" : "Unexpected error";

		if (environment === "development") {
			if (typeof error === "string") {
				error = error + `\n${detailedError}`;
				const customError = new CustomError(error);
				customError.statusCode = this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
				return next(customError);
			} else if (error instanceof Error) {
				error.message = `${error.stack}`;
				return next(error);
			}

			return this.renderErrorPage(response, "Unexpected error", 500, "Please contact the support team.");
		}

		if (error instanceof Error && !(error instanceof ApiException)) {
			console.error(error_message);
			(error as any).statusCode = 500;
			return next(error.stack ?? `\n${detailedError}`);
		} else if (typeof error === "string") {
			const genericError = new Error(error + `\n${detailedError}`);
			return next(genericError);
		} else if (typeof error === "object" && error instanceof ApiException) {
			return next(error.stack ?? `\n${detailedError}`);
		}

		return this.renderErrorPage(response, error_message as string, 500, "Unexpected error occurred.");
	}

	/**
	 * @function renderErrorPage
	 * @description undefined_routes html page on throwing an error
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {string} title
	 * @param {number} statusCode
	 * @param {string} description
	 * @returns {Response}
	 */
	private renderErrorPage(response: Response, title: string, statusCode: number, description: string): Response {
		return this.render(
			response,
			"undefined_routes",
			{
				nav_title: "",
				path: "/undefined_routes/",
				isUserAuthenticated: response?.req?.session?.isUserAuthenticated,
				error: null,
				warning: null,
				success: null,
				status_code: statusCode,
				status_title: title,
				status_description: description,
				url: "/",
				label: "Home"
			},
			undefined,
			this.constants.HTTPS_STATUS.SERVER_ERRORS.SERVICE_UNAVAILABLE
		);
	}

	/**
	 * @function send
	 * @description Sends a html response
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @param {any} body
	 * @param {number} status
	 * @returns Response
	 */
	send(response: Response, body: any, status: number = this.constants.HTTPS_STATUS.SUCCESS.OK): Response {
		response.type(this.constants.RESPONSE.TYPES.HTML);
		response.status(this.statusCode ?? status).send(body);
		return response;
	}

	/**
	 * @function sanitize
	 * @description Prepares and cleans the json data to be send in the response
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Response} response
	 * @returns {object}
	 */
	static sanitize(response: Response): object {
		const clone: any = {};
		Object.assign(clone, response);
		for (const i in clone) if (typeof clone[i] === "undefined") delete clone[i];
		return clone;
	}

	/**
	 * @function getErrorDetails
	 * @description Captures and returns detailed error information, including function name, file name, line number, and column number.
	 * @returns {string} A string containing error information.
	 */
	getDetailedError(): string {
		const util = require("node:util");
		const callSites: Array<any> = util.getCallSite(); // Adjust based on actual util method availability

		let detailedError = "\n Stack Trace: \n";
		callSites.forEach((callSite, index) => {
			detailedError += `CallSite ${index + 1}: \n`;
			detailedError += `Function Name: ${callSite.functionName ?? "N/A"} \n`;
			detailedError += `Script Name: ${callSite.scriptName ?? "N/A"} \n`;
			detailedError += `Line Number: ${callSite.lineNumer ?? "N/A"} \n`;
			detailedError += `Column Number: ${callSite.column ?? "N/A"} \n`;
		});

		return detailedError || "Unable to extract stack trace.";
	}
}
