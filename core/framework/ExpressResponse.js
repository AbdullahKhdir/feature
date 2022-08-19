'use strict';

const Constants = require('../../app/utils/Constants');
const Express = require('./Express');

/**
 * @class ExpressResponse
 * @constructor
 * @extends Express
 * @description Class ExpressResponse to define and initiate the response object
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ExpressResponse extends Express {
    
    #status_code;
    #codes;
    constructor(status_code, { Response } = super()) {
        super();
        // TODO: work on the response object and add the edited functionality and return an instance of the class
        this.response         = Response;
        this.#status_code     = status_code;
        this.#codes           = Object.assign(new Constants());
    }

    test = () => {
        return 'test';
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
    redirect(res, url, status = this.#codes.getConstants().HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        if (typeof this.#status_code === 'undefined') {
            res.redirect(status, url);
            res.end();
            return;
        }
        res.redirect(this.#status_code, url);
        res.end();
        return;
    }

    /**
     * @function toSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param String url
     * @param Number status
     * @returns Response
    */
    toSameSite(res, status = this.#codes.getConstants().HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        res.redirect(status, res.req.route.path);
        res.end();
        return;
    }

    /**
     * @function postToSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @param String url
     * @param Number status
     * @returns Response
    */
    postToSameSite(res, status = this.#codes.getConstants().HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY) {
        res.type(this.#codes.getConstants().RESPONSE.TYPES.HTML);
        res.redirect(status, res.req.route.path);
        res.end();
        return;
    }

    /**
     * @function siteNotFound
     * @description 404 html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns Response
    */
    siteNotFound(res) {
        return this.render(
            res,
            '404',
            {page_title: 'Page not found', path: '/404/'},
            null,
            this.#codes.getConstants().HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND
        );
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