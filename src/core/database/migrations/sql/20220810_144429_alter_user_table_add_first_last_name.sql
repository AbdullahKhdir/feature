ALTER TABLE `sql_database`.`tbl_users` 
ADD COLUMN `last_name` VARCHAR(255) NOT NULL AFTER `first_name`,
CHANGE COLUMN `name` `first_name` VARCHAR(255) NOT NULL ;
