//**************************************************************
//* API CONTROLLER: Rest.ts
//**************************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: features/Migrate
//**************************************************************

"use strict";

import { NextFunction, Request, Response, Router } from "express";
import JsonResponse from "../../../core/response/types/JsonResponse";
import becrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import User from "../../models/shop/User";
import UserSecurityQuestion from "../../models/shop/UserSecurityQuestion";
import jwt from "jsonwebtoken";
import * as config from "../../../core/config";
import Api from "../../../core/api/Api";
import Error from "../../../core/error/types/Error";

/*
 ! The partner system of the api must be registered in the cors configs 
 ! so that partner client reaches the api's endpoints 
*/
export = class Rest extends Api {
	//*****************************************************************\\
	//? CONSTRUCTOR FOR INITIALIZING ALL THE NECESSARY CONFIGURATIONS ?\\
	//*****************************************************************\\
	public methods: any;
	user: User;
	user_security_questions: UserSecurityQuestion;
	constructor() {
		super();

		//? ************************************************************** ?\\
		//? this.method is used to deploy all the routes to express router ?\\
		//! dynamic routes must be the last index of the methods array     !\\
		//? ************************************************************** ?\\
		this.methods = [
			//**********\\
			//* Routes *\\
			//**********\\
			"getExmaple",
			"postExmaple",
			"patchExmaple",
			"putExmaple",
			"deleteExmaple",
			"postAuthenticate"
			//******************\\
			//* DYNAMIC Routes *\\
			//******************\\
		];

		//***************\\
		//* INIT MODELS *\\
		//***************\\
		this.user = new User();
		this.user_security_questions = new UserSecurityQuestion();

		//*********************\\
		//* PROJECT CONSTANTS *\\
		//*********************\\
	}

	//**********\\
	//* Routes *\\
	//**********\\
	/**
	 * @function getExmaple
	 * @description getExmaple route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	getExmaple = () =>
		this.route(
			"get",
			"/get_example",
			{},
			async (req: Request, res: Response, next: NextFunction) => {
				// return this.onError(res, next, 'declined api endpoint get');
				// return next(new Error('declined api endpoint get'));
				return new JsonResponse(200, "Success got", { success: "OK" }).sendAsJson(res);
			},
			true
		);

	/**
	 * @function postExmaple
	 * @description postExmaple route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	postExmaple = () =>
		this.route(
			"post",
			"/post_example",
			{ is_logged_in: this.isApiUserLoggedIn },
			async (req: Request, res: Response, next: NextFunction) => {
				return new JsonResponse(201, "Success posted", { success: "OK", id: new Date() }).sendAsJson(res);
			},
			true
		);

	/**
	 * @function patchExmaple
	 * @description patchExmaple route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	patchExmaple = () =>
		this.route(
			"patch",
			"/patch_example",
			{ is_logged_in: this.isApiUserLoggedIn },
			async (req: Request, res: Response, next: NextFunction) => {
				return new JsonResponse(201, "Success patched", {
					success: "OK",
					origin: req.origin,
					user_infos: req.user,
					uid: new Date()
				}).sendAsJson(res);
			},
			true
		);

	/**
	 * @function putExmaple
	 * @description putExmaple route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	putExmaple = () =>
		this.route(
			"put",
			"/put_example",
			{ is_logged_in: this.isApiUserLoggedIn },
			async (req: Request, res: Response, next: NextFunction) => {
				return new JsonResponse(201, "Success put", { success: "OK", id: new Date() }).sendAsJson(res);
			},
			true
		);

	/**
	 * @function deleteExmaple
	 * @description deleteExmaple route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	deleteExmaple = () =>
		this.route(
			"delete",
			"/delete_example",
			{ is_logged_in: this.isApiUserLoggedIn },
			async (req: Request, res: Response, next: NextFunction) => {
				return new JsonResponse(200, "Success deleted", { success: "OK", id: new Date() }).sendAsJson(res);
			},
			true
		);

	/**
	 * @function postAuthenticate
	 * @description Check user's authentication's infos
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	postAuthenticate = () =>
		this.route(
			"post",
			"/api-login",
			this.validatedLogin(),
			async (req: Request, res: Response, next: NextFunction) => {
				const errors = validationResult(req);
				const email = req.getFormPostedData("email");
				const password = req.getFormPostedData("password");

				if (errors.isEmpty()) {
					this.user
						.get({ email: email })
						.then((rows) => {
							if (
								typeof rows === "undefined" ||
								rows == null ||
								this._.isEmpty(rows) ||
								(rows as any).length === 0
							) {
								return new JsonResponse(
									this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED,
									"Email or password are not correct!, Please insert a valid E-mail address or sign up!",
									{ status_code: this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED }
								).sendAsJson(res);
							}
							rows = (rows as any)[0];
							becrypt
								.compare(password, (rows as any).password)
								.then((do_match) => {
									if (do_match) {
										if (typeof rows !== "undefined") {
											const token = jwt.sign(
												{ user: rows },
												config.configurations().apiAuthenticationSecret,
												{ expiresIn: "1h" }
											);
											return new JsonResponse(
												this.constants.HTTPS_STATUS.SUCCESS.OK,
												"Logged in",
												{
													success: "OK",
													status_code: this.constants.HTTPS_STATUS.SUCCESS.OK,
													token: token
												}
											).sendAsJson(res);
										}
									} else {
										return new JsonResponse(
											this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED,
											"Email or password are not correct!, Please insert a valid data or sign up!",
											{ status_code: this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED }
										).sendAsJson(res);
									}
								})
								.catch((err: any) => this.onError(res, next, new Error(JSON.stringify(err))));
						})
						.catch((err: any) => this.onError(res, next, new Error(JSON.stringify(err))));
				} else {
					return new JsonResponse(
						this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNPROCESSABLE_ENTITY,
						"Invalid Email-Address or wrong password!",
						{
							message: JSON.stringify(errors.array()) || errors.array().toString(),
							status_code: this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNPROCESSABLE_ENTITY
						}
					).sendAsJson(res);
				}
			},
			true
		);

	//******************************\\
	//* Sign in middleware         *\\
	//******************************\\
	protected validatedLogin = () => ({
		validate_email: check("email").isEmail().withMessage("Please enter a valid email!").bail(),
		validate_password: check("password").not().isEmpty().withMessage("Please enter your password!").bail()
	});

	//******************************\\
	//* Sign in middleware         *\\
	//******************************\\
	protected isApiUserLoggedIn = (req: Request, res: Response, next: NextFunction): Error | void => {
		const AUTHORIZATION_HEADER = req.get("Authorization");

		if (!AUTHORIZATION_HEADER) {
			const error = new Error("Not Authenticated!");
			error.statusCode = this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED;
			throw error;
		}

		const TOKEN = AUTHORIZATION_HEADER.split(" ")[1];
		if (TOKEN) {
			let decoded_token: any;
			try {
				decoded_token = jwt.verify(TOKEN, config.configurations().apiAuthenticationSecret);
			} catch (error) {
				(error as Error).message = "Invalid authorization header token!";
				throw error;
			}
			if (!decoded_token) {
				const error = new Error("Not Authenticated!");
				error.statusCode = this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED;
				throw error;
			}
			req.user = decoded_token.user;
			return next();
		}
	};
};
