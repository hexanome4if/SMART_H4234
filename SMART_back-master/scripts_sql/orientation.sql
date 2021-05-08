DROP DATABASE IF EXISTS `orientation`;
CREATE DATABASE orientation;
USE orientation;


CREATE TABLE IF NOT EXISTS `avatar` (
  `avatar_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `photo` varchar(35) NOT NULL,
  PRIMARY KEY (`avatar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `level` (
    `level_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `label` varchar(50) NOT NULL,
    PRIMARY KEY (`level_id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;


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


CREATE TABLE IF NOT EXISTS `chat` (
  `chat_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `last_message_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


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


CREATE TABLE IF NOT EXISTS `tag` (
    `tag_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `label` tinytext NOT NULL,
    PRIMARY KEY (`tag_id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=407 DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `educationtag` (
    `tag_id` bigint(20) NOT NULL,
    `education_id` bigint(20) NOT NULL,
    KEY `fk_tag_edut` (`tag_id`),
    KEY `fk_education_edut` (`education_id`),
    CONSTRAINT `fk_education_edut` FOREIGN KEY (`education_id`) REFERENCES `education` (`education_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tag_edut` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `experiencetag` (
  `tag_id` bigint(20) NOT NULL,
  `experience_id` bigint(20) NOT NULL,
  KEY `fk_tag_expt` (`tag_id`),
  KEY `fk_experience_expt` (`experience_id`),
  CONSTRAINT `fk_experience_expt` FOREIGN KEY (`experience_id`) REFERENCES `experience` (`experience_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tag_expt` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `meeting` (
  `meeting_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `meet_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`meeting_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


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


CREATE TABLE IF NOT EXISTS `questionanswer` (
  `qa_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `question` tinytext NOT NULL,
  `answer` tinytext NOT NULL,
  PRIMARY KEY (`qa_id`),
  KEY `fk_user_qa` (`user_id`),
  CONSTRAINT `fk_user_qa` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `userabilitytag` (
  `user_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  KEY `fk_tag_abil` (`tag_id`),
  KEY `fk_user_abil` (`user_id`),
  CONSTRAINT `fk_tag_abil` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_abil` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `userintereststag` (
  `user_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  KEY `fk_tag_usertag` (`tag_id`),
  KEY `fk_user_usertag` (`user_id`),
  CONSTRAINT `fk_tag_usertag` FOREIGN KEY (`tag_id`) REFERENCES tag (`tag_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_usertag` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
