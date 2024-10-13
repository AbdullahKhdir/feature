import { Request, Response } from "express";

type options = {
	nav_title?: string;
	path?: string;
	isUserAuthenticated?: boolean;
	error?: string | [] | null;
	warning?: string | [] | null;
	success?: string | [] | null;
	status_code?: number;
	status_title?: string;
	status_description?: string;
	url?: string;
	label?: string;
};

const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

export function csrf(res: Response, object: options = {}) {
	let _object = {
		nav_title: "",
		path: "/undefined_routes/",
		isUserAuthenticated: res?.req?.session?.isUserAuthenticated,
		error: "",
		warning: "",
		success: null,
		status_code: 403,
		status_title: "Request was interrupted!",
		status_description: "Please do not alter or delete the csrf token!",
		url: "/",
		label: "Home"
	};
	return Object.assign(_object, object);
}

export function siteNotFound(res: Response, return_type: "template" | "json" = "template", object: options = {}) {
	let _object;
	if (return_type === "template") {
		_object = {
			nav_title: "",
			path: "/undefined_routes/",
			isUserAuthenticated: res?.req?.session?.isUserAuthenticated,
			error: null,
			warning: null,
			success: null,
			status_code: 404,
			status_title: "UH OH! You're lost.",
			status_description: `The page you are looking for does not exist.
            How you got here is a mystery. But you can click the button below
            to go back to the homepage.`,
			url: "/",
			label: "Home"
		};
	} else {
		_object = {
			statusCode: 400,
			message: "Bad Request"
		};
	}
	return Object.assign(_object, object);
}

export function exception(res: Response, return_type: "template" | "json" = "template", object: options = {}) {
	var error_message = null;
	if (object instanceof Error) {
		error_message = object.message;
	}
	let _object;
	if (return_type === "template") {
		_object = {
			nav_title: "",
			path: "/undefined_routes/",
			isUserAuthenticated: res?.req?.session?.isUserAuthenticated,
			error: null,
			warning: null,
			success: null,
			status_code: 503,
			status_title: "Exception is thrown.",
			status_description: capitalize(error_message!) || `Please contact the support team!`,
			url: "/",
			label: "Home"
		};
	} else {
		_object = {
			statusCode: 503,
			message: capitalize(error_message!) || `Please contact the support team!`
		};
	}
	return Object.assign(_object, object);
}

export function error(res: Response, return_type: "template" | "json" = "template", object: options = {}) {
	var error_message = null;
	if (object instanceof Error) {
		error_message = object.message;
	}
	let _object;
	if (return_type === "template") {
		_object = {
			nav_title: "",
			path: "/undefined_routes/",
			isUserAuthenticated: res?.req?.session?.isUserAuthenticated,
			error: null,
			warning: null,
			success: null,
			status_code: 500,
			status_title: "Unexpected error",
			status_description: capitalize(error_message!) || `Please contact the support team!`,
			url: "/",
			label: "Home"
		};
	} else {
		_object = {
			statusCode: 500,
			message: capitalize(error_message!) || `Please contact the support team!`
		};
	}
	return Object.assign(_object, object);
}

export function undefinedHttpRequest(
	res: Response,
	return_type: "template" | "json" = "template",
	object: options = {}
) {
	let _object;
	if (return_type === "template") {
		_object = {
			nav_title: "",
			path: "/undefined_routes/",
			isUserAuthenticated: res?.req?.session?.isUserAuthenticated,
			error: null,
			warning: null,
			success: null,
			status_code: 400,
			status_title: "Bad Request",
			status_description: `Wondering from where have you requested this url, but you can click the button below
            to go back to the homepage.`,
			url: "/",
			label: "Home"
		};
	} else {
		_object = {
			statusCode: 400,
			message: "Bad Request"
		};
	}
	return Object.assign(_object, object);
}
