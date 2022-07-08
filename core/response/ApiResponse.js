'use strict';

const Constants = require("../../app/utils/Constants");

module.exports = class ApiResponse {

    #status_code;
    #response_status;
    #message;
    #codes;
    constructor(status_code, response_status, message = '') {
        this.#message         = message;
        this.#status_code     = status_code;
        this.#response_status = response_status;
        this.#codes           = Object.assign(new Constants());
    }
 
    renderAsJson(res, data, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.JSON);
        if (typeof this.#status_code === 'undefined') {
            return res.status(status).json(ApiResponse.sanitize(data));
        }
        return res.status(this.#status_code).json(ApiResponse.sanitize(data));
    }

    render(res, view, options = {}, callback = null, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        if (typeof this.#status_code === 'undefined') {
            return res.status(status).render(view, options, callback);
        }
        return res.status(this.#status_code).render(view, options, callback);
    }

    send(res, body, status = this.#codes.getConstants().HTTPS_STATUS.SUCCESS.OK) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        if (typeof this.#status_code === 'undefined') {
            res.status(status).send(body);
            return res.end();
        }
        res.status(this.#status_code).send(body);
        return res.end();
    }
 
    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        // delete {some_field};
        delete clone.status;
        for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
        return clone;
    }
}