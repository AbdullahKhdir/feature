'use strict';

const { server_port, environment } = require('../../core/config');

/**
 * @class Constants
 * @constructor
 * @description Class Constants is defining all the constants for the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Constants {
    
    #constants;
    constructor(constants = []){
        constants = {
            ROUTES: {
                ADMIN: '/admin',
                SHOP: '/',
                DEFAULT: '/'
            },
            PORTS: {
                SERVER_PORT: server_port || 8010
            },
            HTTPS_STATUS: {
                /*
                 ? An informational response indicates that the request was received and understood.
                 ? It is issued on a provisional basis while request processing continues. 
                 ? It alerts the client to wait for a final response.
                 ? The message consists only of the status line and optional header fields, and is terminated by an empty line. 
                 */
                INFORMATIONAL_RESPONSE:{
                    CONTINUE:            100,
                    SWITCHING_PROTOCOLS: 101,
                    PROCESSING:          102,
                    EARLY_HINTS:         103
                },
                /*
                 ? This class of status codes indicates the action requested by the client was received, understood, and accepted 
                 */
                SUCCESS: {
                    OK:                            200,
                    CREATED:                       201,
                    ACCEPTED:                      202,
                    NON_AUTHORITATIVE_INFORMATION: 203,
                    NO_CONTENT:                    204,
                    RESET_CONTENT:                 205,
                    PARTIAL_CONTENT:               206,
                    MULTI_STATUS:                  207,
                    ALREADY_REPORTED:              208,
                    IM_Used:                       226,
                },
                /*
                 ? This class of status code indicates the client must take additional action to complete the request. 
                 ? Many of these status codes are used in URL redirection 
                 */
                REDIRECTION: {
                    MULTIPLE_CHOICES:   300,
                    MOVED_PERMANENTLY:  301,
                    FOUND:              302,
                    SEE_OTHER:          303,
                    NOT_MODIFIED:       304,
                    USE_PROXY:          305,
                    SWITCH_PROXY:       306,
                    TEMPORARY_REDIRECT: 307,
                    PERMANENT_REDIRECT: 308
                },
                CLIENT_ERRORS: {
                    BAD_REQUEST:                   400, 
                    UNAUTHORIZED:                  401,
                    PAYMENT_REQUIRED:              402,
                    FORBIDDEN:                     403,
                    SITE_NOT_FOUND:                404,
                    METHOD_NOT_ALLOWED:            405,
                    NOT_ACCEPTABLE:                406,
                    PROXY_AUTHENTICATION_REQUIRED: 407,
                    REQUEST_TIMEOUT:               408,
                    CONFLICT:                      409,
                    GONE:                          410,
                    LENGTH_REQUIRED:               411,
                    PRECONDITION_FAILED:           412,
                    PAYLOAD_TOO_LARGE:             413,
                    URI_TOO_LONG:                  414,
                    UNSUPPORTED_MEDIA_TYPE:        415,
                    RANGE_NOT_SATISFIABLE:         416,
                    EXPECTATION_FAILED:            417,
                    /*
                     ! his code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol,
                     ! and is not expected to be implemented by actual HTTP servers. 
                     ! The RFC specifies this code should be returned by teapots requested to brew coffee.
                     ! This HTTP status is used as an Easter egg in some websites, such as Google.com's "I'm a teapot" easter egg
                     */
                    IM_A_TEAPOT:                     418,
                    MISDIRECTED_REQUEST:             421,
                    UNPROCESSABLE_ENTITY:            422,
                    LOCKED:                          423,
                    FAILED_DEPENDENCY:               424,
                    TOO_EARLY:                       425,
                    UPGRADE_REQUIRED:                426,
                    PRECONDITION_REQUIRED:           428,
                    TOO_MANY_REQUESTS:               429,
                    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
                    UNAVAILABLE_FOR_LEGAL_REASONS:   451
                },
                /*
                ! The server failed to fulfil a request
                */
                SERVER_ERRORS: {
                    INTERNAL_SERVER_ERROR:           500,
                    NOT_IMPLEMENTED:                 501,
                    BAD_GATEWAY:                     502,
                    SERVICE_UNAVAILABLE:             503,
                    GATEWAY_TIMEOUT:                 504,
                    HTTP_VERSION_NOT_SUPPORTED:      505,
                    VARIANT_ALSO_NEGOTIATES:         506,
                    INSUFFICIENT_STORAGE:            507,
                    LOOP_DETECTED:                   508,
                    NOT_EXTENDED:                    510,
                    NETWORK_AUTHENTICATION_REQUIRED: 511
                },
                UNOFFICIAL_CODES: {
                    PAGE_EXPIRED:                         419, //Laravel Framework
                    METHOD_FAILURE:                       420, //Spring Framework
                    ENHANCE_YOUR_CALM:                    420, //TWitter
                    REQUEST_HEADER_FIELDS_TOO_LARGE:      430, //Shopify
                    BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS: 450, //Microsoft
                    INVALID_TOKEN:                        498,
                    TOKEN_REQUIRED:                       499,
                    BANDWIDTH_LIMIT_EXCEEDED:             509,
                    SITE_IS_OVERLOADED:                   529,
                    SITE_IS_FROZEN:                       530,
                    NETWORK_READ_TIMEOUT_ERROR:           598,
                    NETWORK_CONNECT_TIMEOUT_ERROR:        599,

                },
                /*
                 ! Microsoft's Internet Information Services (IIS) web server expands the 4xx error space to signal errors with the client's request.
                 */
                INTERNET_INFORMATION_SERVICES: {
                    LOGIN_TIME_OUT: 440,
                    RETRY_WITH:     449,
                    REDIRECT:       451,
                    /*
                     ! The nginx web server software expands the 4xx error space to signal issues with the client's request.
                     */
                    NGINX: {
                        NO_RESPONSE:                     444,
                        REQUEST_HEADER_TOO_LARGE:        494,
                        SSL_CERTIFICATE_ERROR:           495,
                        SSL_CERTIFICATE_REQUIRED:        496,
                        HTTP_REQUEST_SENT_TO_HTTPS_PORT: 497,
                        CLIENT_CLOSED_REQUEST:           499,
                    },
                    /*
                     ! Cloudflare's reverse proxy service expands the 5xx series of errors space to signal issues with the origin server. 
                     */
                    CLOUDFLARE: {
                        WEB_SERVER_RETURNED_AN_UNKNOWN_ERROR: 520,
                        WEB_SERVER_IS_DOWN:                   521,
                        CONNECTION_TIMED_OUT:                 522,
                        ORIGIN_IS_UNREACHABLE:                523,
                        A_TIMEOUT_OCCURRED:                   524,
                        SSL_HANDSHAKE_FAILED:                 525,
                        INVALID_SSL_CERTIFICATE:              526,
                        RAILGUN_ERROR:                        527,
                    },
                    /*
                     ! Amazon's Elastic Load Balancing adds a few custom return codes. 
                     */
                    AWS_ELASTIC_LOAD_BALANCER: {
                        UNAUTHORIZED: 561
                    }
                },
                /*
                 ! The following caching related warning codes are specified under RFC 7234.
                 ! Unlike the other status codes above, these are not sent as the response status in the HTTP protocol, but as part of the "Warning" HTTP header.
                 ! Since this header is often neither sent by servers nor acknowledged by clients, it was obsoleted by the HTTP Working Group with RFC 9111. 
                 */
                CACHING_WARNING_CODES: {
                    RESPONSE_IS_STALE:                110,
                    REVALIDATION_FAILED:              111,
                    DISCONNECTED_OPERATION:           112,
                    HEURISTIC_EXPIRATION:             113,
                    MISCELLANEOUS_WARNING:            199,
                    TRANSFORMATION_APPLIED:           214,
                    MISCELLANEOUS_PERSISTENT_WARNING: 299
                }
            },
            RESPONSE: {
                TYPES: {
                    HTML:         'html',
                    JSON:         'application/json',
                    TEXT:         'text/plain',
                    TEXT_XML:     'text/xml',
                    XML:          'xml',
                    APP_XML:      'application/xml',
                    TEXT_HTML:    'text/html',
                    PNG:          'png',
                    JPEG:         'jpeg',
                    JPG:          'jpg',
                    JPE:          'jpe',
                    JIF:          'jif',
                    JFIF:         'jfif',
                    JFI:          'jfi',
                    SVG:          'svg',
                    SVGZ:         'svgz',
                    GIF:          'gif',
                    WEBP:         'webp',
                    TIFF:         'tiff',
                    TIF:          'tif',
                    PSD:          'psd',
                    RAW:          'raw',
                    ARW:          'arw',
                    CR2:          'cr2',
                    NRW:          'nrw',
                    K25:          'k25',
                    BMP:          'bmp',
                    DIB:          'dib',
                    HEIF:         'heif',
                    HEIC:         'heic',
                    INDD:         'indd',
                    IND:          'ind',
                    INDT:         'indt',
                    JPEG_2000:    'jp2',
                    JPEG_2000_K:  'j2k',
                    JPEG_2000_PF: 'jpf',
                    JPEG_2000_PX: 'jpx',
                    JPEG_2000_PM: 'jpm',
                    JPEG_2000_MJ: 'mj2',
                    AI:           'ai',
                    EPS:          'eps',
                    PDF:          'pdf'
                }
            },
            SESSION: {
                DB_CONNECTION_SESSION_TIME_OUT:                   environment === 'production' ? 1000 * 60 * 60 * 1 : 1000 * 60 * 60 * 6, //? Every six hours (4 times a day)
                DB_CONNECTION_SESSION_EXPIRATION_INTERVAL:        environment === 'production' ? 1000 * 60 * 60 * 1 : 1000 * 60 * 60 * 6,  //? Every six hours (4 times a day)
                DB_CONNECTION_SESSION_CLEAR_EXPIRED:              true,
                DB_CONNECTION_CREATE_SESSION_TABLE_IF_NOT_EXISTS: environment === 'production' ? false : true ,
                DB_SESSION_MAX_CONNECTIONS:                       environment === 'production' ? 10 : 1,
                DB_SESSION_END_CONNECTION_ON_CLOSE:               true,
                DB_CONNECTION_SESSION_CHARSET:                    'utf8mb4_bin',
                DB_SESSION_TABLE:                                 'sessions',
                DB_CONNECTION_SESSION_ID:                         'session_id',
                DB_CONNECTION_SESSION_EXPIRATION:                 'expires',
                DB_CONNECTION_SESSION_DATA:                       'data'
            },
            NPM: 'NPM',
            PM2: 'PM2'
        }
        this.#constants = Object.assign(constants);
    }
    
    /**
     * @function getConstants
     * @description Gets a list of all constants
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns array
    */
    getConstants()
    {
        return this.#constants;
    }

    /**
     * @function addOneConstant
     * @description adds only one key value pair constant
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string, int} key 
     * @param {string, int, boolean} value
     * @returns array|object
    */
    addOneConstant(key, value)
    {
        return this.#constants[key] = value;
    }

    /**
     * @function addObjectConstant
     * @description Appends to the constant object the passed object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {object} object
     * @returns array|object
    */
    addObjectConstant(...object)
    {
        return this.#constants = Object.assign(this.#constants, ...object);
    }

    /**
     * @function clearConstants
     * @description clears all the constants and returns true or false
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns boolean
    */
    clearConstants()
    {
        this.#constants = {};
        return !this.#constants;
    }
}