/**
 * @function isDarkMode
 * @description Identify if the browser is in dark mode or not
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @returns boolean
*/
export const isDarkMode     = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * @function scrollToTop
 * @description Scrolls to the top of the page
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Object dom_element
 * @returns void
*/
export const scrollToTop    = (dom_element: any) => dom_element.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * @function scrollToBottom
 * @description Scrolls to the bottom of the page
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Object dom_element
 * @returns void
*/
export const scrollToBottom = (dom_element: any) => dom_element.scrollIntoView({ behavior: "smooth", block: "end" });

/**
 * @function getUnique
 * @description Removes all duplicates from an array
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Array arr
 * @returns array
*/
// @ts-ignore 
export const getUnique      = (arr: any) => [...new Set(arr)];

/**
 * @function getConstants
 * @description Shuffles the values of an array
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Array arr
 * @returns array
*/
export const shuffleArray        = (arr: any) => arr.sort(() => Math.random() - 0.5);

export const _inArray            = (needle: any, haystack: any) => {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

export const get_class           = (obj: any) => {
    function get_class(obj: any){
        return "".concat(obj).replace(/^.*function\s+([^\s]*|[^\(]*)\([^\x00]+$/, "$1") || "anonymous";
    };
    var result = "";
    
    if (obj === null) {
        result = "null";
    } else if(obj === undefined) {
        result = "undefined";
    } else {
        result = get_class(obj.constructor);
        if (result === "Object" && obj.constructor.prototype) {
            // @ts-ignore 
            for (result in this) {
                // @ts-ignore 
                if (typeof(this[result]) === "function" && obj instanceof this[result]) {
                    // @ts-ignore 
                    result = get_class(this[result]);
                    break;
                }
            }
        }
    };
    return result;
};

export const is_a                = (obj: any, className: any) => {
    className = className.replace(/[^\w\$_]+/, "");
    // @ts-ignore 
    return  get_class(obj) === className && {function:1}[eval("typeof(".concat(className,")"))] && obj instanceof eval(className);
};

export const validateEmail       = (email: any, type = '') => {
    if (type === 'list') {
        for (const key in email) {
            let check =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        .test(email[key])
            if (!check) {
                return false
            }
        }
    } else {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(email)
    }
    return true;
};

export const validateDomain      = (domain: any) => {
    return /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/
    .test(domain)
}

export const validatePhoneNumber = (number: any) => {
    return /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    .test(number)            
}

export const validURL            = (str: any) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}