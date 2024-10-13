-- add_security_questions
-- @author Abdullah Khdir <abdullah.khdir@telekom.de>
-- @branch develop


CREATE TABLE IF NOT EXISTS `sql_database`.`tbl_security_questions`  (
  `id` INT UNSIGNED NOT NULL,
  `question` LONGTEXT NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;