-- alter_table_securtiy_questions
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE `sql_database`.`tbl_security_questions` 
CHANGE COLUMN `id` `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ;
