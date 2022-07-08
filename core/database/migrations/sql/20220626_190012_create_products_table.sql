-- create_products_table
-- @author Abdullah Khdir <abdullahkhder77@gmail.com>
-- @branch 

CREATE TABLE IF NOT EXISTS `node`.`products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `price` DOUBLE PRECISION NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `imageUrl` LONGTEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `product_id_idx` (`id` ASC) INVISIBLE,
  FULLTEXT INDEX `product_title_idx` (`title`) VISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8;