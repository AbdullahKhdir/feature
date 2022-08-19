const Constants       = require('../utils/Constants.js');
module.exports = (req, res, next) => {
    const constants = Object.assign(new Constants().getConstants())
    res.globalPostFormData   = () => res.locals.post_data ? res.locals.post_data[0] : {};
    res.globalGetFormData    = () => res.locals.get_data  ? res.locals.get_data[0]  : {};
    
    req.getAllFormPostedData = () => req.body ? req.body : {};
    req.getFormPostedData    = (param) => req.body ? req.body[param] ? req.body[param] : {} : {};
    req.getQueryParams       = () => res.query ? res.query : {};
    req.getQueryParam        = (param) => req.query ? req.query[param] ? req.query[param] : {} : {};
    req.getDynamicParams     = () => req.params ? req.params : {};
    req.getDynamicParam      = (param) => req.params ? req.params[param] ? req.params[param] : {} : {};

    req.isGet                = () => req.method === constants.REQUEST.TYPE.GET;
    req.isPost               = () => req.method === constants.REQUEST.TYPE.POST;
    req.isPut                = () => req.method === constants.REQUEST.TYPE.PUT;
    req.isPatch              = () => req.method === constants.REQUEST.TYPE.PATCH;
    req.isDelete             = () => req.method === constants.REQUEST.TYPE.DELETE;
    req.getCurrentUser = () => {
        if (res.req.session.is_authenticated) {
            return req.session.currentUser;   
        }
        return null;
    }
}