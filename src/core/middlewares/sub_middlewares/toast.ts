import { NextFunction, Request, Response } from "express";
export const toast = (req: Request, res: Response, next: NextFunction, app: any) => {
	const flashArray: any = req.flash();
	let validationErrors = null;
	let erroredInputs = null;
	let error = null;
	let warning = null;
	let success = null;
	let postData = null;
	let getData = null;

	if (typeof flashArray["error"] !== "undefined") {
		error = flashArray["error"];
	}
	if (typeof flashArray["warning"] !== "undefined") {
		warning = flashArray["warning"];
	}
	if (typeof flashArray["success"] !== "undefined") {
		success = flashArray["success"];
	}
	if (typeof flashArray["postData"] !== "undefined") {
		postData = flashArray["postData"][0];
	}
	if (typeof flashArray["getData"] !== "undefined") {
		getData = flashArray["getData"];
	}
	if (typeof flashArray["validationErrors"] !== "undefined") {
		validationErrors = JSON.parse(flashArray["validationErrors"]);
	}
	if (typeof flashArray["erroredInputs"] !== "undefined") {
		erroredInputs = JSON.parse(flashArray["erroredInputs"]);
	}
	res.locals["error"] = error;
	res.locals["warning"] = warning;
	res.locals["success"] = success;
	res.locals["validationErrors"] = validationErrors;
	res.locals["erroredInputs"] = erroredInputs;
	res.locals["postData"] = postData || {};
	res.locals["getData"] = getData;
	app.locals.error = error;
	app.locals.warning = warning;
	app.locals.success = success;
	app.locals.postData = postData || {};
	app.locals.getData = getData;

	req.props = () => flashArray;
	req.setProp = (key: any, value: any) => {
		if (!key || !value) {
			return false;
		}
		req.flash(key, value);
		return true;
	};

	next();
};
