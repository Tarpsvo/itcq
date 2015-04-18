SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `categories` (
`id` int(11) NOT NULL,
  `name` text COLLATE utf8_estonian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci;

CREATE TABLE IF NOT EXISTS `questions` (
`id` int(11) NOT NULL,
  `category` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `question` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `answer` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `wrong1` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `wrong2` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `wrong3` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `author` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `level` int(2) NOT NULL DEFAULT '1',
  `has_image` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci;

CREATE TABLE IF NOT EXISTS `statistics` (
`id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_correct` tinyint(1) NOT NULL,
  `answer` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `user` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci;

CREATE TABLE IF NOT EXISTS `suggestions` (
`id` int(11) NOT NULL,
  `question` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `correct_answer` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `wrong1` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `wrong2` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `wrong3` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `ip` varchar(255) COLLATE utf8_estonian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci;

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `salt` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `account` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `lastip` varchar(255) COLLATE utf8_estonian_ci NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci;


ALTER TABLE `statistics`
 ADD PRIMARY KEY (`id`);

ALTER TABLE `categories`
 ADD PRIMARY KEY (`id`);

ALTER TABLE `questions`
 ADD PRIMARY KEY (`id`);

ALTER TABLE `suggestions`
 ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
 ADD PRIMARY KEY (`id`);


ALTER TABLE `statistics`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
ALTER TABLE `categories`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
ALTER TABLE `questions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
ALTER TABLE `suggestions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;

-- Insert necessary data to kickstart the system
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'General'),
(2, 'Teachers');

INSERT INTO `questions` (`id`, `category`, `question`, `answer`, `wrong1`, `wrong2`, `wrong3`, `modified`, `level`, `enabled`, `has_image`) VALUES
(1, 'General', 'Mis aastal IT kolledž asutati?', '2000', '1998', '1996', '2002', '2015-02-22 14:59:32', 1, 1, 0),
(2, 'General', 'Kes oli esimene IT kolledži rektor?', 'Kalle Tammemäe', 'Ivo Linna', 'Erki Nool', 'Jörpa', '2015-02-22 15:07:46', 1, 1, 0),
(3, 'General', 'Kes on praegune IT kolledži rektor?', 'Tiit Roosmaa', 'Teet Riismaa', 'Erki Nool', 'Reet Linna', '2015-02-25 16:24:18', 4, 1, 0),
(4, 'Teachers', 'Kes käib iga hommik auditooriumi projektoreid parandamas?', 'Lembi Tiks', 'Lembit X', 'Jörpa', 'Jeesus', '2015-03-29 19:14:41', 1, 1, 0),
(5, 'Miscallenous', 'Kuidas nimetatakse seda nööri, millega püütakse lehma?', 'Lasso', 'Köis', 'Tross', 'Nabanöör', '2015-03-20 12:11:09', 8, 1, 0);

INSERT INTO `users` (`id`, `username`, `password`, `salt`, `account`, `lastip`, `modified`) VALUES
(1, 'demo', 'c6f3e58f41ddc69a0833efb28a4915118bbdedd9f7683134121bff4b0f67bc75', '1736952561551bc78aa169d', 'user', '', '2015-04-16 09:20:49'),
(2, 'admin', 'a7d52eec82a95232b552b824d274e5b430347a74968f493797ce38f706b5721c', '1754208216553223338bcd3', 'admin', '', '2015-04-18 09:26:11');

INSERT INTO `suggestions` (`id`, `question`, `correct_answer`, `wrong1`, `wrong2`, `wrong3`, `image_url`, `ip`) VALUES
(1, 'Näidis suggestioni test?', 'Õige', 'Vale', 'Valem', 'Valedaim', 'http://i.imgur.com/jILe0oU.jpg', '127.0.0.1');
