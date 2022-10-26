import { NextFunction, Request, Response } from 'express';

export = (req: Request, res: Response, next: NextFunction) => {
    if (req.method == 'GET') {
        if (typeof req.session !== 'undefined') {
            if (typeof req.session.is_authenticated !== 'undefined') {
                if (req.session.is_authenticated === true) {
                    //! The content language offers three languages            !\\
                    //? PRIVATE:  ?\\
                    //? Store and reuse personalized content for a single user ?\\
                    //? NO-CACHE: ?\\
                    //? Only store in cache on validation     ?\\
                    //? with origin server before each usage  ?\\
                    //? MUST-REVALIDATE: ?\\
                    //? Cache can be stored if it only ?\\
                    //? still valid and not expired    ?\\
                    res.set('Cache-Control', 'private, no-cache, must-revalidate');
                    return next();
                }
            }
        }
        //? PUBLIC    ?\\
        //? Store in a shared cache ?\\
        res.set('Cache-Control', 'public, no-cache, must-revalidate');
    } else {
        //? NO-STORE ?\\
        //? Ask for stored cache ?\\
        res.set('Cache-Control', 'no-store');
    }
    //! The content language offers three languages !\\
    res.set('Content-Language', 'en, de, ar');

    //! The origin is "privacy sensitive" !\\
    res.set('Origin', 'null');
    next();
}