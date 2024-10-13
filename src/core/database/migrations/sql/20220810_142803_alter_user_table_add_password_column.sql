ALTER TABLE `sql_database`.`tbl_users` 
ADD COLUMN `password` LONGTEXT NOT NULL AFTER `email`;