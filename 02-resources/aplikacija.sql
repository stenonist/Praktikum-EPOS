-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.5.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for testdb
CREATE DATABASE IF NOT EXISTS `testdb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `testdb`;

-- Dumping structure for table testdb.administrator
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`administrator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table testdb.administrator: ~1 rows (approximately)
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(2, 'stefanlaz', '$2b$11$P.1HY.LOHp2/ED0UyhxIrOTx4esU5CkLkVLRPB0BBdjU5UzMgohLa', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table testdb.category
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `parent_category_id` int(10) unsigned DEFAULT NULL,
  `isVisible` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_parent_category_id` (`parent_category_id`),
  CONSTRAINT `fk_category_parent_category_id` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table testdb.category: ~2 rows (approximately)
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `parent_category_id`, `isVisible`) VALUES
	(1, 'Prva', NULL, 1),
	(2, 'Nova test kategorija', NULL, 1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table testdb.photo
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  `post_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`) USING BTREE,
  KEY `fk_image_post_id` (`post_id`),
  CONSTRAINT `fk_image_post_id` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table testdb.photo: ~1 rows (approximately)
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `post_id`) VALUES
	(5, 'static/uploads/2021/06/dc1e3cf9-e213-43fa-8791-058d1df3543a-ui.jpg', 2);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table testdb.post
CREATE TABLE IF NOT EXISTS `post` (
  `post_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(64) DEFAULT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `is_promoted` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`post_id`),
  KEY `fk_post_category_id` (`category_id`),
  KEY `fk_post_user_id` (`user_id`),
  CONSTRAINT `fk_post_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_post_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table testdb.post: ~2 rows (approximately)
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` (`post_id`, `created_at`, `name`, `description`, `location`, `category_id`, `user_id`, `is_active`, `is_promoted`) VALUES
	(2, '2021-05-31 22:51:55', 'Post2', 'Drugi opis', 'NS', 2, 1, 1, 0),
	(3, '2021-06-01 10:54:36', 'Post3', 'Treci Opis', 'Nis', 1, 1, 1, 0);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;

-- Dumping structure for table testdb.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `forename` varchar(64) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `phone` varchar(24) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `is_active` tinyint(1) unsigned DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table testdb.user: ~4 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `created_at`, `email`, `password_hash`, `forename`, `surname`, `phone`, `address`, `is_active`) VALUES
	(1, '2021-05-31 21:53:34', 'stefan@singidunum.ac.rs', '$2b$11$jiMHGZoOjXfc2hLMzRLvTeEo.LgDjAIVNpC0tEA4v5lzNELyjlMoi', 'Stefan', 'Lazarevic', '+381113093265', 'Danijelova 32, 11010 Beograd, Srbija', 1),
	(2, '2021-06-11 17:20:23', 'stefan@example.com', '$2b$11$GmiHvu/gUZyL9Pg6BSpgIO43kkMP7zqe7.eze/UZU8FiBayFBVoTC', 'Stefan', 'Lazarevic', '+381113093263', 'Danijelova 32, 11010 beograd, R. Srbija', 1),
	(3, '2021-06-11 18:10:55', 'mtair@singidunum.ac.rs', '$2b$11$dh2rsQ7Y.NZ.YW0TAlco.u1wnEk5UeXzZ.6qFs.lSB4/bNV0Pk1JK', 'Milan', 'Tair', '+381113093267', 'Danijelova 32, 11010 beograd, R. Srbija', 1),
	(5, '2021-06-11 19:07:01', 'pperic@example.com', '$2b$11$fjijegoiI1ea07Kpw91zkOVi8Y8vbnbNLdbKGQbLp05jmwAIhGS..', 'Pera', 'Peric', '+381113093222', 'Danijelova 32, 11010 beograd, R. Srbija', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
