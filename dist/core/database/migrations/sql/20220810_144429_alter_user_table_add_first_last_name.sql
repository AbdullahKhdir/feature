-- alter_user_table_add_first_last_name
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE `sql_database`.`tbl_users` 
ADD COLUMN `last_name` VARCHAR(255) NOT NULL AFTER `first_name`,
CHANGE COLUMN `name` `first_name` VARCHAR(255) NOT NULL ;
