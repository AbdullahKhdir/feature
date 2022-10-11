'use strict';

import multer from 'multer';
import LogicException from '../../core/exception/types/LogicException';
import { Singleton } from '../../core/Singleton/Singleton';
import { uploader_config_options, uploader_options } from '../../core/utils/data_typs';

/**
 * @class Uploader
 * @constructor
 * @description Class Uploader is used to process uploaded files
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Uploader {
    
    private static instance: Uploader;
    private multer: typeof multer;
    private constructor() {
        this.multer = multer;
    }

    /**
     * @function getUploaderInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Uploader
    */
    static getUploaderInstance () : Uploader {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Uploader();
        return this.instance
    }

    /**
     * @function getBodyParser
     * @description Getter method for multer object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns multer
    */
    get getMulter() : typeof import('multer') {
        return this.multer;
    }

    /**
     * @function _buildUploader
     * @description Builds upload form
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} key 
     * @returns string template variable for render the upload form
    */
    public _buildUploader(options: uploader_options) {
        let _html = '';
        if (typeof options !== 'undefined' && typeof options === 'object' && Object.keys(options).length > 0) {
            if (typeof options !== 'undefined' && typeof options === 'object' && Object.keys(options).length > 0) {
                const extensions = options.extensions.map((item) => item.startsWith('.') ? item : '.'+item).join(',');
                _html = `
                    <form class="${options.enable_loader ? 'cube-loader' : ''}" action="${options.url}" method="POST" enctype="multipart/form-data">
                        <div id="_uploader${options.parent_id ? ' '+options.parent_id : ''}"
                            class="file-field input-field${options.parent_class ? ' '+options.parent_class : ''}">
                            <div id="start_upload_process" class="btn">
                                <span>${options.button_name ? options.button_name : 'Choose a file'}</span>
                                <input 
                                    id="fileupload${options.input_id ? ' '+options.input_id : ''}"
                                    class=file"${options.input_class ? ' '+options.input_class : ''}"
                                    name="${options.input_name}"
                                    id="${options.input_name}"
                                    type="file"
                                    accept="${extensions}"
                                    ${options.multiple_files ? 'multiple' : ''}
                                >
                            </div>
                            <div class="file-path-wrapper">
                            
                            <i id="uploader_status_icon" class="material-icons text-darken-4 blue-text">cloud_upload</i>
                            <i id="uploader_status_icon_complete" class="material-icons text-darken-4 blue-text">cloud_done</i>
                            <progress id="progress" class="progress_bar" max="100" value="0">0</progress>
                                <input 
                                    id="${options.text_id ? options.text_id : ''}"
                                    class="file-path validate ${options.text_class ? options.text_class : ''}" 
                                    type="text"
                                >
                            </div>
                        </div>
                    </form>
                `;
            }
        }
        return _html;
    }

    public configureUploader(
        options: uploader_config_options,
        instance: typeof import('multer') = Uploader.getUploaderInstance().getMulter
    ) : multer.Multer | undefined {
        let uploader_configs = null;
        let file_filter      = null;

        if (instance !instanceof Uploader.getUploaderInstance().getMulter) {
            throw new LogicException('Uploader instance must be of type multer!');
        }
        
        if (Object.keys(options).length > 0) {
            if (options.storage_type === Singleton.getConstants().UPLOADER_TYPES.DISK) {
                if (typeof options.storage_disk_destination_callback === 'function'
                &&  typeof options.storage_disk_filename_callback    === 'function') {
                    uploader_configs = instance.diskStorage({
                        destination: options.storage_disk_destination_callback,
                        filename: options.storage_disk_filename_callback
                    });
                } else if (typeof options.storage_disk_destination_callback === 'function'
                &&         typeof options.storage_disk_filename_callback    === 'undefined') {
                    uploader_configs = instance.diskStorage({
                        destination: options.storage_disk_destination_callback
                    });
                } else if (typeof options.storage_disk_destination_callback === 'undefined'
                &&         typeof options.storage_disk_filename_callback    === 'function') {
                    uploader_configs = instance.diskStorage({
                        filename: options.storage_disk_filename_callback
                    });
                } else if (typeof options.storage_disk_destination_callback === 'undefined'
                &&         typeof options.storage_disk_filename_callback    === 'undefined') {
                    uploader_configs = instance.diskStorage({});
                }

                if (typeof options.file_filter === 'function') {
                    file_filter = options.file_filter;
                } else {
                    throw new LogicException('File filter callback must be a function!');
                }

                if (options.upload_type === 'single') {
                    // @ts-ignore
                    return instance(
                        {
                            storage: uploader_configs!,
                            limits: {fileSize: options.file_size},
                            fileFilter: file_filter!
                        }
                    ).single(options.input_name);
                } else if (options.upload_type === 'array') {
                    if (typeof options.upload_type_array_length === 'number') {
                        // @ts-ignore
                        return instance(
                            {
                                storage: uploader_configs!,
                                limits: {fileSize: options.file_size},
                                fileFilter: file_filter!
                            }
                        ).array(options.input_name, options.upload_type_array_length);
                    }
                } else if (options.upload_type === 'fields') {
                    if (typeof options.upload_type_fields_array !== 'undefined') {
                        if (options.upload_type_fields_array.length > 0) {
                            // @ts-ignore
                            return instance(
                                {
                                    storage: uploader_configs!,
                                    limits: {fileSize: options.file_size},
                                    fileFilter: file_filter!
                                }
                            ).fields(options.upload_type_fields_array);
                        }
                    }
                } else if (options.upload_type === 'none') {
                    // @ts-ignore
                    return instance(
                        {
                            storage: uploader_configs!,
                            limits: {fileSize: options.file_size},
                            fileFilter: file_filter!
                        }
                    ).none();
                } else {
                    // @ts-ignore
                    return instance(
                        {
                            storage: uploader_configs!,
                            limits: {fileSize: options.file_size},
                            fileFilter: file_filter!
                        }
                    ).any();
                }
            } else if (options.storage_type === Singleton.getConstants().UPLOADER_TYPES.MEMORY) {
                uploader_configs = instance.memoryStorage();

                if (typeof options.file_filter === 'function') {
                    file_filter = options.file_filter;
                } else {
                    throw new LogicException('File filter callback must be a function!');
                }

                if (options.upload_type === 'single') {
                    // @ts-ignore
                    return instance(
                        {
                            storage: uploader_configs,
                            limits: {fileSize: options.file_size},
                            fileFilter: file_filter!
                        }
                    ).single(options.input_name);
                } else if (options.upload_type === 'array') {
                    if (typeof options.upload_type_array_length === 'number') {
                        // @ts-ignore
                        return instance(
                            {
                                storage: uploader_configs!,
                                limits: {fileSize: options.file_size},
                                fileFilter: file_filter!
                            }
                        ).array(options.input_name, options.upload_type_array_length);
                    }
                } else if (options.upload_type === 'fields') {
                    if (typeof options.upload_type_fields_array !== 'undefined') {
                        if (options.upload_type_fields_array.length > 0) {
                            // @ts-ignore
                            return instance(
                                {
                                    storage: uploader_configs!,
                                    limits: {fileSize: options.file_size},
                                    fileFilter: file_filter!
                                }
                            ).fields(options.upload_type_fields_array);
                        }
                    }
                } else if (options.upload_type === 'none') {
                    // @ts-ignore
                    return instance(
                        {
                            storage: uploader_configs!,
                            limits: {fileSize: options.file_size},
                            fileFilter: file_filter!
                        }
                    ).none();
                } else {
                    // @ts-ignore
                    return instance(
                        {
                            storage: uploader_configs!,
                            limits: {fileSize: options.file_size},
                            fileFilter: file_filter!
                        }
                    ).any();
                }
            }
        } else {
            throw new LogicException('Options object must be provided in order to use the uploader!');
        }
        return;
    }

    public asyncUpload(req: Request, res: Response, uploader: any) {
        return new Promise<boolean>(function(resolve, reject) {
            uploader(req, res, function(err: multer.MulterError) {
                if(err !== undefined) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
}
