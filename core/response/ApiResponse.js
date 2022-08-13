'use strict';

const Constants = require("../../app/utils/Constants");
const Db = require("../database/Db");

/**
 * @class ApiResponse
 * @constructor
 * @description Class ApiResponse is used to define the Response Objects 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ApiResponse extends Db {

    #status_code;
    #response_status;
    #message;
    #codes;
    constructor(status_code, response_status, message = '') {
        super();
        this.#message         = message;
        this.#status_code     = status_code;
        this.#response_status = response_status;
        this.#codes           = Object.assign(new Constants());
    }
 
    /**
     * @function renderAsJson
     * @description Sends a json response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param Object data
     * @param Number status
     * @returns Response
    */
    renderAsJson(res, data, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.JSON);
        if (typeof this.#status_code === 'undefined') {
            return res.status(status).json(ApiResponse.sanitize(data));
        }
        return res.status(this.#status_code).json(ApiResponse.sanitize(data));
    }

    /**
     * @function render
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param String template
     * @param Object options
     * @param Function callback
     * @param Number status
     * @returns Response
    */
    render(res, template, options = {}, callback = null, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        if (typeof this.#status_code === 'undefined') {
            return res.status(status).render(template, options, callback);
        }
        return res.status(this.#status_code).render(template, options, callback);
    }

    /**
     * @function redirect
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param String url
     * @param Number status
     * @returns Response
    */
    redirect(res, url, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        if (typeof this.#status_code === 'undefined') {
            res.status(status).redirect(url);
            res.end();
            return;
        }
        res.status(this.#status_code).redirect(url);
        res.end();
        return;
    }

    /**
     * @function send
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param String body
     * @param Number status
     * @returns Response
    */
    send(res, body, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        if (typeof this.#status_code === 'undefined') {
            res.status(status).send(body);
            return res.end();
        }
        res.status(this.#status_code).send(body);
        return res.end();
    }
 
    /**
     * @function sanitize
     * @description Prepares and cleans the json data to be send in the response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns object
    */
    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        // delete {some_field};
        delete clone.status;
        for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
        return clone;
    }
}