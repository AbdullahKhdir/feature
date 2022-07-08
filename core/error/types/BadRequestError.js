'use strict';

const Constants = require("../../../app/utils/Constants");
const ApiError = require("../ApiError");

module.exports = class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        const _constants = Object.assign(new Constants());
        super(_constants.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST, message);
    }
 }