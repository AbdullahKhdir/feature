'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiError from "../ApiError";

/**
 * @class SiteNotFound
 * @constructor
 * @extends ApiError
 * @description This exception is thrown when a the site is not registered in the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class SiteNotFound extends ApiError {
    constructor(message = 'Site Not Found') {
        const _constants = Singleton.getConstants();
        super(_constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND, message);
        // TODO: render site not found page
    }
 }