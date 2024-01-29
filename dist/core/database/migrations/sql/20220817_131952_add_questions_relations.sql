-- add_questions_relations
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE node.tbl_users_security_questions 
DROP FOREIGN KEY tbl_security_questions_tbl_user_id;