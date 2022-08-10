-- alter_user_table_add_password_column
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE `node`.`users` 
ADD COLUMN `password` LONGTEXT NOT NULL AFTER `email`;