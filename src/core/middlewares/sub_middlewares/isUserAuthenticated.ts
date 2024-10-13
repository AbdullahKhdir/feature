import { NextFunction, Request, Response } from "express";
export = (request: Request, response: Response, next: NextFunction) => {
	if (request.method === "GET") {
		if (request.url === "/login" || request.url === "/login/") {
			if (typeof request.session.isUserAuthenticated === "undefined") {
				next();
			} else {
				return response.redirect("/");
			}
		} else if (request.url === "/signup/" || request.url === "/signup") {
			if (typeof request.session.isUserAuthenticated === "undefined") {
				next();
			} else {
				return response.redirect("/");
			}
		} else {
			if (typeof request.session.isUserAuthenticated === "undefined") {
				request.session.redirectUrl = request.headers.referer || request.originalUrl || request.url;
				return response.redirect((this as any).constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, "/login");
			} else {
				next();
			}
		}
	} else {
		if (typeof request.session.isUserAuthenticated === "undefined") {
			request.session.redirectUrl = request.headers.referer || request.originalUrl || request.url;
			return response.redirect((this as any).constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, "/login");
		} else {
			next();
		}
	}
};
