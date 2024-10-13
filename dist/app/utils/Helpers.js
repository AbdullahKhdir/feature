"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validURL = exports.validatePhoneNumber = exports.validateDomain = exports.validateEmail = exports.get_class = exports._inArray = exports.shuffleArray = exports.getUnique = exports.scrollToBottom = exports.scrollToTop = exports.isDarkMode = void 0;
/**
 * @function isDarkMode
 * @description Identify if the browser is in dark mode or not
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @returns boolean
 */
var isDarkMode = function () { return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; };
exports.isDarkMode = isDarkMode;
/**
 * @function scrollToTop
 * @description Scrolls to the top of the page
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Object dom_element
 * @returns void
 */
var scrollToTop = function (dom_element) { return dom_element.scrollIntoView({ behavior: "smooth", block: "start" }); };
exports.scrollToTop = scrollToTop;
/**
 * @function scrollToBottom
 * @description Scrolls to the bottom of the page
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Object dom_element
 * @returns void
 */
var scrollToBottom = function (dom_element) { return dom_element.scrollIntoView({ behavior: "smooth", block: "end" }); };
exports.scrollToBottom = scrollToBottom;
/**
 * @function getUnique
 * @description Removes all duplicates from an array
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Array arr
 * @returns array
 */
// @ts-ignore
var getUnique = function (arr) { return __spreadArray([], new Set(arr), true); };
exports.getUnique = getUnique;
/**
 * @function getConstants
 * @description Shuffles the values of an array
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Array arr
 * @returns array
 */
var shuffleArray = function (arr) { return arr.sort(function () { return Math.random() - 0.5; }); };
exports.shuffleArray = shuffleArray;
var _inArray = function (needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle)
            return true;
    }
    return false;
};
exports._inArray = _inArray;
var get_class = function (obj) {
    function get_class(obj) {
        return "".concat(obj).replace(/^.*function\s+([^\s]*|[^\(]*)\([^\x00]+$/, "$1") || "anonymous";
    }
    var result = "";
    if (obj === null) {
        result = "null";
    }
    else if (obj === undefined) {
        result = "undefined";
    }
    else {
        result = get_class(obj.constructor);
        if (result === "Object" && obj.constructor.prototype) {
            // @ts-ignore
            for (result in _this) {
                // @ts-ignore
                if (typeof _this[result] === "function" && obj instanceof _this[result]) {
                    // @ts-ignore
                    result = get_class(_this[result]);
                    break;
                }
            }
        }
    }
    return result;
};
exports.get_class = get_class;
var validateEmail = function (email, type) {
    if (type === void 0) { type = ""; }
    if (type === "list") {
        for (var key in email) {
            var check = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email[key]);
            if (!check) {
                return false;
            }
        }
    }
    else {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
    return true;
};
exports.validateEmail = validateEmail;
var validateDomain = function (domain) {
    return /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/.test(domain);
};
exports.validateDomain = validateDomain;
var validatePhoneNumber = function (number) {
    return /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(number);
};
exports.validatePhoneNumber = validatePhoneNumber;
var validURL = function (str) {
    var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
    return !!pattern.test(str);
};
exports.validURL = validURL;
