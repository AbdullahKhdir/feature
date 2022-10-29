
import { Request } from "express"

type options = {
    nav_title?:          string;
    path?:               string;
    is_authenticated?:   boolean | null;
    error?:              string | [] | null;
    warning?:            string | [] | null;
    success?:            string | [] | null;
    status_code?:        number;
    status_title?:       string;
    status_description?: string;
    url?:                string;
    label?:              string;
};

const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

export function csrf(req: Request, object: options = {}) {
    let _object = {
        nav_title: capitalize(req.method) + ' request was interrupted!', 
        path: '/404/',
        is_authenticated: null,
        error:   'Invalid CSRF token',
        warning: 'Please do not alter or delete the csrf token!',
        success: null,
        status_code: 403,
        status_title: 'Invalid CSRF token',
        status_description: 'Please do not alter or delete the csrf token!',
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}

export function siteNotFound(req: Request, object: options = {}) {
    let _object = {
        nav_title: '', 
        path: '/404/',
        is_authenticated: null,
        error:   null,
        warning: null,
        success: null,
        status_code: 404,
        status_title: "UH OH! You're lost.",
        status_description: `The page you are looking for does not exist.
        How you got here is a mystery. But you can click the button below
        to go back to the homepage.`,
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}

export function exception(req: Request, object: options = {}) {
    let _object = {
        nav_title: '', 
        path: '/404/',
        is_authenticated: false,
        error:   null,
        warning: null,
        success: null,
        status_code: 500,
        status_title: "UH OH! Exception is thrown.",
        status_description: `This message will only be seen from the developers.`,
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}

export function error(req: Request, object: options = {}) {
    let _object = {
        nav_title: '', 
        path: '/404/',
        is_authenticated: false,
        error:   null,
        warning: null,
        success: null,
        status_code: 500,
        status_title: "UH OH! Unexpected error has ocurred.",
        status_description: `Please contact the support team.`,
        url: '/',
        label: 'Home'
    };
    return Object.assign(_object, object);
}
