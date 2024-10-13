import { NextFunction, Request, Response } from "express";
import { Singleton } from "../../Singleton/Singleton";

const updateCurrentUser = (request: Request, response: Response) => {
	const Cart = require("../../app/models/shop/Cart");
	const Product = require("../../app/models/shop/Product");
	const Order = require("../../app/models/shop/Order");
	const currentUser = request.session.currentUser || {};

	request.session.currentUser = Object.assign(currentUser, {
		getCart: () => new Cart().filter({ user_id: currentUser.id }),
		getProducts: () => new Product().filter({ user_id: currentUser.id }),
		getOrder: () => new Order().filter({ user_id: currentUser.id })
	});

	request.session.save((err: any) => {
		if (err) {
			return (this as any).onError(response, err);
		}
	});
};

const isUserAuthenticated = (request: Request) => {
	return (
		request.session.isUserAuthenticated !== undefined &&
		request.session.currentUser &&
		typeof request.session.currentUser !== "undefined"
	);
};

const redirectToLogin = (res: Response) => {
	return res.redirect(Singleton.getConstants().HTTPS_STATUS.REDIRECTION.SEE_OTHER, "/login");
};

export = (request: Request, response: Response, next: NextFunction) => {
	if (request.method === "GET") {
		if (isUserAuthenticated(request)) {
			updateCurrentUser(request, response);
			return next();
		} else {
			return redirectToLogin(response);
		}
	} else if (isUserAuthenticated(request)) {
		updateCurrentUser(request, response);
		return next();
	} else if (
		request.method === "POST" &&
		request.url !== "/login/" &&
		request.url !== "/login" &&
		request.url !== "/signup/" &&
		request.url !== "/signup"
	) {
		return redirectToLogin(response);
	} else {
		return next();
	}
};
