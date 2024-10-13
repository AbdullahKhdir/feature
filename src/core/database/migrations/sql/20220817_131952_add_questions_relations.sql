ALTER TABLE sql_database.tbl_users_security_questions 
DROP FOREIGN KEY tbl_security_questions_tbl_user_id;

ALTER TABLE sql_database.tbl_users_security_questions 
CHANGE COLUMN question question INT UNSIGNED NOT NULL,
ADD INDEX tbl_user_securtiy_questions_tbl_security_questions_id_idx (question ASC) VISIBLE;

ALTER TABLE sql_database.tbl_users_security_questions RENAME INDEX tbl_security_questions_tbl_user_id TO tbl_user_security_questions_tbl_user_id;

ALTER TABLE sql_database.tbl_users_security_questions ALTER INDEX tbl_user_security_questions_tbl_user_id VISIBLE;

ALTER TABLE sql_database.tbl_users_security_questions 
ADD CONSTRAINT tbl_user_security_questions_tbl_user_id
  FOREIGN KEY (user_id)
  REFERENCES sql_database.tbl_users (id)
  ON UPDATE CASCADE,
ADD CONSTRAINT tbl_user_securtiy_questions_tbl_security_questions_id
  FOREIGN KEY (question)
  REFERENCES sql_database.tbl_security_questions (id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;