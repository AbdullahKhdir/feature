import Morgan from "morgan";
import file_system from "fs";
import path from "path";
import constants from "../../app/utils/Constants";

export = Morgan("combined", {
	stream: file_system.createWriteStream(path.join(__dirname, "..", "access.log"), { flags: "a" }),
	skip: (req, res) => res.statusCode <= constants.getConstantsInstance().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
});
