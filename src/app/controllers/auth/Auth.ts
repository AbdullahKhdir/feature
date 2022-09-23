'use strict';

import becrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import BaseController from "../../../core/controller/BaseController";
import { decrypt, encrypt } from "../../../core/utils/cryptr";
import userSession from "../../middlewares/init_user_session";
import isAuth from "../../middlewares/is_auth";
import SecurityQuestion from "../../models/shop/SecurityQuestion";
import User from "../../models/shop/User";
import UserSecurityQuestion from "../../models/shop/UserSecurityQuestion";

/**
 * @class Auth
 * @constructor
 * @extends BaseController
 * @description Class Auth to authenticate the users
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Auth extends BaseController {
    
    protected corsOptionsDelegate: any;
    public methods: any;
    protected user: User;
    protected security_questions: SecurityQuestion;
    protected user_security_questions: UserSecurityQuestion;
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
            'postRecoverPassword',
            'getPasswordReset',
            'postPasswordReset'
        ];
        
        this.user = new User();
        this.security_questions      = new SecurityQuestion();
        this.user_security_questions = new UserSecurityQuestion();
        /*
         ? CORS CONFIGURATIONS 
        */
        const whitelist = ['http://example1.com', 'http://example2.com'];
        this.corsOptionsDelegate = function (req: Request, callback: Function) {
            let corsOptions;
            // @ts-ignore 
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
    getAuthenticate           = () => this.route('get', '/login/', this.getAuthLoginMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        res.globalPostFormData();
        
        if (!req.session.is_authenticated) {
            return this.render(
                res,
                'shop/login',
                {
                    nav_title: 'Login',
                    path : '/login/',
                    root : 'account'
                }
            );
        } else {
            return this.redirect(res, '/');
        }
    });

    /**
     * @function postAuthenticate
     * @description Check user's authentication's infos 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postAuthenticate          = () => this.route('post', '/login/', this.validatedLogin(), async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        req.sendFormPostedData();
        const errors = validationResult(req);
        const email           = req.getFormPostedData('email');
        const password        = req.getFormPostedData('password');
        const forgot_password = req.getFormPostedData('password_reset')
        
        if (!this.__.isEmpty(forgot_password)) {
            return this.redirect(res, '/reset');
        }

        if (errors.isEmpty()) {
            this.user.get({email: email})
            .then((rows) => {
                if (typeof rows === 'undefined' || rows == null || this.__.isEmpty(rows) || rows.length === 0) {
                    req.setProp('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                    return this.redirect(res, '/login');
                }
                rows = rows[0];
                if (rows) {
                    becrypt.compare(password, rows.password)
                    .then(do_match => {
                        if (do_match) {
                            if (typeof rows !== 'undefined') {
                                req.session.currentUser = rows;
                                req.session.save((err: any) => {
                                    if (err) {
                                        return this.onError(res, err)
                                    }
                                    if (!res.headersSent) {
                                        req.session.is_authenticated = true;
                                        this.user_security_questions.filter({user_id: req.session.currentUser.id})
                                        // @ts-ignore 
                                        .then((result: any) => {
                                            if (typeof result !== 'undefined') {
                                                if (result) {
                                                    return this.redirect(res, '/');    
                                                }
                                            } else {
                                                req.setProp(
                                                    'warning',
                                                    'You have not submitted any security questions, Please choose and answer two security questions!'
                                                );
                                                return this.redirect(res, '/security');
                                            }
                                        })
                                        .catch((err: any) => this.onError(res, err))
                                    }
                                });
                            }
                        } else {
                            req.setProp('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                            return this.redirect(res, '/login');
                        }
                    })
                    .catch(err => this.onError(res, err))
                } else {
                    req.setProp('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                    return this.redirect(res, '/login');
                }
            })
            .catch((err: any) => this.onError(res, err))
        } else {
            return this.onErrorValidation(res, errors.array())
        }
    });

    /**
     * @function getAuthenticate
     * @description Get authentication user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getSignUp           = () => this.route('get', '/signup/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        if (!req.session.is_authenticated) {
            return this.render(
                res,
                'shop/signup',
                {
                    nav_title: 'Sign up',
                    path : '/signup/',
                    root: 'account'
                }
            );
        } else {
            return this.redirect(res, '/');
        }
    });

    /**
     * @function postSignUp
     * @description Check user's authentication's infos 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postSignUp = () => this.route('post', '/signup/', this.validatedSignUp(), async (req: Request, res: Response, next: NextFunction) => {    
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        req.sendFormPostedData();

        const first_name       = req.getFormPostedData('first_name');
        const last_name        = req.getFormPostedData('last_name');
        const email            = req.getFormPostedData('email');
        const password         = req.getFormPostedData('password');

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.user.filter({first_name: first_name, last_name: last_name, email: email})
            .then((rows) => {
                if (!rows) {
                    becrypt.hash(password, 12)
                        .then(hashed_password => {
                            this.user.create({first_name: first_name, last_name: last_name, email: email, password: hashed_password})
                            .then(result => {
                                if (result) {
                                    req.setProp('warning', 'Security questions are not provided yet!, please set two security questions!');
                                    return this.redirect(res, '/security');
                                }
                            })
                            .catch((err: any) => this.onError(res, err));
                        })
                        .catch(err => this.onError(res, err));
                } else {
                    req.setProp('error', 'Email is already registered!');
                    return this.redirect(res, '/login');
                }
            })
            .catch((err: any) => this.onError(res, err))
        } else {
            return this.onErrorValidation(res, errors.array())
        }
    });

    /**
     * @function logout
     * @description Log user out 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    logout                   = () => this.route('post', '/logout/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        res.onLogOut(req.user_cookie);
        req.session.destroy((err: any) => {
            if (err) {
                return this.onError(res, err);
            }
            return this.redirect(res, '/login');
        });
    });

    /**
     * @function reset
     * @description Reset on forgot password 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postReset                   = () => this.route('post', '/reset/', {}, async (req: Request, res: Response, next: NextFunction) => {   
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        const email = req.getFormPostedData('email');
    
        if (this.__.isEmpty(email)) {
            req.setProp('warning', 'Please insert your email!');
            return this.postToSameSite(res);
        }
        
        this.user.get({email: email})
        // @ts-ignore 
        .then(result => {
            if (typeof result !== 'undefined') {
                if (result) {
                    req.setProp('recover_email', email.toString());
                    req.setProp('warning', 'Please choose and answer the questions that you have submitted in order to recover your email!');
                    return this.redirect(res, '/password_recovery/');
                }
            } else {
                return this.redirect(res, '/reset')
            }
        })
        .catch((err: any) => this.onError(res, err));
    });

    /**
     * @function reset
     * @description Reset on forgot password 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getReset                   = () => this.route('get', '/reset/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (req.isGet()) {
            res.noCacheNeeded();
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
     * @function getRecoverPassword
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getRecoverPassword = () => this.route('get', '/password_recovery/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        let email = req.props()['recover_email'];
        
        if (typeof email === 'undefined') {
            return this.redirect(res, '/reset')   
        }
        email = email[0];

        const params = res.globalPostFormData();

        let first_question: any  = null;
        let second_question: any = null;
        let first_answer: any    = null;
        let second_answer: any   = null;
        
        if (Object.keys(params).length > 0) {
            first_question  = typeof params.security_questions !== 'undefined' ? params.security_questions[0] ? params.security_questions[0] : '' : '';
            second_question = typeof params.security_questions !== 'undefined' ? params.security_questions[1] ? params.security_questions[1] : '' : '';
            first_answer    = params.first_answer  ? params.first_answer  : '';
            second_answer   = params.second_answer ? params.second_answer : '';
        }

        this.security_questions
        .filter()
        // @ts-ignore 
        .then(questions => {
            if (typeof questions !== 'undefined') {
                return questions
            }
        })
        .then((questions: any) => {
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
                    second_answer: second_answer ?? '',
                    email: email
                }
            );
        })
        .catch((err: any) => this.onError(res, err));
    });

    /**
     * @function getRecoverPassword
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postRecoverPassword = () => this.route('post', '/password_recovery/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        
        let email = req.getFormPostedData('email'); 
        
        if (typeof email === 'undefined') {
            return this.redirect(res, '/reset')
        }

        if (typeof req.getFormPostedData('security_questions') !== 'object'
            || this.__.isEmpty(req.getFormPostedData('first_answer')) 
            || this.__.isEmpty(req.getFormPostedData('second_answer'))) {
            req.setProp('warning', 'Please choose and answer the questions that you have submitted in order to recover your email!');
            req.setProp('post_data', req.getAllFormPostedData());
            req.setProp('recover_email', email)
            return this.postToSameSite(res);
        }
        
        const [first_question, second_question] = req.getFormPostedData('security_questions');
        const first_answer                      = req.getFormPostedData('first_answer');
        const second_answer                     = req.getFormPostedData('second_answer');

        this.security_questions
        .filter()
        .then((questions: any) => {
            if (typeof questions !== 'undefined') {
                return questions
            }
        })
        .then((questions: any) => {
            this.user.filter({email: email})
            .then(result => {
                if (result) {
                    result = result[0];
                    this.user_security_questions.filter({user_id: result.id})
                    .then(result => {
                        if (result) {
                            let _first_result = result[0];
                            let _first_answer = decrypt(_first_result.answer);

                            let _second_result = result[1];
                            let _second_answer = decrypt(_second_result.answer);

                            if (_first_answer === first_answer 
                                && _second_answer === second_answer) {
                                req.setProp('password_reset_acces', 'granted');
                                req.setProp('warning', 'Please enter and confirm your new password');
                                req.setProp('email', email);
                                return this.redirect(res, '/password_reset')
                            } else {
                                req.setProp('warning', 'You have choose or answered the wrong question!, please try again or contact us!');
                                req.setProp('post_data', req.getAllFormPostedData());
                                req.setProp('recover_email', email)
                                return this.postToSameSite(res);
                            }
                        } else {
                            return this.redirect(res, '/signup');
                        }
                    })
                    .catch((err: any) => this.onError(res, err));
                } else {
                    return this.redirect(res, '/signup');
                }
            })
            .catch((err: any) => this.onError(res, err));
        })
        .catch((err: any) => this.onError(res, err));
    });

    /**
     * @function getSecurityQuestions
     * @description Lets the user choose security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getSecurityQuestions = () => this.route('get', '/security/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        const params = res.globalPostFormData();
        let first_question: any  = null;
        let second_question: any = null;
        let first_answer: any    = null;
        let second_answer: any   = null;
        
        if (Object.keys(params).length > 0) {
            first_question  = params['security_questions'] ? params.security_questions[0] ? params.security_questions[0] : '' : '';
            second_question = params['security_questions'] ? params.security_questions[1] ? params.security_questions[1] : '' : '';
            first_answer    = params['first_answer'] ? params.first_answer  ? params.first_answer  : '' : '';
            second_answer   = params['second_answer'] ? params.second_answer ? params.second_answer : '' : '';
            this.security_questions
                    .filter()
                    .then(questions => {
                        if (typeof questions !== 'undefined') {
                            return questions
                        }
                    })
                    .then((questions: any) => {
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
                    .catch((err: any) => this.onError(res, err));
        } else {
            this.user_security_questions.filter({user_id: req.getCurrentUser().id})
            .then(result => {
                if (result) {
                    first_question = result[0].question;
                    first_answer   = decrypt(result[0].answer);
                    second_question  = result[1].question;
                    second_answer    = decrypt(result[1].answer);
                    let questions: any = [];
                    this.security_questions
                    .filter()
                    .then((questions: any) => {
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
                    }).catch((err: any) => this.onError(res, err));
                } else {
                    this.security_questions
                    .filter()
                    .then((questions: any) => {
                        if (typeof questions !== 'undefined') {
                            return questions
                        }
                    })
                    .then((questions: any) => {
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
                    .catch((err: any) => this.onError(res, err));
                }
            })
            .catch((err: any) => this.onError(res, err));
        }
    });

    /**
     * @function postSecurityQuestions
     * @description Lets the user sets security questions
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postSecurityQuestions = () => this.route('post', '/security/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        if (typeof req.getFormPostedData('security_questions') !== 'object' 
        || this.__.isEmpty(req.getFormPostedData('first_answer')) 
        || this.__.isEmpty(req.getFormPostedData('second_answer'))) {
            req.setProp('warning', 'Please choose and answer two security questions!');
            // will be triggered through the following function call
            req.sendFormPostedData();
            // req.setProp('post_data', req.getAllFormPostedData());
            return this.redirect(res, '/security');
        }
        
        const [first_question, second_question] = req.getFormPostedData('security_questions');
        const first_answer                      = req.getFormPostedData('first_answer');
        const second_answer                     = req.getFormPostedData('second_answer');

        this.user_security_questions.create({
            user_id: req.getCurrentUser().id,
            question: first_question,
            answer: encrypt(first_answer)
        }).then((result: any) => {
            if (result) {
                this.user_security_questions.create({
                    user_id: req.getCurrentUser().id,
                    question: second_question,
                    answer: encrypt(second_answer)
                    // @ts-ignore 
                }).then((_result: any) => {
                    if (_result) {
                        req.setProp(
                            'Success',
                            'Your account is not secured, you may proceed!'
                        );
                        return this.redirect(res, '/');
                    }
                })
                .catch((err: any) => this.onError(res, err));;
            }
        })
        .catch((err: any) => this.onError(res, err));
    });

    /**
     * @function getPasswordReset
     * @description Allows the user to reset the password
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getPasswordReset           = () => this.route('get', '/password_reset/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        const is_allowed = req.props()['password_reset_acces'];
        const email      = req.props()['email'];

        if (typeof is_allowed === 'undefined' || typeof email === 'undefined') {
            return this.redirect(res, '/reset');
        }
        if (is_allowed[0] !== 'granted') {
            return this.redirect(res, '/reset');
        }

        return this.render(
            res,
            'shop/password_reset',
            {
                page_title: 'Reset Password',
                path : '/password_reset/',
                email: email
            }
        );
    });

    /**
     * @function getPasswordReset
     * @description Allows the user to reset the password
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postPasswordReset           = () => this.route('post', '/password_reset/', {}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        const email = req.getFormPostedData('email');
        
        if (typeof email === 'undefined') {
            return this.redirect(res, '/reset');
        }

        const password         = req.getFormPostedData('password');
        const confirm_password = req.getFormPostedData('confirm_password');

        if (this.__.isEmpty(password) || this.__.isEmpty(confirm_password)) {
            req.setProp('warning', 'Please enter and confirm your password!');
            req.setProp('password_reset_acces', 'granted');
            req.setProp('email', email);
            return this.postToSameSite(res);
        }

        if (confirm_password !== password) {
            req.setProp('error', 'Passwords do not match!');
            req.setProp('password_reset_acces', 'granted');
            req.setProp('email', email);
            return this.postToSameSite(res);
        }

        this.user.filter({email: email})
        // @ts-ignore 
        .then((rows: any) => {
            if (rows) {
                rows = rows[0];
                becrypt.hash(password, 12)
                    .then(hashed_password => {
                        // @ts-ignore 
                        this.user.update({password: hashed_password}, {id: rows.id})
                        // @ts-ignore 
                        .then(result => {
                            if (result) {
                                req.setProp('success', 'Your password has been updated!');
                                return this.redirect(res, '/login');
                            }
                        })
                        .catch((err: any) => this.onError(res, err))
                    })
                    .catch(err => this.onError(res, err))
            }
        })
        .catch((err: any) => this.onError(res, err))
    });

    //**************************************************************************
    //* Process protected functions
    //**************************************************************************

    //******************************\\
    //* Auth middleware            *\\
    //******************************\\
    protected getAuthLoginMiddleware  = () => ({
        cors: this.express.express_cors(this.corsOptionsDelegate)
    })

    //******************************\\
    //* Sign up middleware         *\\
    //******************************\\
    protected validatedSignUp  = () => ({
        validate_first_name:       check('first_name').not().isEmpty().withMessage('Please enter your firstname!').bail(),
        validate_last_name:        check('last_name').not().isEmpty().withMessage('Please enter your lastname!').bail(),
        validate_email:            check('email').isEmail().withMessage('Please enter a valid email!').bail(),
        validate_password:         check('password')
                                   .isStrongPassword(
                                       {
                                           minLength: 8, 
                                           minLowercase: 1, 
                                           minNumbers: 1, 
                                           minUppercase: 1, 
                                           minSymbols: 1
                                        }
                                    )
                                    .withMessage(
                                        `Please enter a password with minimum length of 8
                                        , one lower case character
                                        , one upper case character
                                        , one symbol
                                        and one number`
                                    )
                                    .bail(),
        validate_confirm_password: check('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password confirmation does not match password!');
            }
            return true;
          }).withMessage('Password confirmation does not match password!').bail()
    });

    //******************************\\
    //* Sign in middleware         *\\
    //******************************\\
    protected validatedLogin  = () => ({
        validate_email: check('email').isEmail().withMessage('Please enter a valid email!').bail(),
        validate_password: check('password').not().isEmpty().withMessage('Please enter your password!').bail()
    })
}