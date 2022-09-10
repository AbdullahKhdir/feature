-- add_question_relation_c
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE node.tbl_users_security_questions RENAME INDEX tbl_security_questions_tbl_user_id TO tbl_user_security_questions_tbl_user_id;