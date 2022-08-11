const Constants = require('../utils/Constants');
const Lodash = require('../utils/Lodash');
const constants = Object.assign(new Constants().getConstants());
const __        = new Lodash().__;

/*
* Middleware To check if user has logged in to save the login in data in the session
*/
module.exports = (req, res, next) => {
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