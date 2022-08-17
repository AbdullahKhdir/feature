-- add_question_relation_e
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop

ALTER TABLE node.tbl_users_security_questions 
ADD CONSTRAINT tbl_user_security_questions_tbl_user_id
  FOREIGN KEY (user_id)
  REFERENCES node.tbl_users (id)
  ON UPDATE CASCADE,
ADD CONSTRAINT tbl_user_securtiy_questions_tbl_security_questions_id
  FOREIGN KEY (question)
  REFERENCES node.tbl_security_questions (id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;