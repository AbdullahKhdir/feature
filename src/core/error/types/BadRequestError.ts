'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class BadRequestError
 * @constructor
 * @extends ApiError
 * @description The 400 Bad Request Error is an HTTP response status code indicating
 *  that the server was unable to process the request sent by the client
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST, message);
        // TODO: render bad request error page
    }
 }