'use strict';

const Constants = require("../../../app/utils/Constants");
const ApiResponse = require("../ApiResponse");

module.exports = class Response extends ApiResponse {

    constructor() {
        const _constants = Object.assign(new Constants());
        super(_constants.getConstants().HTTPS_STATUS.SUCCESS.OK, 'OK');
    }
 
    render(res, view, options = {}, callback = null) {
       return super.render(res, view, options, callback);
    }
 }