
import { NextFunction, Request, Response } from 'express';
import { Singleton } from '../../core/Singleton/Singleton';

const constants = Singleton.getConstants();

/*
* Middleware To check if user has logged in to save the login in data in the session
*/
export = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        if (req.url === '/login') {
            if (typeof req.session.is_authenticated === 'undefined') {
                next();
            } else {
                return res.redirect('/');
            }
        } else if (req.url === '/signup/') {
            if (typeof req.session.is_authenticated === 'undefined') {
                next();
            } else {
                return res.redirect('/');
            }
        } else {
            if (typeof req.session.is_authenticated === 'undefined') {
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            } else {
                next()
            }
        }
    } else {
        if (typeof req.session.is_authenticated === 'undefined') {
            return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
        } else {
            next()
        }
    }
}