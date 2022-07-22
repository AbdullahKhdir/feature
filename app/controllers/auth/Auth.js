'use strict';

const BaseController = require("../../../core/controller/BaseController");
const Lodash         = require("../../utils/Lodash");
const Promise        = require("../../../core/utils/Promise");

/**
 * @class Auth
 * @constructor
 * @extends BaseController
 * @description Class Auth to authenticate the users
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Auth extends BaseController {
    
    #corsOptionsDelegate;
    constructor() {
        super();
        this.methods = [
            'authenticate'
        ];
        this.__ = new Lodash().__;

        /*
         ? CORS CONFIGURATIONS 
        */
        const whitelist = ['http://example1.com', 'http://example2.com'];
        this.#corsOptionsDelegate = function (req, callback) {
            let corsOptions;
            if (whitelist.indexOf(req.header('Origin')) !== -1) {
                // reflect (enable) the requested origin in the CORS response
                corsOptions = { 
                    origin:               true,
                    methods:              ['GET'],
                    preflightContinue:    false,
                    maxAge:               86400,
                    allowedHeaders:       ['Content-Type', 'Authorization'],
                    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
                }
            } else {
                // disable CORS for this request
                corsOptions = { 
                    origin:               false,
                }
            }
            callback(null, corsOptions); // callback expects two parameters: error and options
        }
    }

    /**
     * @function authenticate
     * @description authentication route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
     */
    authenticate           = () => this._().get('/login/', Promise.asyncHandler(async (req, res, next) => {
        return this.render(
            res,
            'shop/auth',
            {
                page_title: 'Login',
                path : '/login/'
            }
        );
    }));
}