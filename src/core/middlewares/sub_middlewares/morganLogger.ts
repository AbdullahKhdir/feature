import morgan from "morgan";
import fileSystem from "fs";
import path from "path";
import { Request, Response } from "express";
import { Singleton } from "../../Singleton/Singleton";

export = morgan("combined", {
	stream: fileSystem.createWriteStream(path.join(__dirname, "..", "access.log"), { flags: "a" }),
	skip: (request: Request, response: Response) =>
		response.statusCode <= Singleton.getConstantsInstance().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
});
