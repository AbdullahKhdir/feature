'use strict';

const BaseController = require("../../../core/controller/BaseController");
const Lodash         = require("../../utils/Lodash");

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
            'getAuthenticate',
            'postAuthenticate',
            'getSignUp',
            'postSignUp',
            'logout'
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
     * @function getAuthenticate
     * @description Get authentication user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getAuthenticate           = () => this.route('get', '/login/', async (req, res, next) => {
        return this.render(
            res,
            'shop/login',
            {
                page_title: 'Login',
                path : '/login/'
            }
        );
    }, this.cors(this.#corsOptionsDelegate));

    /**
     * @function postAuthenticate
     * @description Check user's authentication's infos 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postAuthenticate          = () => this.route('post', '/login/', async (req, res, next) => {
        req.session.is_authenticated = true;
        return this.redirect(res, '/');
    });

    /**
     * @function getAuthenticate
     * @description Get authentication user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getSignUp           = () => this.route('get', '/signup/', async (req, res, next) => {
        return this.render(
            res,
            'shop/signup',
            {
                page_title: 'Sign up',
                path : '/signup/'
            }
        );
    });

    /**
     * @function postSignUp
     * @description Check user's authentication's infos 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postSignUp          = () => this.route('post', '/signup/', async (req, res, next) => {
        return this.redirect(res, '/');
    });

    /**
     * @function logout
     * @description Log user out 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    logout                   = () => this.route('post', '/logout/', async (req, res, next) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            return this.redirect(res, '/');
        });
    });
}