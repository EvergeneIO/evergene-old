CREATE DATABASE IF NOT EXISTS `evergene-new`
USE `evergene-new`;

CREATE TABLE IF NOT EXISTS `endpoints` (
  `name` varchar(50) NOT NULL,
  `status` BOOLEAN DEFAULT '1',
  PRIMARY KEY ('name')
)

CREATE TABLE IF NOT EXISTS `user` (
	`email` varchar(1024) NOT NULL,
	`name` varchar(255) NOT NULL,
	`profile` varchar(255) NOT NULL,
	`discordId` varchar(255) NOT NULL,
	PRIMARY KEY (`discordId`)
)

CREATE TABLE IF NOT EXISTS `app` (
	`email` varchar(1024) NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	PRIMARY KEY (`uuid`,`token`)
)

CREATE TABLE IF NOT EXISTS `intern` (
	`name` varchar(255) NOT NULL,
	`status` BOOLEAN NOT NULL,
	PRIMARY KEY (`name`)
)

CREATE TABLE IF NOT EXISTS `perms` (
	`name` varchar(255) NOT NULL,
	`bit` int(255) NOT NULL,
	PRIMARY KEY (`name`,`bit`)
)
