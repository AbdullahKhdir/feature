-- create_user_table
-- @author Abdullah Khdir <abdullahkhder77@gmail.com>
-- @branch 

CREATE TABLE IF NOT EXISTS `node`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`id` ASC) INVISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8;