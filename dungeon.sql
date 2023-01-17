-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: wtf_meuporgue
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `class` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_hp` int NOT NULL,
  `current_hp` int NOT NULL,
  `dex` int NOT NULL,
  `str` int NOT NULL,
  `intel` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `characters_user_id_foreign` (`user_id`),
  CONSTRAINT `characters_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,NULL,NULL,NULL,'Gobelin','Enemy',5,5,10,0,0,1),(2,NULL,NULL,NULL,'Orc','Enemy',10,10,0,10,0,1),(3,NULL,NULL,NULL,'Troll','Enemy',15,15,0,15,0,1),(4,NULL,NULL,NULL,'Sorcier','Enemy',15,15,0,0,15,1),(5,NULL,NULL,NULL,'Dragon Rouge','Enemy',40,40,0,30,10,1),(6,NULL,NULL,NULL,'Krom','Barbare',20,20,5,10,0,1),(7,NULL,NULL,NULL,'Malicia','Sorcière',15,15,5,0,15,1),(8,NULL,NULL,NULL,'Rat','Voleur',10,10,15,5,0,1);
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `hp` int NOT NULL,
  `dex` int NOT NULL,
  `str` int NOT NULL,
  `intel` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,NULL,NULL,'Barbare','Corps à corps','Malgré tout vos efforts, vous n\'êtes pas parvenu à repousser l\'assault de la horde de gobelin qui a ravagé votre village et avez dû vous résigner à fuir pour ne pas mourir. Selon votre religion, il est pourtant préférable de périr au combat que de survivre dans la honte. Hanté par le remord, vous chercez depuis un moyen de vous racheter auprès de vos ancètres. Peut-être que traverser ce donjon dont vous avez entendu parler lors de votre dernière escale serait une solution.',20,5,10,0),(2,NULL,NULL,'Voleur','Corps à corps','Vous avez passé votre vie à vous cacher tel un rat. Vous ne savez que piller, mentir, trahir. Mais vous a-t-on jamais vraiment laissé le choix ? Aujourd\'hui peut-être. Le bruit court qu\'un donjon est apparu, un donjon aux milles dangers et aux milles richesses. Que vous en réchappiez en héros ou simplement plein aux As, votre avenir ne pourra en être que différent... normalement.',10,15,5,0),(3,NULL,NULL,'Sorcière','Magie','Condamnée à mort pour sorcellerie, vous êtes parvenu à fuir la potence. Mais vos géoliers sont à vos trousses et il n\'est pas un village dans les environs qui accpetera d\'héberger une maîtresse des arcanes tel que vous. Mais il reste un espoir. Les esprits sombres vous ont parlé d\'un donjon, non loin d\'ici. Entre ces murs, personnes ne viendra vous chercher. Et qui sait, peut-être trouverez vous en son coeur une arme assez puissante pour faire définitevement passer à quiconque l\'envie de vous chasser ! ',15,5,0,15);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `character_id` bigint unsigned NOT NULL,
  `armor_id` bigint unsigned DEFAULT NULL,
  `armor_modifier` text COLLATE utf8mb4_unicode_ci,
  `weapon_id` bigint unsigned DEFAULT NULL,
  `weapon_modifier` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `equipment_character_id_foreign` (`character_id`),
  KEY `equipment_armor_id_foreign` (`armor_id`),
  KEY `equipment_weapon_id_foreign` (`weapon_id`),
  CONSTRAINT `equipment_armor_id_foreign` FOREIGN KEY (`armor_id`) REFERENCES `objects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipment_character_id_foreign` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipment_weapon_id_foreign` FOREIGN KEY (`weapon_id`) REFERENCES `objects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,NULL,NULL,6,NULL,NULL,NULL,NULL),(2,NULL,NULL,7,NULL,NULL,NULL,NULL),(3,NULL,NULL,8,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `script1` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `script2` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `script3` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,NULL,NULL,'fight1','Combat','Au détour d\'un couloir, vous appercevez une silhouette menaçante.','Vous vous approchez discrètement et reconnaissez un {{Enemy}}.','Votre arme à la main, vous bondissez sur votre adversaire, prêt à en découdre !'),(2,NULL,NULL,'fight2','Combat','Alors que vous venez à peine de franchir une porte, une main vous attrappe par l\'épaule et vous projette contre un mur.','Votre vue est brouillée par le choc mais vous parvenez à reconnaitre un {{Enemy}}.','Vous vous redressez, non sans mal, et vous mettez à courir vers votre adversaire, déterminé à lui faire regretter son geste !'),(3,NULL,NULL,'chest1','Coffre','Tronant au centre de la pièce dans laquelle vous venez d\'entrer, un coffre semble vous attendre.','En l\'examinant, vous constatez que sa serrure n\'est pas très solide... Un coup de pieds bien placé devrait règler cela.','Et voilà qui est fait, il ne reste plus rien du coffre mais ce qu\'il contenait est intact. Vous venez de découvrir {{Object}}.'),(4,NULL,NULL,'chest2','Coffre','Vous marchez à taton dans le noir depuis plusieurs mètres à présent... Tout à coup, vous trébuchez sur un object lourd ancré au sol.','Vous parvenez à vous rattraper de justesse et constatez que c\'est un coffre qui à failli avoir raison de vous...','Pour vous venger de cet affront (et aussi pour découvrir ce qu\'il contient), vous le martelez à coup de poings. Félicitations, vous venez de trouver {{Object}}.'),(5,NULL,NULL,'stranger1','Rencontre','Vous sentez un souffle glacial fouetter voter nuque. Vous vous retournez brusquement.','Là, devant vous, malgré l\'obscurité preque totale, une silhouette longiligne se dessine. Une silhouette qui s\'avance vers vous.','Alors que vous venez de vous emparer de votre arme, la lumière de votre torche révèle l\'identité de la silhouette. C\'est l\'Etranger. Il vous tend ses deux mains, paume vers le haut, en vous indiquant de choisir un objet.'),(6,NULL,NULL,'stranger2','Rencontre','Le couloir est peu à peu envahi de brume. Vous n\'arrivez plus à vous orienter. Une main se pose sur votre épaule.','Vous tentez de frapper dans la direction d\'où il vous semble que la main venait mais vous ne faite que brasser de l\'air.','Un clignement d\'oeil et la brume a disparu. L\'Etranger se dresse devant vous, son visage toujours masqué par son imposante capuche. Il vous demande de choisir entre deux objets.'),(7,NULL,NULL,'trap1','Piège','En entrant dans la salle, vous entendez un mécanisme s\'activer. Les murs se mettent à trembler.','En y regardant de plus près, vous les voyez se rapprocher dangereusement de vous. Vous tentez de ressortir de la pièce mais la porte est vérouillée. Si vous n\'agissez par rapidement, vous allez vous retrouver écraser...','Vous n\'avez vraiment d\'autres alternatives que la porte se trouvant de l\'autre côté de la pièce. Serez seulement assez rapide pour l\'atteindre ?');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historicals`
--

DROP TABLE IF EXISTS `historicals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historicals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint unsigned NOT NULL,
  `object_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `historicals_event_id_foreign` (`event_id`),
  KEY `historicals_object_id_foreign` (`object_id`),
  CONSTRAINT `historicals_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historicals_object_id_foreign` FOREIGN KEY (`object_id`) REFERENCES `objects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historicals`
--

LOCK TABLES `historicals` WRITE;
/*!40000 ALTER TABLE `historicals` DISABLE KEYS */;
/*!40000 ALTER TABLE `historicals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventories`
--

DROP TABLE IF EXISTS `inventories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `character_id` bigint unsigned NOT NULL,
  `object_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventories_character_id_foreign` (`character_id`),
  KEY `inventories_object_id_foreign` (`object_id`),
  CONSTRAINT `inventories_character_id_foreign` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventories_object_id_foreign` FOREIGN KEY (`object_id`) REFERENCES `objects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventories`
--

LOCK TABLES `inventories` WRITE;
/*!40000 ALTER TABLE `inventories` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2022_12_13_153357_create_characters_table',1),(6,'2022_12_13_153430_create_objects_table',1),(7,'2022_12_13_153444_create_classes_table',1),(8,'2022_12_13_153458_create_events_table',1),(9,'2022_12_13_153507_create_historicals_table',1),(10,'2022_12_13_154840_create_inventories_table',1),(11,'2022_12_21_134129_create_equipment_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `class` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `properties` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` VALUES (1,NULL,NULL,'Pomme verte','Consommable','Toutes','Une pomme... verte.','[\"curren_hp\", \"+\", 1]','une'),(2,NULL,NULL,'Pomme rouge','Consommable','Toutes','Comme une pomme verte... mais en rouge.','[\"curren_hp\", \"+\", 1]','une'),(3,NULL,NULL,'Baguette','Consommable','Toutes','Le meilleur met au monde.','[\"curren_hp\", \"+\", 2]','une'),(4,NULL,NULL,'Potion de vie','Consommable','Toutes','Une simple potion de soin.','[\"curren_hp\", \"+\", 4]','une'),(5,NULL,NULL,'Super potion de vie','Consommable','Toutes','Un peu mieux que la potion de base.','[\"curren_hp\", \"+\", 6]','une'),(6,NULL,NULL,'Mega potion de soin','Consommable','Toutes','Encore mieux que la super potion.','[\"curren_hp\", \"+\", 10]','une'),(7,NULL,NULL,'Poison','Consommable','Toutes','Pourquoi quelqu\'un boirait il cela ?','[\"curren_hp\", \"-\", 6]','un'),(8,NULL,NULL,'Cape de tissus','Armure','Toutes','C\'est mieux que rien...','[]','une'),(9,NULL,NULL,'Epée de bois','Arme','Corps à corps','Eventuellement ça peu vexer l\'adversaire.','[]','une'),(10,NULL,NULL,'Baton','Arme','Magie','Euh... Vous êtes sérieux là ?','[]','un'),(11,NULL,NULL,'Cotte de mailles','Armure','Corps à corps','Ok, ça commence à devenir intéressant.','[\"max_hp\", \"+\", 5]','une'),(12,NULL,NULL,'Armure de plates','Armure','Corps à corps','Une armure bien badass !!','[\"max_hp\", \"+\", 10','une'),(13,NULL,NULL,'Dague','Arme','Corps à corps','Un simple outil de voleur.','[\"dex\", \"+\", 2]','une'),(14,NULL,NULL,'Claymore','Arme','Corps à corps','Souvenir du château de Morne.','[\"str\", \"+\", 5]','une'),(15,NULL,NULL,'Grimoire','Arme','Magie','Un puissant recueil de sorts ancestraux.','[\"intel\", \"+\", 4]','un'),(16,NULL,NULL,'Robe d\'érudit','Armure','Magie','Un peu d\'élégance dans ce monde de brutes ne fait pas de mal.','[\"max_hp\", \"+\", 5]','une');
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@test.com','test','azerty',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-04  7:45:34
