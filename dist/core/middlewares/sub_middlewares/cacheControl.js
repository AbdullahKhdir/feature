"use strict";
module.exports = function (request, response, next) {
    if (request.method == "GET") {
        if (typeof request.session !== "undefined") {
            if (typeof request.session.isUserAuthenticated !== "undefined") {
                if (request.session.isUserAuthenticated === true) {
                    //! The content language offers three languages            !\\
                    //? PRIVATE:  ?\\
                    //? Store and reuse personalized content for a single user ?\\
                    //? NO-CACHE: ?\\
                    //? Only store in cache on validation     ?\\
                    //? with origin server before each usage  ?\\
                    //? MUST-REVALIDATE: ?\\
                    //? Cache can be stored if it only ?\\
                    //? still valid and not expired    ?\\
                    response.set("Cache-Control", "private, no-cache, must-revalidate");
                    return next();
                }
            }
        }
        //? PUBLIC    ?\\
        //? Store in a shared cache ?\\
        response.set("Cache-Control", "public, no-cache, must-revalidate");
    }
    else {
        //? NO-STORE ?\\
        //? Ask for stored cache ?\\
        response.set("Cache-Control", "no-store");
    }
    //! The content language offers three languages !\\
    response.set("Content-Language", "en, de, ar");
    //! The origin is "privacy sensitive" !\\
    response.set("Origin", "null");
    return next();
};
