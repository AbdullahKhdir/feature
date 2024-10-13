-- add_question_relation_d
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE sql_database.tbl_users_security_questions ALTER INDEX tbl_user_security_questions_tbl_user_id VISIBLE;