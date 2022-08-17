'use strict';

const BaseController = require("../../../core/controller/BaseController");
const User           = require("../../models/shop/User");
const becrypt        = require('bcryptjs');
const Lodash         = require("../../utils/Lodash");
const isAuth          = require("../../middlewares/is_auth");
const userSession     = require("../../middlewares/init_user_session");

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
            'logout',
            'postReset',
            'getReset',
            'getSecurityQuestions',
            'postSecurityQuestions'
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
            req.flash('warning', 'Email and password must not be empty!');
            return this.redirect(res, '/login');
        }
        this.user.get({email: email})
        .then((rows) => {
            console.log(rows);
            if (typeof rows === 'undefined' || rows == null || this.__.isEmpty(rows) || rows.length === 0) {
                req.flash('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                return this.redirect(res, '/login');
            }
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
                        req.flash('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                        return this.redirect(res, '/login');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                req.flash('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                return this.redirect(res, '/login');
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
        const confirm_password = req.body.confirm_password;

        if (confirm_password !== password) {
            req.flash('error', 'Password do not match!');
            return this.redirect(res, '/signup');
        }

        if (this.__.isEmpty(email) || this.__.isEmpty(password) 
           || this.__.isEmpty(first_name) || this.__.isEmpty(last_name) 
           || this.__.isEmpty(confirm_password)) {
            req.flash('warning', 'Please fill out all the fields!');
            return this.redirect(res, '/signup');
        }

        this.user.filter({first_name: first_name, last_name: last_name, email: email})
        .then((rows) => {
            if (!rows) {
                becrypt.hash(password, 12)
                    .then(hashed_password => {
                        this.user.create({first_name: first_name, last_name: last_name, email: email, password: hashed_password})
                        .then(result => {
                            if (result) {
                                req.flash('warning', 'Security questions are not provided yet!, please set two security questions!');
                                return this.redirect(res, '/login');
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
                req.flash('error', 'Email is already registered!');
                return this.redirect(res, '/login');
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

    /**
     * @function reset
     * @description Reset on forgot password 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postReset                   = () => this.route('post', '/reset/', {}, async (req, res, next) => {
        const email = req.body.email;
        if (this.__.isEmpty(email)) {
            req.flash('warning', 'Please insert your email!');
        }
        this.user.get({email: email})
        .then(result => {
            if (typeof result !== 'undefined') {
                if (result) {
                    let row = result[0];
                    console.log(row)
                    // TODO: implement reset functionality
                }
            } else {
                return this.redirect(res, '/reset')
            }
        })
        .catch(err => console.log(err));
    });

    /**
     * @function reset
     * @description Reset on forgot password 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getReset                   = () => this.route('get', '/reset/', {}, async (req, res, next) => {
        return this.render(
            res,
            'shop/reset',
            {
                page_title: 'Reset Password',
                path : '/reset/'
            }
        );
    });


    /**
     * @function getSecurityQuestions
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getSecurityQuestions = () => this.route('get', '/security/', {isAuth, userSession}, async (req, res, next) => {
        return this.render(
            res,
            'shop/security',
            {
                page_title: 'Security Questions',
                path : '/security/'
            }
        );
    });


    /**
     * @function postSecurityQuestions
     * @description Lets the user sets security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postSecurityQuestions = () => this.route('post', '/security/', {isAuth, userSession}, async (req, res, next) => {
        
    });


}