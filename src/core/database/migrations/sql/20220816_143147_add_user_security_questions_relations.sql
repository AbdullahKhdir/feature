-- add_user_security_questions_relations
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE `node`.`tbl_security_questions` 
ADD CONSTRAINT `tbl_security_questions_tbl_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `node`.`tbl_users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;
