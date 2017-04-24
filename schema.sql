CREATE DATABASE pilotdb;

USE pilotdb;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Trips'
-- 
-- ---

DROP TABLE IF EXISTS `trips`;
        
CREATE TABLE `trips` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `firstAirport` VARCHAR(4) NULL DEFAULT NULL,
  `FAStart` DATE NULL DEFAULT NULL,
  `FAEND` DATE NULL DEFAULT NULL,
  `secondAirport` VARCHAR(4) NULL DEFAULT NULL,
  `SAStart` DATE NULL DEFAULT NULL,
  `SAEnd` DATE NULL DEFAULT NULL,
  `thirdAirport` VARCHAR(4) NULL DEFAULT NULL,
  `TAStart` DATE NULL DEFAULT NULL,
  `TAEnd` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Trips` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Trips` (`id`,`firstAirport`,`FAStart`,`FAEND`,`secondAirport`,`SAStart`,`SAEnd`,`thirdAirport`,`TAStart`,`TAEnd`) VALUES
-- ('','','','','','','','','','');