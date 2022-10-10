import e from "express";
import multer from "multer";

export type uploader_options = {
    extensions: string[];
    url: string;
    button_name: string;
    input_name: string;
    multiple_files: boolean;
    parent_class?: string;
    parent_id?: string;
    text_class?: string;
    text_id?: string;
    input_class?: string;
    input_id?: string;
};


//? union types with literal types
type uploader_configs = {
    storage_type:                       'diskStorage' | 'memoryStorage';
    file_size:                          number;
    upload_type:                        'single' | 'array' | 'fields' | 'none';
    upload_type_array_length?:          number;
    upload_type_fields_array?:          { name: string, maxCount: number }[];
    input_name:                         uploader_options['input_name'];
    storage_disk_destination_callback?: (req: e.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {};
    storage_disk_filename_callback?:    (req: e.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {};
    file_filter:                        (req: e.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {};
};

export type uploader_config_options = uploader_configs;
