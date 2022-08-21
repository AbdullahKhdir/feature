'use strict';

const Constants   = require("../../../app/utils/Constants");
const Response = require("../Response");

/**
 * @class JsonResponse
 * @constructor
 * @extends Response
 * @description Class JsonResponse is used to send the response as json object
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports =  class JsonResponse extends Response {

    #data;
    #message;
    constructor(message, data) {
        const _constants = Object.assign(new Constants());
        super(_constants.getConstants().HTTPS_STATUS.SUCCESS.OK, 'OK', message);
        this.#message = message;
        this.#data    = data;
    }
 
    /**
     * @function sendAsJson
     * @description Sends json response to the client 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns Response
    */
    sendAsJson(res) {
       return super.renderAsJson(res, Object.assign(this, {message: this.getMessage()}, {data: this.getData()}));
    }

    /**
     * @function getData
     * @description Gets the json data
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object
    */
    getData() {
        console.log(this.#data)
        return this.#data;
    }

    /**
     * @function getMessage
     * @description Gets the message
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object
    */
    getMessage() {
        return this.#message;
    }
 }