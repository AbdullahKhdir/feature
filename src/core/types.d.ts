declare namespace Express {
    export interface Request {
        user:                 any;
        user_cookie:          any;
        props:                Function;
        setProp:              Function;
        getAllFormPostedData: Function,
        getUploadedFiles:     Function,
        getUploadedFile:      Function,
        sendFormPostedData:   Function,
        getFormPostedData:    Function,
        getQueryParams:       Function,
        getQueryParam:        Function,
        getDynamicParams:     Function,
        getDynamicParam:      Function,
        isGet:                Function,
        isPost:               Function,
        isPut:                Function,
        isPatch:              Function,
        isDelete:             Function,
        getCurrentUser:       Function
    }
    export interface Partial {
        is_authenticated
    }
    export interface Response {
        user:                 any;
        setCookie:            Function;
        onLogOut:             Function;
        storeInPrivateCache:  Function;
        longTimeNoCache:      Function;
        updatedContentAlways: Function;
        noCacheNeeded:        Function;
        cacheLastResOnErr:    Function;
        cacheLandingPage:     Function;
        globalPostFormData:   Function,
        globalGetFormData:    Function
    }
    interface String {
        replaceAll(input: string, output : string): any;
    }
  }