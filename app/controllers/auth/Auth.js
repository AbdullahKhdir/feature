'use strict';

const BaseController = require("../../../core/controller/BaseController");
const User           = require("../../models/shop/User");
const becrypt        = require('bcryptjs');
const Lodash         = require("../../utils/Lodash");
const isAuth          = require("../../middlewares/is_auth");
const userSession     = require("../../middlewares/init_user_session");
const SecurityQuestion     = require("../../models/shop/SecurityQuestion");
const UserSecurityQuestion = require("../../models/shop/UserSecurityQuestion");
const { encrypt, decrypt } = require("../../../core/utils/cryptr");

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
            'postSecurityQuestions',
            'getRecoverPassword',
            'postRecoverPassword'
        ];
        this.__   = new Lodash().__;
        this.user = new User();
        this.security_questions      = new SecurityQuestion();
        this.user_security_questions = new UserSecurityQuestion();
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
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }

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
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        
        const email           = req.getFormPostedData('email');
        const password        = req.getFormPostedData('password');
        const forgot_password = req.getFormPostedData('forgot_password')
        
        if (this.__.isEmpty(email) || this.__.isEmpty(password)) {
            req.flash('warning', 'Email and password must not be empty!');
            return this.redirect(res, '/login');
        }

        this.user.get({email: email})
        .then((rows) => {
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
                                    this.user_security_questions.filter({user_id: req.session.currentUser.id})
                                    .then(result => {
                                        if (typeof result !== 'undefined') {
                                            if (result) {
                                                return this.redirect(res, '/');    
                                            }
                                        } else {
                                            req.flash(
                                                'warning',
                                                'You have not submitted any security questions, Please choose and answer two security questions!'
                                            );
                                            return this.redirect(res, '/security');
                                        }
                                    })
                                    .catch();
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
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }

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
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        const first_name       = req.getFormPostedData('first_name');
        const last_name        = req.getFormPostedData('last_name');
        const email            = req.getFormPostedData('email');
        const password         = req.getFormPostedData('password');
        const confirm_password = req.getFormPostedData('confirm_password');

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
                                return this.redirect(res, '/security');
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
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
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
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        const email = req.getFormPostedData('email');
        
        if (this.__.isEmpty(email)) {
            req.flash('warning', 'Please insert your email!');
        }
        
        this.user.get({email: email})
        .then(result => {
            if (typeof result !== 'undefined') {
                if (result) {
                    req.flash('recover_email', email.toString());
                    req.flash('warning', 'Please choose and answer the questions that you have submitted in order to recover your email!')
                    return this.redirect(res, '/password_recovery/');
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
        if (req.isGet()) {
            return this.render(
                res,
                'shop/reset',
                {
                    page_title: 'Reset Password',
                    path : '/reset/'
                }
            );
        }
        return this.siteNotFound(res);
    });


    /**
     * @function getSecurityQuestions
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getSecurityQuestions = () => this.route('get', '/security/', {isAuth, userSession}, async (req, res, next) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        const params = res.globalPostFormData();
        let first_question  = null;
        let second_question = null;
        let first_answer    = null;
        let second_answer   = null;
        if (Object.keys(params).length > 0) {
            first_question  = params.security_questions[0] ? params.security_questions[0] : '';
            second_question = params.security_questions[1] ? params.security_questions[1] : '';
            first_answer    = params.first_answer  ? params.first_answer  : '';
            second_answer   = params.second_answer ? params.second_answer : '';
            this.security_questions
                    .filter()
                    .then(questions => {
                        if (typeof questions !== 'undefined') {
                            return questions
                        }
                    })
                    .then(questions => {
                        return this.render(
                            res,
                            'shop/security',
                            {
                                page_title: 'Security Questions',
                                path : '/security/',
                                questions,
                                first_question: first_question      ? questions[first_question - 1].question  : '',
                                first_question_id: first_question   ? questions[first_question - 1].id        : '',
                                second_question: second_question    ? questions[second_question - 1].question : '',
                                second_question_id: second_question ? questions[second_question - 1].id       : '',
                                first_answer: first_answer ?? '',
                                second_answer: second_answer ?? ''
                            }
                        );
                    })
                    .catch(err => console.log(err));
        } else {
            this.user_security_questions.filter({user_id: req.getCurrentUser().id})
            .then(result => {
                if (result) {
                    first_question = result[0].question;
                    first_answer   = decrypt(result[0].answer);
                    second_question  = result[1].question;
                    second_answer    = decrypt(result[1].answer);
                    let questions = [];
                    this.security_questions
                    .filter()
                    .then(questions => {
                        if (typeof questions !== 'undefined') {
                            return this.render(
                                res,
                                'shop/security',
                                {
                                    page_title: 'Security Questions',
                                    path : '/security/',
                                    questions,
                                    first_question: first_question      ? questions[first_question - 1].question  : '',
                                    first_question_id: first_question   ? questions[first_question - 1].id : '',
                                    second_question: second_question    ? questions[second_question - 1].question : '',
                                    second_question_id: second_question ? questions[second_question - 1].id       : '',
                                    first_answer: first_answer ?? '',
                                    second_answer: second_answer ?? ''
                                }
                            );
                        }
                    }).catch(err => console.log(err));
                } else {
                    this.security_questions
                    .filter()
                    .then(questions => {
                        if (typeof questions !== 'undefined') {
                            return questions
                        }
                    })
                    .then(questions => {
                        return this.render(
                            res,
                            'shop/security',
                            {
                                page_title: 'Security Questions',
                                path : '/security/',
                                questions,
                                first_question: first_question      ? questions[first_question - 1].question  : '',
                                first_question_id: first_question   ? questions[first_question - 1].id        : '',
                                second_question: second_question    ? questions[second_question - 1].question : '',
                                second_question_id: second_question ? questions[second_question - 1].id       : '',
                                first_answer: first_answer ?? '',
                                second_answer: second_answer ?? ''
                            }
                        );
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    });


    /**
     * @function postSecurityQuestions
     * @description Lets the user sets security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postSecurityQuestions = () => this.route('post', '/security/', {isAuth, userSession}, async (req, res, next) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        
        if (typeof req.getFormPostedData('security_questions') !== 'object' 
           || this.__.isEmpty(req.getFormPostedData('first_answer')) 
           || this.__.isEmpty(req.getFormPostedData('second_answer'))) {
            req.flash('warning', 'Please choose and answer two security questions!');
            req.flash('post_data', req.getAllFormPostedData());
            return this.redirect(res, '/security');
        }
        
        const [first_question, second_question] = req.getFormPostedData('security_questions');
        const first_answer                      = req.getFormPostedData('first_answer');
        const second_answer                     = req.getFormPostedData('second_answer');

        this.user_security_questions.create({
            user_id: req.getCurrentUser().id,
            question: first_question,
            answer: encrypt(first_answer)
        }).then(result => {
            if (result) {
                this.user_security_questions.create({
                    user_id: req.getCurrentUser().id,
                    question: second_question,
                    answer: encrypt(second_answer)
                }).then(_result => {
                    if (_result) {
                        req.flash(
                            'Success',
                            'Your account is not secured, you may proceed!'
                        );
                        return this.redirect(res, '/');
                    }
                });
            }
        });
    });

    /**
     * @function getRecoverPassword
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getRecoverPassword = () => this.route('get', '/password_recovery/', {}, async (req, res, next) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }

        let email = req.props()['recover_email'];
        
        if (typeof email === 'undefined') {
            return this.redirect(res, '/reset')   
        }
        email = email[0];
        req.setProp('email_to_recover', email);
        
        const params = res.globalPostFormData();
        let first_question  = null;
        let second_question = null;
        let first_answer    = null;
        let second_answer   = null;

        if (Object.keys(params).length > 0) {
            first_question  = params.security_questions[0] ? params.security_questions[0] : '';
            second_question = params.security_questions[1] ? params.security_questions[1] : '';
            first_answer    = params.first_answer  ? params.first_answer  : '';
            second_answer   = params.second_answer ? params.second_answer : '';
        }

        this.security_questions
        .filter()
        .then(questions => {
            if (typeof questions !== 'undefined') {
                return questions
            }
        })
        .then(questions => {
            return this.render(
                res,
                'shop/password_recovery',
                {
                    page_title: 'Security Questions',
                    path : '/security/',
                    questions,
                    first_question: first_question      ? questions[first_question - 1].question  : '',
                    first_question_id: first_question   ? questions[first_question - 1].id        : '',
                    second_question: second_question    ? questions[second_question - 1].question : '',
                    second_question_id: second_question ? questions[second_question - 1].id       : '',
                    first_answer: first_answer ?? '',
                    second_answer: second_answer ?? ''
                }
            );
        })
        .catch(err => console.log(err));
    });


    /**
     * @function getRecoverPassword
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postRecoverPassword = () => this.route('post', '/password_recovery/', {}, async (req, res, next) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        
        let email = req.props()['email_to_recover'];
        
        if (typeof email === 'undefined') {
            return this.redirect(res, '/reset')   
        }

        email = email[0];

        if (typeof req.getFormPostedData('security_questions') !== 'object' 
            || this.__.isEmpty(req.getFormPostedData('first_answer')) 
            || this.__.isEmpty(req.getFormPostedData('second_answer'))) {
            req.setProp('warning', 'Please choose and answer the questions that you have submitted in order to recover your email!');
            req.setProp('post_data', req.getAllFormPostedData());
            req.setProp('recover_email', email)
            return this.toSameSite(res, this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY);
        }
        
        const [first_question, second_question] = req.getFormPostedData('security_questions');
        const first_answer                      = req.getFormPostedData('first_answer');
        const second_answer                     = req.getFormPostedData('second_answer');

        this.security_questions
        .filter()
        .then(questions => {
            if (typeof questions !== 'undefined') {
                return questions
            }
        })
        .then(questions => {
            this.user.filter({email: email})
            .then(result => {
                if (result) {
                    result = result[0];
                    this.user_security_questions.filter({user_id: result.id})
                    .then(result => {
                        if (result) {
                            result = result[0];
                            let _first_answer = decrypt(result.answer);
                            
                            result = result[1];
                            let _second_answer = decrypt(result.answer);

                            if (_first_answer === first_answer 
                                && _second_answer === second_answer) {
                                req.setProp('new_password', 'Please enter your new password');
                                // TODO: create password_reset get and post route 
                                return this.redirect(res, '/password_reset')
                            } else {
                                req.setProp('warning', 'You habe choose or answered the wrong question!, please try again or contact us!');
                                req.setProp('post_data', req.getAllFormPostedData());
                                req.setProp('recover_email', email)
                                return this.toSameSite(res, this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY);
                            }
                        } else {
                            return this.redirect(res, '/signup');
                        }
                    })
                    .catch(err => console.log(err));
                } else {
                    return this.redirect(res, '/signup');
                }
            })
            .catch(err => consol.log(err));
        })
        .catch(err => console.log(err));
    });
}