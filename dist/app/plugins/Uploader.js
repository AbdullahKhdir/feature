'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var multer_1 = __importDefault(require("multer"));
var LogicException_1 = __importDefault(require("../../core/exception/types/LogicException"));
var Singleton_1 = require("../../core/Singleton/Singleton");
module.exports = /** @class */ (function () {
    function Uploader() {
        this.multer = multer_1.default;
    }
    /**
     * @function getUploaderInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Uploader
    */
    Uploader.getUploaderInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Uploader();
        return this.instance;
    };
    Object.defineProperty(Uploader.prototype, "getMulter", {
        /**
         * @function getBodyParser
         * @description Getter method for multer object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns multer
        */
        get: function () {
            return this.multer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @function _buildUploader
     * @description Builds upload form
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} key
     * @returns string template variable for render the upload form
    */
    Uploader.prototype._buildUploader = function (options) {
        var _html = '';
        if (typeof options !== 'undefined' && typeof options === 'object' && Object.keys(options).length > 0) {
            if (typeof options !== 'undefined' && typeof options === 'object' && Object.keys(options).length > 0) {
                var extensions = options.extensions.map(function (item) { return item.startsWith('.') ? item : '.' + item; }).join(',');
                _html = "\n                    <form id=\"pre-populated-upload-form\" class=\"".concat(options.enable_loader ? 'cube-loader' : '', "\" action=\"").concat(options.url, "\" method=\"POST\" enctype=\"multipart/form-data\">\n                        <div id=\"_uploader").concat(options.parent_id ? ' ' + options.parent_id : '', "\"\n                            class=\"file-field input-field").concat(options.parent_class ? ' ' + options.parent_class : '', "\">\n                            <div id=\"start_upload_process\" class=\"btn\">\n                                <span>").concat(options.button_name ? options.button_name : 'Choose a file', "</span>\n                                <input \n                                    id=\"fileupload").concat(options.input_id ? ' ' + options.input_id : '', "\"\n                                    class=\"").concat(options.input_class ? 'file ' + options.input_class : 'file', "\"\n                                    name=\"").concat(options.input_name, "\"\n                                    id=\"").concat(options.input_name, "\"\n                                    type=\"file\"\n                                    accept=\"").concat(extensions, "\"\n                                    ").concat(options.multiple_files ? 'multiple' : '', "\n                                >\n                            </div>\n                            <div class=\"file-path-wrapper\">\n                            \n                            <i id=\"uploader_status_icon\"                title=\"Start uploading\"                   class=\"material-icons text-darken-4 blue-text\">file_upload</i>\n                            <i id=\"uploader_status_icon_complete_one\"   title=\"File has been uploaded\"   class=\"material-icons text-darken-1 green-text\">done</i>\n                            <i id=\"uploader_status_icon_complete_all\"   title=\"Files has been uploaded\"  class=\"material-icons text-darken-1 green-text\">done_all</i>\n                            <i id=\"uploader_status_icon_complete_error\" title=\"Error, max files reached\" class=\"material-icons text-darken-1 red-text\">error</i>\n                            <i id=\"uploader_status_icon_reset\"          title=\"Delete selected files and upload again\" class=\"material-icons text-darken-4 blue-text\">delete</i>\n                            <progress id=\"progress\" class=\"progress_bar\" max=\"100\" value=\"0\">0</progress>\n                                <input \n                                    id=\"").concat(options.text_id ? options.text_id : '', "\"\n                                    class=\"file-path validate ").concat(options.text_class ? options.text_class : '', "\" \n                                    type=\"text\"\n                                >\n                            </div>\n                            <input type='hidden' id=\"max-file-size\" class=\"max-file-size\" name='max-file-size' value=\"").concat(options.max_files, "\">\n                            <input type='hidden' id=\"upload-action-url\" class=\"upload-action-url\" name='upload-action-url' value=\"").concat(options.url, "\">\n                            <input type='hidden' id=\"\" class=\"max-file-size\" name='max-file-size' value=\"").concat(options.max_files, "\">\n                            <input type='hidden' id=\"\" class=\"uploader-form-id\" name='uploader-form-id' value=\"").concat(options.form_id, "\">\n                        </div>\n                    </form>\n                ");
            }
        }
        return _html;
    };
    Uploader.prototype.configureUploader = function (options, instance) {
        if (instance === void 0) { instance = Uploader.getUploaderInstance().getMulter; }
        var uploader_configs = null;
        var file_filter = null;
        if (instance instanceof Uploader.getUploaderInstance().getMulter) {
            throw new LogicException_1.default('Uploader instance must be of type multer!');
        }
        if (Object.keys(options).length > 0) {
            if (options.storage_type === Singleton_1.Singleton.getConstants().UPLOADER_TYPES.DISK) {
                if (typeof options.storage_disk_destination_callback === 'function'
                    && typeof options.storage_disk_filename_callback === 'function') {
                    uploader_configs = instance.diskStorage({
                        destination: options.storage_disk_destination_callback,
                        filename: options.storage_disk_filename_callback
                    });
                }
                else if (typeof options.storage_disk_destination_callback === 'function'
                    && typeof options.storage_disk_filename_callback === 'undefined') {
                    uploader_configs = instance.diskStorage({
                        destination: options.storage_disk_destination_callback
                    });
                }
                else if (typeof options.storage_disk_destination_callback === 'undefined'
                    && typeof options.storage_disk_filename_callback === 'function') {
                    uploader_configs = instance.diskStorage({
                        filename: options.storage_disk_filename_callback
                    });
                }
                else if (typeof options.storage_disk_destination_callback === 'undefined'
                    && typeof options.storage_disk_filename_callback === 'undefined') {
                    uploader_configs = instance.diskStorage({});
                }
                if (typeof options.file_filter === 'function') {
                    file_filter = options.file_filter;
                }
                else {
                    throw new LogicException_1.default('File filter callback must be a function!');
                }
                if (options.upload_type === 'single') {
                    // @ts-ignore
                    return instance({
                        storage: uploader_configs,
                        limits: { fileSize: options.file_size },
                        fileFilter: file_filter
                    }).single(options.input_name);
                }
                else if (options.upload_type === 'array') {
                    if (typeof options.upload_type_array_length === 'number') {
                        // @ts-ignore
                        return instance({
                            storage: uploader_configs,
                            limits: { fileSize: options.file_size },
                            fileFilter: file_filter
                        }).array(options.input_name, options.upload_type_array_length);
                    }
                }
                else if (options.upload_type === 'fields') {
                    if (typeof options.upload_type_fields_array !== 'undefined') {
                        if (options.upload_type_fields_array.length > 0) {
                            // @ts-ignore
                            return instance({
                                storage: uploader_configs,
                                limits: { fileSize: options.file_size },
                                fileFilter: file_filter
                            }).fields(options.upload_type_fields_array);
                        }
                    }
                }
                else if (options.upload_type === 'none') {
                    // @ts-ignore
                    return instance({
                        storage: uploader_configs,
                        limits: { fileSize: options.file_size },
                        fileFilter: file_filter
                    }).none();
                }
                else {
                    // @ts-ignore
                    return instance({
                        storage: uploader_configs,
                        limits: { fileSize: options.file_size },
                        fileFilter: file_filter
                    }).any();
                }
            }
            else if (options.storage_type === Singleton_1.Singleton.getConstants().UPLOADER_TYPES.MEMORY) {
                uploader_configs = instance.memoryStorage();
                if (typeof options.file_filter === 'function') {
                    file_filter = options.file_filter;
                }
                else {
                    throw new LogicException_1.default('File filter callback must be a function!');
                }
                if (options.upload_type === 'single') {
                    // @ts-ignore
                    return instance({
                        storage: uploader_configs,
                        limits: { fileSize: options.file_size },
                        fileFilter: file_filter
                    }).single(options.input_name);
                }
                else if (options.upload_type === 'array') {
                    if (typeof options.upload_type_array_length === 'number') {
                        // @ts-ignore
                        return instance({
                            storage: uploader_configs,
                            limits: { fileSize: options.file_size },
                            fileFilter: file_filter
                        }).array(options.input_name, options.upload_type_array_length);
                    }
                }
                else if (options.upload_type === 'fields') {
                    if (typeof options.upload_type_fields_array !== 'undefined') {
                        if (options.upload_type_fields_array.length > 0) {
                            // @ts-ignore
                            return instance({
                                storage: uploader_configs,
                                limits: { fileSize: options.file_size },
                                fileFilter: file_filter
                            }).fields(options.upload_type_fields_array);
                        }
                    }
                }
                else if (options.upload_type === 'none') {
                    // @ts-ignore
                    return instance({
                        storage: uploader_configs,
                        limits: { fileSize: options.file_size },
                        fileFilter: file_filter
                    }).none();
                }
                else {
                    // @ts-ignore
                    return instance({
                        storage: uploader_configs,
                        limits: { fileSize: options.file_size },
                        fileFilter: file_filter
                    }).any();
                }
            }
        }
        else {
            throw new LogicException_1.default('Options object must be provided in order to use the uploader!');
        }
        return;
    };
    Uploader.prototype.asyncUpload = function (req, res, uploader) {
        return new Promise(function (resolve, reject) {
            uploader(req, res, function (err) {
                if (err !== undefined) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    };
    return Uploader;
}());
