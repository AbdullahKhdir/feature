'use strict';

const Constants   = require("../../../app/utils/Constants");
const ApiResponse = require("../ApiResponse");

/**
 * @class Response
 * @constructor
 * @extends ApiResponse
 * @description Class Response is used to send the response
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Response extends ApiResponse {

    constructor() {
        const _constants = Object.assign(new Constants());
        super(_constants.getConstants().HTTPS_STATUS.SUCCESS.OK, 'OK');
    }
 
    /**
     * @function render
     * @description Sends html response to the client 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param String template
     * @param Object options
     * @param Function callback
     * @returns Response
    */
    render(res, template, options = {}, callback = null, status = _constants.getConstants().HTTPS_STATUS.SUCCESS.OK) {
       return super.render(res, template, options, callback, status);
    }
 }