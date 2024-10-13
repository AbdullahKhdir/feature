ALTER TABLE mysql.tbl_users_security_questions 
ADD CONSTRAINT tbl_user_security_questions_tbl_user_id
  FOREIGN KEY (user_id)
  REFERENCES mysql.tbl_users (id)
  ON UPDATE CASCADE,
ADD CONSTRAINT tbl_user_securtiy_questions_tbl_security_questions_id
  FOREIGN KEY (question)
  REFERENCES mysql.tbl_security_questions (id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;