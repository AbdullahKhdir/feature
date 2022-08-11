'use strict';

const BaseController = require("../../../core/controller/BaseController");
const User           = require("../../models/shop/User");
const becrypt        = require('bcryptjs');
const Lodash         = require("../../utils/Lodash");
const { isEmpty } = require("lodash");

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
        this.__   = new Lodash().__;
        this.user = new User();
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
    getAuthenticate           = () => this.route('get', '/login/', {}, async (req, res, next) => {
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
    postAuthenticate          = () => this.route('post', '/login/', {}, async (req, res, next) => {
        const email    = req.body.email;
        const password = req.body.password;
        
        if (this.__.isEmpty(email) || this.__.isEmpty(password)) {
            res.send('<h1>Email and password must not be empty!</h1>');
            return res.end();
        }
        
        this.user.get({email: email})
        .then((rows) => {
            rows = rows[0];
            if (rows) {
                becrypt.compare(password, rows.password)
                .then(do_match => {
                    if (do_match) {
                        if (typeof rows !== 'undefined') {
                            req.session.currentUser = rows;
                            req.session.save((err) => {
                                if (err) {
                                    console.log(err)
                                }
                                if (!res.headersSent) {
                                    req.session.is_authenticated = true;
                                    return this.redirect(res, '/');
                                }
                            });
                        }
                    } else {
                        res.send('<h1>Email and password are not correct!</h1><br><p>Please insert a valid data or sign up!</p>');
                        return res.end();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                res.send('<h1>Email and password are not correct!</h1><br><p>Please insert a valid data or sign up!</p>');
                return res.end();
            }
        })
        .catch(err => {
            console.log(err);
        });
    });

    /**
     * @function getAuthenticate
     * @description Get authentication user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getSignUp           = () => this.route('get', '/signup/', {}, async (req, res, next) => {
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
    postSignUp          = () => this.route('post', '/signup/', {}, async (req, res, next) => {
        const first_name       = req.body.first_name;
        const last_name        = req.body.last_name;
        const email            = req.body.email;
        const password         = req.body.password;
        const confrim_password = req.body.confrim_password;

        if (confrim_password !== password) {
            res.send('<h1>Password do not match!</h1>');
            return res.end();
        }

        this.user.filter({first_name: first_name, last_name: last_name, email: email})
        .then((rows) => {
            if (!rows) {
                becrypt.hash(password, 12)
                    .then(hashed_password => {
                        this.user.create({first_name: first_name, last_name: last_name, email: email, password: hashed_password})
                        .then(result => {
                            if (result) {
                                return this.render(
                                    res,
                                    'shop/login',
                                    {
                                        page_title: 'Login',
                                        path : '/login/'
                                    }
                                );
                            }
                        })
                        .catch(err => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                return this.render(
                    res,
                    'shop/login',
                    {
                        page_title: 'Login',
                        path : '/login/'
                    }
                );
            }
        })
        .catch(err => {
            if (err) {
                console.log(err);
            }
        })
    });

    /**
     * @function logout
     * @description Log user out 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    logout                   = () => this.route('post', '/logout/', {}, async (req, res, next) => {
        res.onLogOut(req.user_cookie);
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            return this.redirect(res, '/');
        });
    });
}