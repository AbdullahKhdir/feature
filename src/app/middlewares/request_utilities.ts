import { NextFunction, Request, Response } from 'express';
import { Singleton } from '../../core/Singleton/Singleton';

export function reqUtil(req: Request, res: Response, next: NextFunction) {
    const constants = Singleton.getConstants();
    
    res.globalPostFormData   = () => res.locals['post_data'] ? res.locals['post_data'][0] : '';
    res.globalGetFormData    = () => res.locals['get_data']  ? res.locals['get_data'][0]  : '';
    
    req.getAllFormPostedData = () => req.body ? req.body : '';
    req.getFormPostedData    = (param: string) => req.body ? req.body[param] ? req.body[param].toString() : '' : '';
    req.getQueryParams       = () => req.query ? req.query : '';
    req.getQueryParam        = (param: string) => req.query ? req.query[param] ? req.query[param] : '' : '';
    req.getDynamicParams     = () => req.params ? req.params : '';
    req.getDynamicParam      = (param: string) => req.params ? req.params[param] ? req.params[param] : '' : '';

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