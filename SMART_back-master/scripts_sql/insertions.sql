/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP TABLE IF EXISTS `avatar`;
CREATE TABLE IF NOT EXISTS `avatar` (
  `avatar_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `photo` varchar(35) NOT NULL,
  PRIMARY KEY (`avatar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `avatar` DISABLE KEYS */;
INSERT INTO `avatar` (`avatar_id`, `name`, `photo`) VALUES
	(1, 'avatarTest', 'photo'),
	(2, 'icon4', 'ewAxLeX.png'),
	(3, 'mandala5', 'W92CWd6.png'),
	(4, 'icon1', '2ePQoy1.png'),
	(5, 'mandala3', '8sZCe9J.png'),
	(6, 'robot_green', 'xNxL4oQ.png'),
	(7, 'male_barber', 'Ufwq20z.png'),
	(8, 'mandala4', 'b4lFe2A.png'),
	(9, 'female_chignons', 'lAEuaQg.png'),
	(10, 'male_leftside', 'LJIR9Bk.png'),
	(11, 'robot_smile', 'JMhRLPu.png'),
	(12, 'mandala2', 'Ov85GJw.png'),
	(13, 'icon3', 'GH4RlAn.png'),
	(14, 'female_lookside', 'fc6kgSZ.png'),
	(15, 'icon5', 'aWNKWBv.png'),
	(16, 'robot_hearts', '7OmaGWW.png'),
	(17, 'female_sunglasses', 'yq1vD2W.png'),
	(18, 'mandala1', '2lrNuKA.png'),
	(19, 'icon2', 'bARc1oV.png'),
	(20, 'male_surprised', 'HZgErNH.png'),
	(21, 'male_rightside', 'bNhi1Pr.png');
/*!40000 ALTER TABLE `avatar` ENABLE KEYS */;

DROP TABLE IF EXISTS `chat`;
CREATE TABLE IF NOT EXISTS `chat` (
  `chat_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `last_message_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` (`chat_id`, `label`, `last_message_date`) VALUES
	(1, '\'Oriention après IF INSA Lyon\'', '2021-05-05 09:53:53'),
	(2, '\'Département IF INSA Lyon\'', '2021-05-05 09:54:37'),
	(3, '\'Stage IF INSA Lyon\'', '2021-05-05 09:55:22'),
	(4, '\'Premier Cycle INSA Lyon\'', '2021-05-05 09:56:07');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;

DROP TABLE IF EXISTS `education`;
CREATE TABLE IF NOT EXISTS `education` (
  `education_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `institute_id` varchar(10) DEFAULT NULL,
  `year_begin` date NOT NULL,
  `year_end` date DEFAULT NULL,
  `description` tinytext NOT NULL,
  `label` tinytext DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`education_id`),
  KEY `fk_user_edu` (`user_id`),
  CONSTRAINT `fk_user_edu` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` (`education_id`, `institute_id`, `year_begin`, `year_end`, `description`, `label`, `user_id`) VALUES
	(101, '001', '2019-09-01', '2022-06-30', 'Parcours ingénieur spécialité informatique', 'INSA Lyon', 1),
	(102, '011', '2014-09-01', '2017-06-30', 'CPGE scientifique', 'Prépa Stanislas', 1),
	(103, '001', '2017-09-01', '2022-06-30', 'Parcours ingénieur specilité informatique', 'INSA Lyon', 2);
/*!40000 ALTER TABLE `education` ENABLE KEYS */;

DROP TABLE IF EXISTS `educationtag`;
CREATE TABLE IF NOT EXISTS `educationtag` (
  `tag_id` bigint(20) NOT NULL,
  `education_id` bigint(20) NOT NULL,
  KEY `fk_tag_edut` (`tag_id`),
  KEY `fk_education_edut` (`education_id`),
  CONSTRAINT `fk_education_edut` FOREIGN KEY (`education_id`) REFERENCES `education` (`education_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tag_edut` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `educationtag` DISABLE KEYS */;
INSERT INTO `educationtag` (`tag_id`, `education_id`) VALUES
	(101, 101),
	(97, 101),
	(92, 102),
	(91, 102),
	(106, 102);
/*!40000 ALTER TABLE `educationtag` ENABLE KEYS */;

DROP TABLE IF EXISTS `experience`;
CREATE TABLE IF NOT EXISTS `experience` (
  `experience_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` tinytext NOT NULL,
  `year_begin` date NOT NULL,
  `year_end` date DEFAULT NULL,
  `siret` varchar(20) DEFAULT NULL,
  `label` tinytext DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`experience_id`),
  KEY `fk_user_exp` (`user_id`),
  CONSTRAINT `fk_user_exp` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` (`experience_id`, `description`, `year_begin`, `year_end`, `siret`, `label`, `user_id`) VALUES
	(101, 'Stage ouvrier', '2018-07-25', '2018-08-31', '356 000 000 00048', 'La poste', 2),
	(102, 'Stage informatique Front-end', '2020-07-01', '2020-08-31', '840 757 587 00026', 'XIAOMI France', 1),
	(103, 'Consultant informatique', '2021-03-05', NULL, '823 461 611 00019', 'SPIE', 3),
	(104, 'Stage ouvrier chez La Poste', '2017-01-01', NULL, NULL, 'Stagiaire', 1);
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;

DROP TABLE IF EXISTS `experiencetag`;
CREATE TABLE IF NOT EXISTS `experiencetag` (
  `tag_id` bigint(20) NOT NULL,
  `experience_id` bigint(20) NOT NULL,
  KEY `fk_tag_expt` (`tag_id`),
  KEY `fk_experience_expt` (`experience_id`),
  CONSTRAINT `fk_experience_expt` FOREIGN KEY (`experience_id`) REFERENCES `experience` (`experience_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tag_expt` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `experiencetag` DISABLE KEYS */;
INSERT INTO `experiencetag` (`tag_id`, `experience_id`) VALUES
	(104, 103),
	(201, 103),
	(103, 102),
	(200, 102),
	(105, 101),
	(202, 101);
/*!40000 ALTER TABLE `experiencetag` ENABLE KEYS */;

DROP TABLE IF EXISTS `level`;
CREATE TABLE IF NOT EXISTS `level` (
  `level_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  PRIMARY KEY (`level_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` (`level_id`, `label`) VALUES
	(1, 'college'),
	(2, 'lycee'),
	(3, 'bac'),
	(4, 'bac+1'),
	(5, 'bac+2'),
	(6, 'bac+3'),
	(7, 'bac+4'),
	(8, 'bac+5'),
	(9, 'bac+6'),
	(10, 'bac+7'),
	(11, 'bac+8'),
	(12, 'bac+9 et plus');
/*!40000 ALTER TABLE `level` ENABLE KEYS */;

DROP TABLE IF EXISTS `meeting`;
CREATE TABLE IF NOT EXISTS `meeting` (
  `meeting_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `meet_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`meeting_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `meeting` DISABLE KEYS */;
INSERT INTO `meeting` (`meeting_id`, `label`, `meet_date`) VALUES
	(1, '\'Discution oriention après IF INSA Lyon\'', '2021-05-05 09:59:12'),
	(2, '\'Formation d\'ingénieur à l\'INSA Lyon\'', '2021-05-10 10:19:00'),
	(3, '\'Stages en informatique\'', '2021-05-14 10:01:43');
/*!40000 ALTER TABLE `meeting` ENABLE KEYS */;

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `message_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `chat_id` bigint(20) NOT NULL,
  `msg_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` varchar(25) NOT NULL,
  `content` tinytext NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `fk_user_msg` (`user_id`),
  KEY `fk_chat_msg` (`chat_id`),
  CONSTRAINT `fk_chat_msg` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_msg` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;

DROP TABLE IF EXISTS `participant`;
CREATE TABLE IF NOT EXISTS `participant` (
  `participant_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chat_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `last_open_date` date NOT NULL,
  `accepted` tinyint(1) NOT NULL,
  PRIMARY KEY (`participant_id`),
  KEY `fk_user_par` (`user_id`),
  KEY `fk_chat_par` (`chat_id`),
  CONSTRAINT `fk_chat_par` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_par` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `participant` DISABLE KEYS */;
INSERT INTO `participant` (`participant_id`, `chat_id`, `user_id`, `last_open_date`, `accepted`) VALUES
	(1, 4, 2, '2021-05-05', 1),
	(2, 4, 4, '2021-05-05', 0),
	(3, 1, 3, '2021-05-05', 1),
	(4, 1, 1, '2021-05-05', 1),
	(5, 1, 2, '2021-05-05', 1),
	(6, 3, 1, '2021-05-05', 0),
	(7, 3, 2, '2021-05-05', 1);
/*!40000 ALTER TABLE `participant` ENABLE KEYS */;

DROP TABLE IF EXISTS `participantmeeting`;
CREATE TABLE IF NOT EXISTS `participantmeeting` (
  `participantmeeting_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `meeting_id` bigint(20) NOT NULL,
  `accepted` tinyint(1) NOT NULL,
  `cancelled` tinyint(1) NOT NULL,
  `initiator` tinyint(1) NOT NULL,
  PRIMARY KEY (`participantmeeting_id`),
  KEY `fk_user_parmeet` (`user_id`),
  KEY `fk_meeting_parmeet` (`meeting_id`),
  CONSTRAINT `fk_meeting_parmeet` FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`meeting_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_parmeet` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `participantmeeting` DISABLE KEYS */;
INSERT INTO `participantmeeting` (`participantmeeting_id`, `user_id`, `meeting_id`, `accepted`, `cancelled`, `initiator`) VALUES
	(1, 1, 3, 0, 0, 1),
	(2, 1, 1, 1, 0, 0),
	(3, 2, 1, 1, 0, 0),
	(4, 3, 1, 1, 0, 1),
	(5, 2, 2, 0, 0, 0),
	(6, 2, 3, 0, 0, 0),
	(7, 4, 2, 0, 0, 1);
/*!40000 ALTER TABLE `participantmeeting` ENABLE KEYS */;

DROP TABLE IF EXISTS `questionanswer`;
CREATE TABLE IF NOT EXISTS `questionanswer` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `question` tinytext NOT NULL,
  `answer` tinytext NOT NULL,
  PRIMARY KEY (`qa_id`),
  KEY `fk_user_qa` (`user_id`),
  CONSTRAINT `fk_user_qa` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `questionanswer` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionanswer` ENABLE KEYS */;

DROP TABLE IF EXISTS tag;
CREATE TABLE IF NOT EXISTS `tag` (
  `tag_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` tinytext NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=407 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE tag DISABLE KEYS */;
INSERT INTO tag (`tag_id`, `label`) VALUES
	(91, 'Lycée'),
	(92, 'Prépa'),
	(95, 'Université'),
	(96, 'IUT'),
	(97, 'Grande école'),
	(98, 'Ingénieur'),
	(101, 'INSA Lyon'),
	(102, 'LIRIS'),
	(103, 'Xiaomi France'),
	(104, 'SPIE'),
	(105, 'La poste'),
	(106, 'Collège Stanislas'),
	(200, 'Développeur'),
	(201, 'Consultant'),
	(202, 'Stage Ouvrier'),
	(203, 'Informatique'),
	(204, 'Stage en informatique'),
	(401, 'Tennis'),
	(402, 'Danse'),
	(403, 'Jeux vidéos'),
	(404, 'Programmation'),
	(405, 'Course/Jogging'),
	(406, 'Cybersécurité');
/*!40000 ALTER TABLE tag ENABLE KEYS */;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `avatar_id` bigint(20) NOT NULL,
  `password` tinytext NOT NULL,
  `birth` date NOT NULL,
  `level_id` bigint(20) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `counselor` tinyint(1) NOT NULL,
  `verify` tinyint(1) NOT NULL,
  `status` tinytext NOT NULL,
  `photo` varchar(85) DEFAULT NULL,
  `identity_document` varchar(85) DEFAULT NULL,
  `device` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `userName_mail_unique` (`user_name`,`mail`),
  KEY `fk_avatar` (`avatar_id`),
  KEY `fk_level` (`level_id`),
  CONSTRAINT `fk_avatar` FOREIGN KEY (`avatar_id`) REFERENCES `avatar` (`avatar_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_level` FOREIGN KEY (`level_id`) REFERENCES `level` (`level_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `user_name`, `display_name`, `mail`, `avatar_id`, `password`, `birth`, `level_id`, `tel`, `counselor`, `verify`, `status`, `photo`, `identity_document`, `device`) VALUES
	(1, 'polo504', 'Paul Moine', 'paul.moine@gmail.com', 7, '$2a$10$wwNx4vIpnmvbqy.TUgVQa.vf17nXVBBETHKlpBmYivav7bIjwYHfG', '1999-08-28', 12, '0605040201', 1, 1, 'Etudiant ingénieur en 4ème année', NULL, NULL, NULL),
	(2, 'saEsme', 'Sana EM', 'saEsme@gmail.com', 8, '$2a$10$2o4aIPtuosfWNgc3zsfz5.p2x6ivUeEgO81S3EfqBiO03bznOYlEK', '2008-02-28', 7, '07084529623', 1, 1, 'Etudiante ingénieure en 4ème année', NULL, NULL, NULL),
	(3, 'scutu01', 'Vasile-Marian Scuturici', 'marian.scuturici@insa-lyon.fr', 18, '$2a$10$v7SWnfU6ywe1fko3zamiq.Pi3l0cqY41m2S.uhwWcisSUbTTHxwBi', '1960-09-14', 12, '0625987415', 1, 1, 'Professeur au département informatique INSA Lyon', NULL, NULL, NULL),
	(4, 'pauline80', 'Pauline Lefèvre', 'p.lefevre@gmail.com', 14, '$2a$10$s/byP8UJCTSezvtlOc/L0.GWRpmnSnhKfbVelI8PRZ86CHXMHC9PC', '2005-05-05', 2, '0784593102', 0, 1, 'Lycéenne spécialités scientifiques', NULL, NULL, NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

DROP TABLE IF EXISTS `userabilitytag`;
CREATE TABLE IF NOT EXISTS `userabilitytag` (
  `user_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  KEY `fk_tag_abil` (`tag_id`),
  KEY `fk_user_abil` (`user_id`),
  CONSTRAINT `fk_tag_abil` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_abil` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `userabilitytag` DISABLE KEYS */;
INSERT INTO `userabilitytag` (`user_id`, `tag_id`) VALUES
	(1, 204),
	(1, 200),
	(1, 101),
	(1, 92),
	(2, 101),
	(2, 101),
	(2, 202),
	(3, 101),
	(3, 104),
	(3, 97),
	(2, 203),
	(1, 203),
	(3, 203),
	(2, 406);
/*!40000 ALTER TABLE `userabilitytag` ENABLE KEYS */;

DROP TABLE IF EXISTS `userintereststag`;
CREATE TABLE IF NOT EXISTS `userintereststag` (
  `user_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  KEY `fk_tag_usertag` (`tag_id`),
  KEY `fk_user_usertag` (`user_id`),
  CONSTRAINT `fk_tag_usertag` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_usertag` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `userintereststag` DISABLE KEYS */;
INSERT INTO `userintereststag` (`user_id`, `tag_id`) VALUES
	(4, 403),
	(4, 101),
	(1, 406),
	(2, 402),
	(2, 406),
	(2, 404),
	(1, 403),
	(3, 405),
	(3, 102),
	(1, 203),
	(4, 101);
/*!40000 ALTER TABLE `userintereststag` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
