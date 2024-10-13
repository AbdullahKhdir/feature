-- alter_update_at_to_updated_at_tbl_users_security_questions
-- @author Abdullah Khdir <abdullahkhder77@gmail.com>
-- @branch main

ALTER TABLE `sql_database`.`tbl_users_security_questions` 
CHANGE COLUMN `update_at` `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;
