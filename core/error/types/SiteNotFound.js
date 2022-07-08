'use strict';

const Constants = require("../../../app/utils/Constants");
const ApiError = require("../ApiError");

module.exports = class SiteNotFound extends ApiError {
    constructor(message = 'Site Not Found') {
        const _constants = Object.assign(new Constants());
        super(_constants.getConstants().HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND, message);
    }
 }