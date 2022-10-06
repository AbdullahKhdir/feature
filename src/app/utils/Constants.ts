'use strict';

import * as config from '../../core/config';

/**
 * @class Constants
 * @constructor
 * @description Class Constants is defining all the constants for the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Constants {
    
    private static constants_instance : Constants; 
    protected constants;
    private constructor() {
        this.constants = {
            ROUTES: {
                ADMIN: '/admin',
                SHOP: '/',
                DEFAULT: '/'
            },
            PORTS: {
                SERVER_PORT: config.configurations().server_port || 8010
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
                    APP_ATOM_XML: 'application/atom+xml',
                    EPUP:         'application/epub+zip',
                    GZIP:         'application/gzip',
                    JSON:         'application/json',
                    JAR:          'application/java-archive',
                    JSONLD:       'application/ld+json',
                    DOC:          'application/msword',
                    BIN:          'application/octet-stream',
                    OGX:          'application/ogg',
                    PDF:          'application/pdf',
                    RTF:          'application/rtf',
                    AZW:          'application/vnd.amazon.ebook',
                    MPKG:         'application/vnd.apple.installer+xml',
                    DOCX:         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    EOT:          'application/vnd.ms-fontobject',
                    PPT:          'application/vnd.ms-powerpoint',
                    XLS:          'application/vnd.ms-excel',
                    XUL:          'application/vnd.mozilla.xul+xml',
                    ODP:          'application/vnd.oasis.opendocument.presentation',
                    ODS:          'application/vnd.oasis.opendocument.spreadsheet',
                    ODT:          'application/vnd.oasis.opendocument.text',
                    XLSX:         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    PPTX:         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    RAR:          'application/vnd.rar',
                    VSD:          'application/vnd.visio',
                    APP_XML:      'application/xml',
                    ABW:          'application/x-abiword',
                    ARC:          'application/x-freearc',
                    BZ:           'application/x-bzip',
                    BZ2:          'application/x-bzip2',
                    CDA:          'application/x-cdf',
                    CSH:          'application/x-csh',
                    ZIP_7Z:       'application/x-7z-compressed',
                    TAR:          'application/x-tar',
                    XHTML:        'application/xhtml+xml',
                    PHP:          'application/x-httpd-php',
                    SH:           'application/x-sh',
                    ZIP:          'application/zip',
                    AUD_3GP:      'audio/3gpp',
                    AUD_3G2:      'audio/3gpp2',
                    AAC:          'audio/aac',
                    MID:          'audio/midi',
                    MP3:          'audio/mpeg',
                    OGA:          'audio/ogg',
                    OPUS:         'audio/opus',
                    WAV:          'audio/wav',
                    WEBA:         'audio/webm',
                    MIDI:         'audio/x-midi',
                    OTF:          'font/otf',
                    TTF:          'font/ttf',
                    WOFF:         'font/woff',
                    WOFF2:        'font/woff2',
                    AVIF:         'image/avif',
                    BMP:          'image/bmp',
                    GIF:          'image/gif',
                    JPEG:         'image/jpeg',
                    JPG:          'image/jpeg',
                    PNG:          'image/png',
                    SVG:          'image/svg+xml',
                    TIFF:         'image/tiff',
                    TIF:          'image/tiff',
                    ICO:          'image/vnd.microsoft.icon',
                    WEBP:         'image/webp',
                    ICS:          'text/calendar',
                    CSS:          'text/css',
                    CSV:          'text/csv',
                    HTML:         'text/html',
                    JS:           'text/javascript',
                    TXT:          'text/plain',
                    TEXT_XML:     'text/xml',
                    VID_3GP:      'video/3gpp',
                    VID_3G2:      'video/3gpp2',
                    TS:           'video/mp2t',
                    MP4:          'video/mp4',
                    MPEG:         'video/mpeg',
                    OGV:          'video/ogg',
                    WEBM:         'video/webm',
                    AVI:          'video/x-msvideo',
                    AI:           'ai',
                    ARW:          'arw',
                    JPE:          'jpe',
                    JIF:          'jif',
                    JFIF:         'jfif',
                    JFI:          'jfi',
                    SVGZ:         'svgz',
                    PSD:          'psd',
                    RAW:          'raw',
                    CR2:          'cr2',
                    NRW:          'nrw',
                    K25:          'k25',
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
                    EPS:          'eps',
                }
            },
            SESSION: {
                DB_CONNECTION_SESSION_TIME_OUT:                   config.configurations().environment === 'production' ? 1000 * 60 * 60 * 1 : 1000 * 60 * 60 * 6, //? Every six hours (4 times a day)
                DB_CONNECTION_SESSION_EXPIRATION_INTERVAL:        config.configurations().environment === 'production' ? 1000 * 60 * 60 * 1 : 1000 * 60 * 60 * 6,  //? Every six hours (4 times a day)
                DB_CONNECTION_SESSION_CLEAR_EXPIRED:              true,
                DB_CONNECTION_CREATE_SESSION_TABLE_IF_NOT_EXISTS: config.configurations().environment === 'production' ? false : true,
                DB_SESSION_MAX_CONNECTIONS:                       config.configurations().environment === 'production' ? 10 : 1,
                DB_SESSION_END_CONNECTION_ON_CLOSE:               true,
                DB_CONNECTION_SESSION_CHARSET:                    'utf8mb4_bin',
                DB_SESSION_TABLE:                                 'sessions',
                DB_CONNECTION_SESSION_ID:                         'session_id',
                DB_CONNECTION_SESSION_EXPIRATION:                 'expires',
                DB_CONNECTION_SESSION_DATA:                       'data'
            },
            REQUEST: {
                TYPE: {
                    GET:    'GET',
                    POST:   'POST',
                    PATCH:  'PATCH',
                    PUT:    'PUT',
                    DELETE: 'DELETE'
                }
            },
            HTTP_VERSION: {
                V1: 'HTTP/1.1',
                V2: 'HTTP/2',
                V3: 'HTTP/3'
            },
            PROCESS: {
                EXIT_CODES: {
                    /*
                    * It will let the Node.js know to terminate the process when no async operations are performing. 
                    * Without mentioning, it will take the default value of 0.
                    */
                    EXIT_CODE_0 : '0',
    
                    /*
                    * It is useful in case of fatal exceptions not handled by the domain. It is an efficient method to terminate the process. 
                    */
                    EXIT_CODE_1 : '1',
    
                    /*
                    * Bash uses it for misuse. 
                    */
                    EXIT_CODE_2 : '2',
    
                    /*
                    * You can use this exit code for the development where internal code cannot be parsed properly. 
                    */
                    EXIT_CODE_3 : '3',
    
                    /*
                    * It is also used in the case of development where the JavaScript code fails to return the function value. 
                    */
                    EXIT_CODE_4 : '4',
    
                    /*
                    * It is useful for fatal errors, such as the V8 engine cannot recover.
                    */
                    EXIT_CODE_5 : '5',
    
                    /*
                    * It is useful when an internal fatal exception handler function is set to a non-function and cannot be called. 
                    */
                    EXIT_CODE_6 : '6',
    
                    /*
                    * Useful when an error is thrown while handling an uncaught expectation. 
                    */
                    EXIT_CODE_7 : '7',
    
                    /*
                    * Unused, in easier versions, it specifies the uncaught exceptions.
                    */
                    EXIT_CODE_8 : '8',
    
                    /*
                    * It is when an extra value is provided for a non-required parameter, or we do not provide the value for a required parameter.
                    */
                    EXIT_CODE_9 : '9',
    
                    /*
                    * The JavaScript code in bootstrapping of Node.js throws an error while calling the bootstrap.
                    */
                    EXIT_CODE_10 : '10',
    
                    /*
                    * When you chose the wrong port number within the process.
                    */
                    EXIT_CODE_12 : '12',
    
                    /*
                    * It is useful when await is outside the function in the top-level code, but the passed Promise was never resolved.
                    */
                    EXIT_CODE_13 : '13',
    
                    /*
                    * >128 Used for fatal signals such as SIGKILL or SIGHU.P 
                    */
                },
                KILL_CODES: {
                    /*
                    * To close the parent terminal. (is Handleable)
                    */
                    SIGHUP: '1',
                    
                    /*
                    * To interrupt a terminal, Ctrl + C (is Handleable)
                    */
                    SIGINT: '2',
                    
                    /*
                    * To make the terminal quit, Ctrl + D (is Handleable)
                    */
                    SIGQUIT: '3',
                    
                    /*
                    * To forceful kill the process (is NOT Handleable)
                    */
                    SIGKILL: '9',
                    
                    /*
                    * User-defined signal 1 (is Handleable)
                    */
                    SIGUSR1: '10',
                    
                    /*
                    * User-defined signal 2 (is Handleable)
                    */
                    SIGUSR2: '12',
                    
                    /*
                    * Represents a smooth process termination (is Handleable)
                    */
                    SIGTERM: '12',
                    
                    /*
                    * (is NOT Handleable) 
                    */
                    SIGSTOP: '19'
                }
            },
            NPM: 'NPM',
            PM2: 'PM2',
            CSRF: {
                sessionKey:    'session',
                cookie:        false,
                ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
                errCode:       'EBADCSRFTOKEN'
            },
            UPLOADER_ERRORS: {
                TOO_MANY_PARTS:        'LIMIT_PART_COUNT',
                FILE_TOO_LARGE:        'LIMIT_FILE_SIZE',
                TOO_MANY_FILES:        'LIMIT_FILE_COUNT',
                FIELD_NAME_TOO_LONG:   'LIMIT_FIELD_KEY',
                FIELD_VALUE_TOO_LONG:  'LIMIT_FIELD_VALUE',
                TOO_MANY_FIELDS:       'LIMIT_FIELD_COUNT',
                UNEXPECTED_FIELD:      'LIMIT_UNEXPECTED_FILE',
                FIELD_NAME_MISSING:    'MISSING_FIELD_NAME'
            }
        }
    }
    
    /**
     * @function getConstantsInstance
     * @static
     * @description Inits or gives back an instance of the class referring to the constants as an object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns object
    */
    static getConstantsInstance() {
        if (this.constants_instance) {
            return this.constants_instance.getConstants
        }
        this.constants_instance = new Constants();
        return this.constants_instance.getConstants
    }

    /**
     * @function getConstants
     * @private
     * @description Getter for list of constants
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns object
    */
    private get getConstants() {
        return this.constants;
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
    addOneConstant(key: string, value : string | number | object | []) : object {
        // @ts-ignore 
        return this.constants[key] = value;
    }

    /**
     * @function addObjectConstant
     * @description Appends to the constant object the passed object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {object} object
     * @returns array|object
    */
    addObjectConstant(...object : object[]) : object {
        return this.constants = Object.assign(this.constants, ...object);
    }

    /**
     * @function clearConstants
     * @description clears all the constants and returns true or false
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns boolean
    */
    clearConstants() : boolean {
        // @ts-ignore 
        this.constants = {};
        return !this.constants;
    }
}