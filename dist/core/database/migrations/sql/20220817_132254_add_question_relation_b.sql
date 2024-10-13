-- add_question_relation_b
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE sql_database.tbl_users_security_questions 
CHANGE COLUMN question question INT UNSIGNED NOT NULL,
ADD INDEX tbl_user_securtiy_questions_tbl_security_questions_id_idx (question ASC) VISIBLE;