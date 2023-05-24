CREATE DATABASE  IF NOT EXISTS `gamage_restaurant` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gamage_restaurant`;
-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: gamage_restaurant
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activitylog`
--

DROP TABLE IF EXISTS `activitylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dodate` datetime NOT NULL,
  `descriptin` text,
  `users_user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_activitylog_users1_idx` (`users_user_id`),
  CONSTRAINT `fk_activitylog_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylog`
--

LOCK TABLES `activitylog` WRITE;
/*!40000 ALTER TABLE `activitylog` DISABLE KEYS */;
/*!40000 ALTER TABLE `activitylog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `civilstatus`
--

DROP TABLE IF EXISTS `civilstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `civilstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `civilstatus`
--

LOCK TABLES `civilstatus` WRITE;
/*!40000 ALTER TABLE `civilstatus` DISABLE KEYS */;
INSERT INTO `civilstatus` VALUES (1,'Married');
/*!40000 ALTER TABLE `civilstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cpmethod`
--

DROP TABLE IF EXISTS `cpmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cpmethod` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cpmethod`
--

LOCK TABLES `cpmethod` WRITE;
/*!40000 ALTER TABLE `cpmethod` DISABLE KEYS */;
INSERT INTO `cpmethod` VALUES (1,'Cheque'),(2,'Cash'),(3,'Bank Deposit'),(4,'Money Transfer');
/*!40000 ALTER TABLE `cpmethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cpstatus`
--

DROP TABLE IF EXISTS `cpstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cpstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cpstatus`
--

LOCK TABLES `cpstatus` WRITE;
/*!40000 ALTER TABLE `cpstatus` DISABLE KEYS */;
INSERT INTO `cpstatus` VALUES (1,'Available'),(2,'Not-Available'),(3,'Deleted');
/*!40000 ALTER TABLE `cpstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `regno` char(10) NOT NULL,
  `fname` varchar(150) NOT NULL,
  `lname` varchar(150) NOT NULL,
  `mobileno` char(10) NOT NULL,
  `secondno` char(10) DEFAULT NULL,
  `nic` char(12) DEFAULT NULL,
  `address` text NOT NULL,
  `description` text,
  `addeddate` date NOT NULL,
  `customerstatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_customer_customerstatus1_idx` (`customerstatus_id`),
  KEY `fk_customer_employee1_idx` (`employee_id`),
  CONSTRAINT `fk_customer_customerstatus1` FOREIGN KEY (`customerstatus_id`) REFERENCES `customerstatus` (`id`),
  CONSTRAINT `fk_customer_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'C0000001','Sunil','Dahanayaka','0710660082','0712547895','967751979V','23/90 ,Hokandara Road,Malambe',NULL,'2021-08-01',3,1),(2,'C0000002','Shantha','Siriwardana','0773419789','0710660082','967156464V','Kaduwela Road.Malambe',NULL,'2021-09-13',4,1),(3,'C0000003','Nishantha','Silva','0715561282','0773419788','914579569V','\"Nishantha\",Battaramulla North,Battaramulla',NULL,'2021-09-13',2,1),(4,'C0000004','Amila','Dissanayaka','0768354409','0768354405','564789546V','13/70B ,Battaramulla',NULL,'2021-09-13',4,1),(5,'C0000005','Aruna','Perera','0715489745','0754896545','752589357V','Matara',NULL,'2021-09-23',3,1),(6,'C0000006','Ajantha','Weerasinghe','0716432145',NULL,'814571169V','Matara',NULL,'2022-05-20',1,1),(7,'C0000007','Gamini','Batagoda','0712222548',NULL,'874571169V','Hokandara',NULL,'2022-05-28',1,2),(8,'C0000008','Nipun','Gamage','0745421365',NULL,'914579569V','Colombo',NULL,'2022-05-28',4,3),(9,'C0000009','Aruna','Nuwanika','0715489777',NULL,'752589457V','Matara',NULL,'2022-05-28',1,3),(10,'C0000010','Sanduni','Siriwardana','0715561282',NULL,'914579569V','Kaduwela Road.Malambe',NULL,'2022-05-28',1,2),(11,'C0000011','Kasun','Shantha','0715489745',NULL,'752589357V','Matara',NULL,'2022-05-28',1,2),(12,'C0000012','Nishantha','Silva','0710660082',NULL,'914579569V','\"Nishantha\",Battaramulla North,Battaramulla',NULL,'2022-05-28',1,3),(13,'C0000013','Aruna','Shantha','0715489745','0754896545','914579569V','Matara',NULL,'2022-05-28',1,2),(14,'C0000014','Aruna','Saman','0715489745',NULL,'752589357V','Matara',NULL,'2022-05-28',1,2),(15,'C0000015','Shantha','Siriwardana','0768354409',NULL,'914579569V','Kaduwela Road.Malambe',NULL,'2022-05-28',1,2),(16,'C0000016','Shantha','Siriwardana','0715489745',NULL,'914579569V','Kaduwela Road.Malambe',NULL,'2022-05-28',1,2),(17,'C0000017','Acb','Nuwanika','0716432145',NULL,'914579569V','Matara',NULL,'2022-05-28',1,2),(18,'C0000018','Dasuni','Nuwanika','0715489745','0710660082','814571169V','Matara',NULL,'2022-11-04',1,2);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerpayment`
--

DROP TABLE IF EXISTS `customerpayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerpayment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `billno` char(10) NOT NULL,
  `reservationamount` decimal(10,2) NOT NULL,
  `currentamount` decimal(10,2) NOT NULL,
  `paidamount` decimal(10,2) NOT NULL,
  `balanceamount` varchar(45) NOT NULL,
  `paiddatetime` datetime NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `depositeddatetime` datetime DEFAULT NULL,
  `remark` text,
  `transferid` varchar(45) DEFAULT NULL,
  `bankname` varchar(45) DEFAULT NULL,
  `transferaccname` varchar(150) DEFAULT NULL,
  `cpmethod_id` int NOT NULL,
  `cpstatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `reservation_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_customerpayment_cp_method1_idx` (`cpmethod_id`),
  KEY `fk_customerpayment_cp_status1_idx` (`cpstatus_id`),
  KEY `fk_customerpayment_employee1_idx` (`employee_id`),
  KEY `fk_customerpayment_reservation1_idx` (`reservation_id`),
  CONSTRAINT `fk_customerpayment_cp_method1` FOREIGN KEY (`cpmethod_id`) REFERENCES `cpmethod` (`id`),
  CONSTRAINT `fk_customerpayment_cp_status1` FOREIGN KEY (`cpstatus_id`) REFERENCES `cpstatus` (`id`),
  CONSTRAINT `fk_customerpayment_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_customerpayment_reservation1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerpayment`
--

LOCK TABLES `customerpayment` WRITE;
/*!40000 ALTER TABLE `customerpayment` DISABLE KEYS */;
INSERT INTO `customerpayment` VALUES (1,'CP000001',100.00,1000.00,800.00,'200','2022-05-02 12:18:00',NULL,NULL,NULL,NULL,NULL,NULL,1,3,1,1),(2,'CP000002',102.00,1000.00,100.00,'103.00','2022-05-26 23:06:58',NULL,'2022-05-27 23:07:00',NULL,NULL,NULL,NULL,1,1,1,21),(3,'CP000003',103.00,1000.00,100.00,'100','2022-05-26 23:11:46',NULL,'2022-05-06 23:11:00',NULL,NULL,NULL,NULL,2,3,1,1),(4,'CP000004',500.00,500.00,500.00,'105.00','2022-05-26 23:16:36',NULL,'2022-05-14 23:17:00',NULL,NULL,NULL,NULL,2,1,1,21),(5,'CP000005',102.00,1000.00,500.00,'104.00','2022-05-26 23:42:53',NULL,'2022-05-06 23:43:00',NULL,NULL,NULL,NULL,1,1,1,22),(6,'CP000006',105.00,1000.00,800.00,'102.00','2022-05-28 18:36:51',NULL,'2022-05-21 22:42:00',NULL,NULL,NULL,NULL,1,1,2,31);
/*!40000 ALTER TABLE `customerpayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerstatus`
--

DROP TABLE IF EXISTS `customerstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerstatus`
--

LOCK TABLES `customerstatus` WRITE;
/*!40000 ALTER TABLE `customerstatus` DISABLE KEYS */;
INSERT INTO `customerstatus` VALUES (1,'New'),(2,'Raguler'),(3,'In-Active'),(4,'Deleted');
/*!40000 ALTER TABLE `customerstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailyremove`
--

DROP TABLE IF EXISTS `dailyremove`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dailyremove` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dailyremovecode` char(10) NOT NULL,
  `material_id` int NOT NULL,
  `removeqty` decimal(5,2) NOT NULL,
  `removereason_id` int NOT NULL,
  `dailyremovedate` date NOT NULL,
  `description` text,
  `dailyremovestatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dailyremove_removereason1_idx` (`removereason_id`),
  KEY `fk_dailyremove_dailyremovestatus1_idx` (`dailyremovestatus_id`),
  KEY `fk_dailyremove_material1_idx` (`material_id`),
  KEY `fk_dailyremove_employee1_idx` (`employee_id`),
  CONSTRAINT `fk_dailyremove_dailyremovestatus1` FOREIGN KEY (`dailyremovestatus_id`) REFERENCES `dailyremovestatus` (`id`),
  CONSTRAINT `fk_dailyremove_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_dailyremove_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  CONSTRAINT `fk_dailyremove_removereason1` FOREIGN KEY (`removereason_id`) REFERENCES `removereason` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailyremove`
--

LOCK TABLES `dailyremove` WRITE;
/*!40000 ALTER TABLE `dailyremove` DISABLE KEYS */;
INSERT INTO `dailyremove` VALUES (1,'MDR0000001',1,400.00,2,'2021-02-12',NULL,3,0),(2,'MDR0000002',3,200.00,2,'2021-11-09','',1,0),(3,'MDR0000003',2,150.00,2,'2021-11-10',NULL,1,0),(4,'MDR0000004',2,150.00,2,'2021-11-19','',1,0),(5,'MDR0000005',2,200.00,1,'2021-12-24',NULL,3,0);
/*!40000 ALTER TABLE `dailyremove` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailyremovestatus`
--

DROP TABLE IF EXISTS `dailyremovestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dailyremovestatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailyremovestatus`
--

LOCK TABLES `dailyremovestatus` WRITE;
/*!40000 ALTER TABLE `dailyremovestatus` DISABLE KEYS */;
INSERT INTO `dailyremovestatus` VALUES (1,'Available'),(2,'Not Available'),(3,'Deleted');
/*!40000 ALTER TABLE `dailyremovestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designation`
--

LOCK TABLES `designation` WRITE;
/*!40000 ALTER TABLE `designation` DISABLE KEYS */;
INSERT INTO `designation` VALUES (1,'Admin'),(2,'Manager'),(3,'Cashier'),(4,'Asistant manager');
/*!40000 ALTER TABLE `designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` char(6) NOT NULL,
  `callingname` varchar(100) NOT NULL,
  `fullname` varchar(225) NOT NULL,
  `nic` char(12) NOT NULL,
  `dob` date DEFAULT NULL,
  `mobile` char(10) NOT NULL,
  `land` char(10) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `addeddate_time` datetime DEFAULT NULL,
  `employeestatus_id` int NOT NULL,
  `civilstatus_id` int NOT NULL,
  `designation_id` int NOT NULL,
  `gender` varchar(45) NOT NULL,
  `last_update_date_time` datetime DEFAULT NULL,
  `delete_date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number_UNIQUE` (`number`),
  UNIQUE KEY `nic_UNIQUE` (`nic`),
  KEY `fk_employee_employeestatus1_idx` (`employeestatus_id`),
  KEY `fk_employee_civilstatus1_idx` (`civilstatus_id`),
  KEY `fk_employee_designation1_idx` (`designation_id`),
  CONSTRAINT `fk_employee_civilstatus1` FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus` (`id`),
  CONSTRAINT `fk_employee_designation1` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`id`),
  CONSTRAINT `fk_employee_employeestatus1` FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'E00002','Admin','Admisistration','6645698715V','1966-03-13','0717485964','0112754896','','2021-01-01 00:00:00',1,1,1,'1',NULL,NULL),(2,'E00001','Wasantha','Wasantha Kumara','8065472135V','1980-05-04','0754235412',NULL,'','2021-01-01 00:00:00',1,1,2,'1',NULL,NULL),(3,'E00003','Ransara','Hasitha Ransara','9947895425V','1999-05-23','0753214587','0415789654','','2021-01-01 00:00:00',1,1,3,'1',NULL,NULL),(4,'220001','Tharana','Tharanga Darshani','967751979V','1996-09-29','0773419789','0112762559','','2022-05-28 00:00:00',1,1,4,'2',NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employeestatus`
--

DROP TABLE IF EXISTS `employeestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeestatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeestatus`
--

LOCK TABLES `employeestatus` WRITE;
/*!40000 ALTER TABLE `employeestatus` DISABLE KEYS */;
INSERT INTO `employeestatus` VALUES (1,'Working'),(2,'Resign'),(3,'Deleted');
/*!40000 ALTER TABLE `employeestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grn`
--

DROP TABLE IF EXISTS `grn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grncode` char(10) NOT NULL,
  `supplierinvoiceno` char(45) NOT NULL,
  `receiveddate` date NOT NULL,
  `totalamount` decimal(10,0) NOT NULL,
  `discountratio` decimal(10,0) NOT NULL,
  `nettotal` decimal(10,0) NOT NULL,
  `addeddate` date NOT NULL,
  `description` text,
  `grnstatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `porder_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grn_grnstatus1_idx` (`grnstatus_id`),
  KEY `fk_grn_employee1_idx` (`employee_id`),
  KEY `fk_grn_porder1_idx` (`porder_id`),
  CONSTRAINT `fk_grn_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_grn_grnstatus1` FOREIGN KEY (`grnstatus_id`) REFERENCES `grnstatus` (`id`),
  CONSTRAINT `fk_grn_porder1` FOREIGN KEY (`porder_id`) REFERENCES `porder` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grn`
--

LOCK TABLES `grn` WRITE;
/*!40000 ALTER TABLE `grn` DISABLE KEYS */;
INSERT INTO `grn` VALUES (1,'GRN000001','1','2021-06-05',1000,10,100,'2021-06-25',NULL,3,1,1),(8,'GRN000002','10','2021-12-11',100,10,10,'2021-12-23',NULL,1,1,7),(9,'GRN000003','11','2021-12-14',100,10,10,'2021-12-23',NULL,1,1,7),(13,'GRN000004','10','2021-12-21',0,0,0,'2021-12-30',NULL,1,1,7),(14,'SGRN000005','123','2022-05-18',200,0,0,'2022-05-28',NULL,1,1,1);
/*!40000 ALTER TABLE `grn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grn_has_material`
--

DROP TABLE IF EXISTS `grn_has_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grn_has_material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grn_id` int NOT NULL,
  `purchaseprice` decimal(10,0) NOT NULL,
  `material_id` int NOT NULL,
  `qty` decimal(10,0) DEFAULT NULL,
  `linetotal` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grn_has_material_material1_idx` (`material_id`),
  KEY `fk_grn_has_material_grn1_idx` (`grn_id`),
  CONSTRAINT `fk_grn_has_material_grn1` FOREIGN KEY (`grn_id`) REFERENCES `grn` (`id`),
  CONSTRAINT `fk_grn_has_material_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grn_has_material`
--

LOCK TABLES `grn_has_material` WRITE;
/*!40000 ALTER TABLE `grn_has_material` DISABLE KEYS */;
INSERT INTO `grn_has_material` VALUES (1,1,1,1,100,10),(2,8,100,2,100,100),(3,9,100,2,100,100),(4,13,100,2,100,100),(5,14,100,1,2,200);
/*!40000 ALTER TABLE `grn_has_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grnstatus`
--

DROP TABLE IF EXISTS `grnstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grnstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grnstatus`
--

LOCK TABLES `grnstatus` WRITE;
/*!40000 ALTER TABLE `grnstatus` DISABLE KEYS */;
INSERT INTO `grnstatus` VALUES (1,'Pending'),(2,'Completed'),(3,'Deleted');
/*!40000 ALTER TABLE `grnstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hibernate_sequence`
--

DROP TABLE IF EXISTS `hibernate_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence` DISABLE KEYS */;
INSERT INTO `hibernate_sequence` VALUES (5),(5),(5),(5),(5),(5),(5),(5),(5),(5),(5),(5),(5),(5);
/*!40000 ALTER TABLE `hibernate_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventorystatus`
--

DROP TABLE IF EXISTS `inventorystatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventorystatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventorystatus`
--

LOCK TABLES `inventorystatus` WRITE;
/*!40000 ALTER TABLE `inventorystatus` DISABLE KEYS */;
INSERT INTO `inventorystatus` VALUES (1,'Available'),(2,'Not-Available'),(3,'Low Inventory');
/*!40000 ALTER TABLE `inventorystatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `materialcode` char(10) NOT NULL,
  `materialname` varchar(150) NOT NULL,
  `unitsize` int NOT NULL,
  `addeddate` date NOT NULL,
  `description` text,
  `materialstatus_id` int NOT NULL,
  `materialcategory_id` int NOT NULL,
  `unittype_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_material_materialstatus1_idx` (`materialstatus_id`),
  KEY `fk_material_materialcategory1_idx` (`materialcategory_id`),
  KEY `fk_material_unittype1_idx` (`unittype_id`),
  CONSTRAINT `fk_material_materialcategory1` FOREIGN KEY (`materialcategory_id`) REFERENCES `materialcategory` (`id`),
  CONSTRAINT `fk_material_materialstatus1` FOREIGN KEY (`materialstatus_id`) REFERENCES `materialstatus` (`id`),
  CONSTRAINT `fk_material_unittype1` FOREIGN KEY (`unittype_id`) REFERENCES `unittype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (1,'M0000001','Basamathi Rice 1 KG',1,'2021-09-15',NULL,1,2,1),(2,'M0000002','Chili powder 1 KG',1,'2021-09-28',NULL,3,3,1),(3,'M0000003','Beans 1 KG',1,'2021-10-04',NULL,3,1,1),(4,'M0000004','Rathu Kekulu 1 KG',1,'2021-10-04',NULL,3,3,1),(5,'M0000005','Salt 1 KG',1,'2021-10-06','',3,3,1),(6,'M0000006','Samba 1Kg',1,'2021-12-30',NULL,1,7,1),(7,'M0000007','Mango 1 Kg',2,'2022-05-07',NULL,3,2,1),(8,'M0000008','Tuna 1 Kg',1,'2022-05-10',NULL,1,4,1),(9,'M0000009','Chicken 1 Kg',1,'2022-05-10',NULL,1,5,1),(10,'M0000010','Thosai flour 1 Kg',1,'2022-05-10',NULL,1,6,1),(11,'M0000011','Coconut 50 Pieces',50,'2022-05-10',NULL,1,9,3),(12,'M0000012','Cabbage 10 Kg',10,'2022-05-10',NULL,1,1,1),(13,'M0000013','Carrot 10 Kg',10,'2022-05-10',NULL,1,1,1),(14,'M0000014','Leeks 5 Kg',5,'2022-05-10',NULL,1,1,1),(15,'M0000015','Lattuce 2 Kg',2,'2022-05-10',NULL,1,1,1),(16,'M0000016','Red Paper 1 Kg',1,'2022-05-10',NULL,1,1,1),(17,'M0000017','Sweet corn 2 Kg',2,'2022-05-10',NULL,1,1,1),(18,'M0000018','Mushroom 20 Kg',20,'2022-05-10',NULL,1,1,1),(19,'M0000019','onion 1Kg',1,'2022-05-10',NULL,1,1,1),(20,'M0000020','Tomato 1 Kg',1,'2022-05-10',NULL,1,1,1),(21,'M0000021','Potato 1 Kg',1,'2022-05-10',NULL,1,1,1),(22,'M0000022','Green peper 1 Kg',1,'2022-05-10',NULL,1,1,1),(23,'M0000023','Bell pepper 1 Kg',1,'2022-05-10',NULL,1,1,1),(24,'M0000024','Garlic 1 Kg',1,'2022-05-10',NULL,1,3,1),(25,'M0000025','Cucumber 1 Kg',1,'2022-05-10',NULL,2,1,1),(26,'M0000026','Ginger 1g',1,'2022-05-10',NULL,1,1,2),(27,'M0000027','White Egg 36 Pieces',1,'2022-05-10',NULL,1,9,3),(28,'M0000028','Red Egg',1,'2022-05-10',NULL,1,9,3),(29,'M0000029','Darhl',1,'2022-05-11','',1,11,1);
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materialcategory`
--

DROP TABLE IF EXISTS `materialcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materialcategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materialcategory`
--

LOCK TABLES `materialcategory` WRITE;
/*!40000 ALTER TABLE `materialcategory` DISABLE KEYS */;
INSERT INTO `materialcategory` VALUES (1,'Vegetables'),(2,'Fruits'),(3,'Spices'),(4,'Fish'),(5,'Meats'),(6,'flour'),(7,'Rice'),(8,'Noodles'),(9,'Egg'),(10,'Other'),(11,'Darhl');
/*!40000 ALTER TABLE `materialcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materialinventory`
--

DROP TABLE IF EXISTS `materialinventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materialinventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `avaqty` decimal(10,0) NOT NULL,
  `totalqty` decimal(10,0) NOT NULL,
  `inventorystatus_id` int NOT NULL,
  `material_id` int NOT NULL,
  `removeqty` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_materialinventory_inventorystatus1_idx` (`inventorystatus_id`),
  KEY `fk_materialinventory_material1_idx` (`material_id`),
  CONSTRAINT `fk_materialinventory_inventorystatus1` FOREIGN KEY (`inventorystatus_id`) REFERENCES `inventorystatus` (`id`),
  CONSTRAINT `fk_materialinventory_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materialinventory`
--

LOCK TABLES `materialinventory` WRITE;
/*!40000 ALTER TABLE `materialinventory` DISABLE KEYS */;
INSERT INTO `materialinventory` VALUES (1,50,100,3,4,50),(2,50,100,1,1,50),(3,60,100,1,5,50),(4,70,120,1,2,50);
/*!40000 ALTER TABLE `materialinventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materialstatus`
--

DROP TABLE IF EXISTS `materialstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materialstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materialstatus`
--

LOCK TABLES `materialstatus` WRITE;
/*!40000 ALTER TABLE `materialstatus` DISABLE KEYS */;
INSERT INTO `materialstatus` VALUES (1,'Available'),(2,'Not- Available'),(3,'Deleted');
/*!40000 ALTER TABLE `materialstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menucode` char(10) NOT NULL,
  `menuname` varchar(150) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `addeddate` date NOT NULL,
  `description` text,
  `menustatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `menucategory_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_menu_menustatus1_idx` (`menustatus_id`),
  KEY `fk_menu_menu_category1_idx` (`menucategory_id`),
  CONSTRAINT `fk_menu_menu_category1` FOREIGN KEY (`menucategory_id`) REFERENCES `menucategory` (`id`),
  CONSTRAINT `fk_menu_menustatus1` FOREIGN KEY (`menustatus_id`) REFERENCES `menustatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'MC000001','Menu1',950.00,'2022-02-02',NULL,1,1,2),(4,'MC000002','Menu2',950.00,'2022-02-10',NULL,1,1,3),(5,'MC000003','Menu3',850.00,'2022-02-10',NULL,1,1,2),(6,'MC000004','Menu4',850.00,'2022-02-10',NULL,3,1,3),(8,'MC000005','Menu5',700.00,'2022-02-10',NULL,1,1,2),(9,'MC000006','Menu6',700.00,'2022-02-10',NULL,2,1,3),(10,'MC000007','Menu7',600.00,'2022-02-10',NULL,1,1,2),(11,'MC000008','Menu8',600.00,'2022-02-10',NULL,1,1,3),(12,'MC000009','Menu9',520.00,'2022-02-10',NULL,1,1,2),(13,'MC000010','Menu10',520.00,'2022-02-10',NULL,1,1,3),(27,'MC000011','Menu11',500.00,'2022-05-26',NULL,1,1,1),(28,'MC000012','Menu12',510.00,'2022-05-26',NULL,1,2,1),(29,'MC000013','Menu13',500.00,'2022-05-26',NULL,1,1,1),(33,'MC000014','Menu19',700.00,'2022-05-26',NULL,1,1,1);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_has_submenu`
--

DROP TABLE IF EXISTS `menu_has_submenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_has_submenu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NOT NULL,
  `submenu_id` int NOT NULL,
  `submenucategory_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_menu_has_submenu_submenu1_idx` (`submenu_id`),
  KEY `fk_menu_has_submenu_menu1_idx` (`menu_id`),
  KEY `fk_menu_has_submenu_submenucategory1_idx` (`submenucategory_id`),
  CONSTRAINT `fk_menu_has_submenu_menu1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `fk_menu_has_submenu_submenu1` FOREIGN KEY (`submenu_id`) REFERENCES `submenu` (`id`),
  CONSTRAINT `fk_menu_has_submenu_submenucategory1` FOREIGN KEY (`submenucategory_id`) REFERENCES `submenucategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_has_submenu`
--

LOCK TABLES `menu_has_submenu` WRITE;
/*!40000 ALTER TABLE `menu_has_submenu` DISABLE KEYS */;
INSERT INTO `menu_has_submenu` VALUES (1,1,7,1),(15,33,43,3);
/*!40000 ALTER TABLE `menu_has_submenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menucategory`
--

DROP TABLE IF EXISTS `menucategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menucategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menucategory`
--

LOCK TABLES `menucategory` WRITE;
/*!40000 ALTER TABLE `menucategory` DISABLE KEYS */;
INSERT INTO `menucategory` VALUES (1,'Breakfast'),(2,'Lunch'),(3,'Dinner');
/*!40000 ALTER TABLE `menucategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menustatus`
--

DROP TABLE IF EXISTS `menustatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menustatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menustatus`
--

LOCK TABLES `menustatus` WRITE;
/*!40000 ALTER TABLE `menustatus` DISABLE KEYS */;
INSERT INTO `menustatus` VALUES (1,'Available'),(2,'Not Available'),(3,'Deleted');
/*!40000 ALTER TABLE `menustatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'EMPLOYEE'),(2,'USER'),(3,'PRIVILAGE'),(4,'CUSTOMER'),(5,'MATERIAL'),(6,'SUPPLIER'),(7,'QUOTATIONREQUEST'),(8,'DAILYREMOVE'),(9,'MATERIALINVENTORY'),(10,'QUOTATION'),(11,'PORDER'),(12,'GRN'),(13,'SPAYMENT'),(14,'SUBMENU'),(15,'RESERVATION'),(16,'CUSTOMERPAYMENTS'),(17,'TABLEALLOWCATION'),(18,'MENU');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentmethod`
--

DROP TABLE IF EXISTS `paymentmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethod` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmethod`
--

LOCK TABLES `paymentmethod` WRITE;
/*!40000 ALTER TABLE `paymentmethod` DISABLE KEYS */;
INSERT INTO `paymentmethod` VALUES (1,'Cheque'),(2,'Cash'),(3,'Bank Deposit'),(4,'Money Transfer');
/*!40000 ALTER TABLE `paymentmethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentstatus`
--

DROP TABLE IF EXISTS `paymentstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentstatus`
--

LOCK TABLES `paymentstatus` WRITE;
/*!40000 ALTER TABLE `paymentstatus` DISABLE KEYS */;
INSERT INTO `paymentstatus` VALUES (1,'Available'),(2,'Not Available'),(3,'Deleted');
/*!40000 ALTER TABLE `paymentstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `porder`
--

DROP TABLE IF EXISTS `porder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `porder` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pordercode` char(10) NOT NULL,
  `supplier_id` int NOT NULL,
  `quotation_id` int NOT NULL,
  `requireddate` date NOT NULL,
  `totalamount` decimal(10,0) NOT NULL,
  `addeddate` date NOT NULL,
  `porderstatus_id` int NOT NULL,
  `description` text,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_porder_supplier1_idx` (`supplier_id`),
  KEY `fk_porder_employee1_idx` (`employee_id`),
  KEY `fk_porder_porderstatus1_idx` (`porderstatus_id`),
  KEY `fk_porder_quotation1_idx` (`quotation_id`),
  CONSTRAINT `fk_porder_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_porder_porderstatus1` FOREIGN KEY (`porderstatus_id`) REFERENCES `porderstatus` (`id`),
  CONSTRAINT `fk_porder_quotation1` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`),
  CONSTRAINT `fk_porder_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `porder`
--

LOCK TABLES `porder` WRITE;
/*!40000 ALTER TABLE `porder` DISABLE KEYS */;
INSERT INTO `porder` VALUES (1,'P000000005',1,1,'2021-12-12',100,'2021-12-01',5,NULL,1),(7,'P000000001',2,1,'2021-12-11',100,'2021-12-16',3,NULL,1),(8,'P000000002',3,3,'2021-12-10',100,'2021-12-16',1,NULL,1),(9,'P000000003',4,3,'2021-11-30',100,'2021-12-16',1,NULL,1),(10,'P000000004',5,10,'2022-05-25',8000,'2022-05-24',1,NULL,1);
/*!40000 ALTER TABLE `porder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `porder_has_material`
--

DROP TABLE IF EXISTS `porder_has_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `porder_has_material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `porder_id` int NOT NULL,
  `material_id` int NOT NULL,
  `purchaseprice` decimal(10,0) NOT NULL,
  `qty` decimal(10,0) NOT NULL,
  `linetotal` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_porder_has_material_material1_idx` (`material_id`),
  KEY `fk_porder_has_material_porder1_idx` (`porder_id`),
  CONSTRAINT `fk_porder_has_material_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  CONSTRAINT `fk_porder_has_material_porder1` FOREIGN KEY (`porder_id`) REFERENCES `porder` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `porder_has_material`
--

LOCK TABLES `porder_has_material` WRITE;
/*!40000 ALTER TABLE `porder_has_material` DISABLE KEYS */;
INSERT INTO `porder_has_material` VALUES (1,1,1,100,100,100),(2,7,2,100,100,100),(3,8,2,200,100,300),(4,9,2,100,100,100),(5,10,9,1000,2,2000),(6,10,11,1000,5,5000),(7,10,18,1000,1,1000);
/*!40000 ALTER TABLE `porder_has_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `porderstatus`
--

DROP TABLE IF EXISTS `porderstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `porderstatus` (
  `id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `porderstatus`
--

LOCK TABLES `porderstatus` WRITE;
/*!40000 ALTER TABLE `porderstatus` DISABLE KEYS */;
INSERT INTO `porderstatus` VALUES (1,'Ordered'),(2,'Completed'),(3,'Deleted'),(4,'Cancelled'),(5,'Received');
/*!40000 ALTER TABLE `porderstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privilage`
--

DROP TABLE IF EXISTS `privilage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roles_role_id` int NOT NULL,
  `module_id` int NOT NULL,
  `sel` int DEFAULT NULL,
  `ins` int DEFAULT NULL,
  `upd` int DEFAULT NULL,
  `del` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_privilage_module1_idx` (`module_id`),
  KEY `fk_privilage_roles1_idx` (`roles_role_id`),
  CONSTRAINT `fk_privilage_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `fk_privilage_roles1` FOREIGN KEY (`roles_role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privilage`
--

LOCK TABLES `privilage` WRITE;
/*!40000 ALTER TABLE `privilage` DISABLE KEYS */;
INSERT INTO `privilage` VALUES (1,2,1,1,1,1,1),(2,2,2,1,1,1,1),(3,2,3,1,1,1,1),(4,3,1,1,1,1,1),(5,3,2,1,1,1,1),(6,3,3,1,1,1,1),(9,3,4,1,1,1,1),(10,3,5,0,0,0,0),(11,3,6,0,0,0,0),(12,3,7,0,0,0,0),(13,3,8,0,0,0,0),(14,3,9,1,1,1,1),(15,3,10,1,1,0,0),(16,3,11,0,0,0,0),(17,3,12,1,1,0,0),(18,3,13,0,0,0,0),(19,3,14,1,0,0,0),(20,3,15,0,0,0,0),(21,3,16,1,1,0,0),(22,3,17,1,1,0,0),(23,3,18,0,0,0,0),(24,2,4,1,1,1,1),(25,2,5,1,1,1,1),(26,2,6,1,1,1,1),(27,2,7,1,1,1,1),(28,2,8,1,1,1,1),(29,2,9,1,1,1,1),(30,2,10,1,1,1,1),(31,2,11,1,1,1,1),(32,2,12,1,1,1,1),(33,2,13,1,1,1,1),(34,2,14,1,1,1,1),(35,2,15,1,1,1,1),(36,2,16,1,1,1,1),(38,2,18,1,1,1,1),(39,2,17,1,1,1,1),(40,2,16,1,1,1,1),(59,5,1,1,1,0,0),(70,5,2,1,1,0,0),(71,5,3,1,1,0,0),(72,5,5,1,1,0,0),(73,5,6,1,1,0,0),(74,5,7,1,1,0,0),(75,5,8,1,1,0,0),(76,5,9,1,1,0,0),(77,5,10,1,1,0,0),(78,5,11,1,1,0,0),(79,5,12,1,1,0,0),(80,5,13,1,1,0,0),(81,5,14,1,1,0,0),(82,5,15,1,1,0,0),(83,5,16,1,1,0,0),(84,5,17,1,1,0,0),(85,5,18,1,1,0,0);
/*!40000 ALTER TABLE `privilage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qrstatus`
--

DROP TABLE IF EXISTS `qrstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qrstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qrstatus`
--

LOCK TABLES `qrstatus` WRITE;
/*!40000 ALTER TABLE `qrstatus` DISABLE KEYS */;
INSERT INTO `qrstatus` VALUES (1,'Requested'),(2,'Received'),(3,'Deleted'),(4,'Cancelled');
/*!40000 ALTER TABLE `qrstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation`
--

DROP TABLE IF EXISTS `quotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quotationcode` char(10) NOT NULL,
  `receiveddate` date NOT NULL,
  `validfrom` date NOT NULL,
  `validto` date NOT NULL,
  `description` text,
  `addeddate` date NOT NULL,
  `quotationstatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `quotationrequest_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quotation_quotationstatus1_idx` (`quotationstatus_id`),
  KEY `fk_quotation_employee1_idx` (`employee_id`),
  KEY `fk_quotation_quotationrequest1_idx` (`quotationrequest_id`),
  CONSTRAINT `fk_quotation_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_quotation_quotationrequest1` FOREIGN KEY (`quotationrequest_id`) REFERENCES `quotationrequest` (`id`),
  CONSTRAINT `fk_quotation_quotationstatus1` FOREIGN KEY (`quotationstatus_id`) REFERENCES `quotationstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation`
--

LOCK TABLES `quotation` WRITE;
/*!40000 ALTER TABLE `quotation` DISABLE KEYS */;
INSERT INTO `quotation` VALUES (1,'Q000000001','2021-02-10','2021-03-12','2021-09-14',NULL,'2021-06-02',1,1,1),(3,'Q000000002','2021-12-22','2021-12-09','2021-12-15',NULL,'2021-12-12',1,1,1),(4,'Q000000003','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,2),(5,'Q000000004','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,3),(6,'Q000000005','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,2),(7,'Q000000006','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,1),(8,'Q000000007','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,2),(9,'Q000000008','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,1),(10,'Q000000009','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,1),(11,'Q000000010','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,1),(12,'Q000000011','2022-05-20','2022-05-10','2022-05-30',NULL,'2021-06-19',1,1,2);
/*!40000 ALTER TABLE `quotation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_has_material`
--

DROP TABLE IF EXISTS `quotation_has_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation_has_material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quotation_id` int NOT NULL,
  `material_id` int NOT NULL,
  `purchaseprice` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quotation_has_material_quotation1_idx` (`quotation_id`),
  KEY `fk_quotation_has_material_material1_idx` (`material_id`),
  CONSTRAINT `fk_quotation_has_material_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  CONSTRAINT `fk_quotation_has_material_quotation1` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_has_material`
--

LOCK TABLES `quotation_has_material` WRITE;
/*!40000 ALTER TABLE `quotation_has_material` DISABLE KEYS */;
INSERT INTO `quotation_has_material` VALUES (1,1,1,1000),(2,4,3,100),(3,3,2,1000),(29,1,4,1000),(30,3,5,1000),(31,1,6,1000),(32,5,7,1000),(33,6,8,1000),(34,7,9,1000),(35,8,10,1000),(36,9,11,1000),(37,4,12,1000),(38,4,13,1000),(39,4,14,1000),(40,4,15,1000),(41,4,16,1000),(42,4,17,1000),(43,10,18,1000),(44,11,19,1000),(45,4,20,1000),(46,11,21,1000),(47,4,22,1000),(48,4,23,1000),(49,4,24,1000),(50,4,25,1000),(51,4,26,1000),(52,12,27,1000),(53,12,28,1000);
/*!40000 ALTER TABLE `quotation_has_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotationrequest`
--

DROP TABLE IF EXISTS `quotationrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotationrequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qrcode` char(10) NOT NULL,
  `requireddate` date NOT NULL,
  `addeddate` date NOT NULL,
  `description` text,
  `qrstatus_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quotationrequest_qrstatus1_idx` (`qrstatus_id`),
  KEY `fk_quotationrequest_employee1_idx` (`employee_id`),
  KEY `fk_quotationrequest_supplier1_idx` (`supplier_id`),
  CONSTRAINT `fk_quotationrequest_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_quotationrequest_qrstatus1` FOREIGN KEY (`qrstatus_id`) REFERENCES `qrstatus` (`id`),
  CONSTRAINT `fk_quotationrequest_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotationrequest`
--

LOCK TABLES `quotationrequest` WRITE;
/*!40000 ALTER TABLE `quotationrequest` DISABLE KEYS */;
INSERT INTO `quotationrequest` VALUES (1,'QR00000001','2021-11-20','2021-10-10',NULL,1,1,1),(2,'QR00000002','2021-10-13','2021-11-17',NULL,3,1,1),(3,'QR00000003','2021-10-12','2021-11-23',NULL,1,1,2),(4,'QR00000004','2021-11-12','2021-11-23',NULL,1,1,2),(5,'QR00000005','2021-12-30','2021-12-11',NULL,1,1,3),(8,'QR00000006','2022-05-30','2022-05-10',NULL,1,1,3),(10,'QR00000007','2022-06-05','2022-05-12',NULL,1,1,7),(27,'QR00000008','2022-06-05','2022-05-12',NULL,1,1,3),(28,'QR00000009','2022-06-05','2022-05-12',NULL,2,1,5),(29,'QR00000010','2022-06-05','2022-05-12',NULL,1,1,6),(30,'QR00000011','2022-06-05','2022-05-15',NULL,1,1,8),(31,'QR00000012','2022-06-05','2022-05-20',NULL,1,1,9),(32,'QR00000013','2022-06-05','2022-05-18',NULL,1,1,10),(33,'QR00000014','2022-06-05','2022-05-14',NULL,1,1,11),(34,'QR00000015','2022-06-05','2022-05-16',NULL,2,1,12);
/*!40000 ALTER TABLE `quotationrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotationstatus`
--

DROP TABLE IF EXISTS `quotationstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotationstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotationstatus`
--

LOCK TABLES `quotationstatus` WRITE;
/*!40000 ALTER TABLE `quotationstatus` DISABLE KEYS */;
INSERT INTO `quotationstatus` VALUES (1,'Valid'),(2,'Invalid'),(3,'Deleted'),(4,'');
/*!40000 ALTER TABLE `quotationstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `removereason`
--

DROP TABLE IF EXISTS `removereason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `removereason` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `removereason`
--

LOCK TABLES `removereason` WRITE;
/*!40000 ALTER TABLE `removereason` DISABLE KEYS */;
INSERT INTO `removereason` VALUES (1,'Damaged'),(2,'Expired');
/*!40000 ALTER TABLE `removereason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cname` varchar(150) DEFAULT NULL,
  `cmobile` char(10) DEFAULT NULL,
  `reservationno` char(10) NOT NULL,
  `totalamount` decimal(10,0) NOT NULL,
  `addeddate` date NOT NULL,
  `description` text,
  `discountratio` int DEFAULT NULL,
  `lastprice` varchar(45) DEFAULT NULL,
  `reservationstatus_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `bday` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reservation_reservationstatus1_idx` (`reservationstatus_id`),
  KEY `fk_reservation_customer1_idx` (`customer_id`),
  CONSTRAINT `fk_reservation_customer1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_reservation_reservationstatus1` FOREIGN KEY (`reservationstatus_id`) REFERENCES `reservationstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,'Sunil','0773419123','R0000001',1000,'2022-04-25',NULL,10,'900.00',1,1,NULL),(21,'Nishantha Silva','0710660082','R0000002',1000,'2022-05-17',NULL,0,'1000',3,NULL,NULL),(22,'Shantha','0754896541','R0000003',1400,'2022-05-18',NULL,1,'1386',3,2,NULL),(23,'Jagath','0714569874','R0000004',2850,'2022-05-18',NULL,1,'2821.5',3,NULL,NULL),(24,'Kasuni','0774569984','R0000005',4520,'2022-05-19',NULL,0,'4520.00',1,NULL,NULL),(25,'Silva','0716945789','R0000006',1400,'2022-05-19',NULL,0,'1400.00',1,NULL,NULL),(26,'Silva','0745897698','R0000007',2550,'2022-05-19',NULL,0,'2550.00',1,NULL,NULL),(27,'silva','0710660082','R0000008',1400,'2022-05-19',NULL,0,'1400.00',1,NULL,NULL),(28,'Gunathilaka','0751234879','R0000009',1400,'2022-05-19',NULL,0,'1400.00',1,NULL,NULL),(29,'Ajantha','0745869542','R0000010',1700,'2022-05-20',NULL,0,'1700.00',1,6,NULL),(30,'Kasuni','0781254698','R0000011',0,'2022-05-25',NULL,0,'0',3,NULL,NULL),(31,'Kasuni','0745699741','R0000012',0,'2022-05-26',NULL,0,'0.0',3,NULL,NULL),(32,'Sunil','0710660082','R0000013',2860,'2022-05-26',NULL,0,'2860.00',1,1,NULL);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_has_service`
--

DROP TABLE IF EXISTS `reservation_has_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_has_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menuprice` decimal(10,0) DEFAULT NULL,
  `ordercount` int DEFAULT NULL,
  `linetotal` decimal(10,0) DEFAULT NULL,
  `cpname` varchar(150) DEFAULT NULL,
  `cpmobile` char(10) DEFAULT NULL,
  `deliveryaddress` text,
  `reserveddate` datetime NOT NULL,
  `servicecharge` decimal(8,2) NOT NULL,
  `reservation_id` int NOT NULL,
  `service_id` int NOT NULL,
  `menu_id` int DEFAULT NULL,
  `submenu_id` int DEFAULT NULL,
  `deliveryrequired` tinyint NOT NULL,
  `submenuprice` decimal(10,0) DEFAULT NULL,
  `reservation_has_service` varchar(45) DEFAULT NULL,
  `submenucategory_id` int DEFAULT NULL,
  `menucategory_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reservation_has_service_reservation1_idx` (`reservation_id`),
  KEY `fk_reservation_has_service_service1_idx` (`service_id`),
  KEY `fk_reservation_has_service_menu1_idx` (`menu_id`),
  KEY `fk_reservation_has_service_submenu1_idx` (`submenu_id`),
  KEY `fk_reservation_has_service_submenucategory1_idx` (`submenucategory_id`),
  KEY `fk_reservation_has_service_menucategory1_idx` (`menucategory_id`),
  CONSTRAINT `fk_reservation_has_service_menu1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `fk_reservation_has_service_menucategory1` FOREIGN KEY (`menucategory_id`) REFERENCES `menucategory` (`id`),
  CONSTRAINT `fk_reservation_has_service_reservation1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  CONSTRAINT `fk_reservation_has_service_service1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  CONSTRAINT `fk_reservation_has_service_submenu1` FOREIGN KEY (`submenu_id`) REFERENCES `submenu` (`id`),
  CONSTRAINT `fk_reservation_has_service_submenucategory1` FOREIGN KEY (`submenucategory_id`) REFERENCES `submenucategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_has_service`
--

LOCK TABLES `reservation_has_service` WRITE;
/*!40000 ALTER TABLE `reservation_has_service` DISABLE KEYS */;
INSERT INTO `reservation_has_service` VALUES (1,1000,1,1000,'Kamal','0773419123','add','2022-04-25 00:00:00',0.00,1,1,1,7,1,100,NULL,1,1),(2,500,2,1000,'Nishantha Silva','0710660082',NULL,'2022-05-17 00:00:00',0.00,21,1,5,NULL,0,NULL,NULL,NULL,1),(3,NULL,2,1400,'Nishantha Silva','0754896541',NULL,'2022-05-18 00:00:00',0.00,22,1,8,NULL,0,NULL,NULL,NULL,2),(4,NULL,3,2850,NULL,NULL,NULL,'2022-05-18 00:00:00',0.00,23,1,4,NULL,0,NULL,NULL,NULL,3),(5,700,2,1400,NULL,NULL,NULL,'2022-05-19 00:00:00',0.00,24,1,8,NULL,0,NULL,NULL,NULL,2),(6,520,6,3120,NULL,NULL,NULL,'2022-05-19 00:00:00',0.00,24,5,12,NULL,0,NULL,NULL,NULL,NULL),(7,700,2,1400,'Silva','0716945789','Matara','2022-05-11 00:00:00',120.00,25,6,8,NULL,0,NULL,NULL,NULL,2),(8,850,3,2550,'Silva','0745897698',NULL,'2022-05-23 00:00:00',0.00,26,5,5,NULL,0,NULL,NULL,NULL,2),(9,700,2,1400,'silva','0710660082',NULL,'2022-05-20 00:00:00',0.00,27,6,8,NULL,0,NULL,NULL,NULL,2),(10,700,2,1400,'Gunathilaka','0751234879','Matara','2022-05-28 00:00:00',120.00,28,6,8,NULL,0,NULL,NULL,NULL,2),(11,850,2,1700,NULL,NULL,NULL,'2022-06-01 00:00:00',0.00,29,5,5,NULL,0,NULL,NULL,NULL,2),(12,500,2,1000,'Sunil','0710660082',NULL,'2022-05-26 00:00:00',0.00,32,1,27,NULL,0,NULL,NULL,NULL,1),(13,NULL,3,1860,NULL,NULL,NULL,'2022-05-27 00:00:00',0.00,32,5,NULL,44,0,620,NULL,3,NULL);
/*!40000 ALTER TABLE `reservation_has_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservationstatus`
--

DROP TABLE IF EXISTS `reservationstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservationstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservationstatus`
--

LOCK TABLES `reservationstatus` WRITE;
/*!40000 ALTER TABLE `reservationstatus` DISABLE KEYS */;
INSERT INTO `reservationstatus` VALUES (1,'Reserved'),(2,'Completed'),(3,'Deleted');
/*!40000 ALTER TABLE `reservationstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'MANAGER'),(3,'CASHIER'),(4,'OWNER'),(5,'ASSISTANTMANAGER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `servicecode` char(10) NOT NULL,
  `servicename` varchar(150) NOT NULL,
  `servicecharge` decimal(8,2) NOT NULL,
  `addeddate` date NOT NULL,
  `service_status_id` int NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_service_service_status1_idx` (`service_status_id`),
  KEY `fk_service_employee1_idx` (`employee_id`),
  CONSTRAINT `fk_service_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_service_service_status1` FOREIGN KEY (`service_status_id`) REFERENCES `service_status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,'S000000001','Take away',100.00,'2021-03-21',1,1),(5,'S000000002','Dine-in',100.00,'2021-01-06',1,1),(6,'S000000003','Order(Delivery)',100.00,'2021-06-15',1,1);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_status`
--

DROP TABLE IF EXISTS `service_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_status`
--

LOCK TABLES `service_status` WRITE;
/*!40000 ALTER TABLE `service_status` DISABLE KEYS */;
INSERT INTO `service_status` VALUES (1,'Available'),(2,'Not-Available'),(3,'Deleted');
/*!40000 ALTER TABLE `service_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spayment`
--

DROP TABLE IF EXISTS `spayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spayment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `billno` char(10) NOT NULL,
  `supplier_id` int NOT NULL,
  `grn_id` int NOT NULL,
  `grnamount` decimal(10,0) NOT NULL,
  `totalamount` decimal(10,0) NOT NULL,
  `paidamount` decimal(10,0) NOT NULL,
  `balanceamount` decimal(10,0) NOT NULL,
  `paiddate` date NOT NULL,
  `description` text,
  `chequedate` date DEFAULT NULL,
  `chequeno` char(45) DEFAULT NULL,
  `bankaccno` char(15) DEFAULT NULL,
  `bankaccname` varchar(150) DEFAULT NULL,
  `bankname` varchar(150) DEFAULT NULL,
  `bankbranchname` varchar(150) DEFAULT NULL,
  `depositeddatetime` datetime DEFAULT NULL,
  `transferid` char(15) DEFAULT NULL,
  `paymentmethod_id` int NOT NULL,
  `paymentstatus_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_table1_paymentmethod1_idx` (`paymentmethod_id`),
  KEY `fk_table1_paymentstatus1_idx` (`paymentstatus_id`),
  KEY `fk_spayment_grn1_idx` (`grn_id`),
  KEY `fk_spayment_supplier1_idx` (`supplier_id`),
  CONSTRAINT `fk_spayment_grn1` FOREIGN KEY (`grn_id`) REFERENCES `grn` (`id`),
  CONSTRAINT `fk_spayment_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`),
  CONSTRAINT `fk_table1_paymentmethod1` FOREIGN KEY (`paymentmethod_id`) REFERENCES `paymentmethod` (`id`),
  CONSTRAINT `fk_table1_paymentstatus1` FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spayment`
--

LOCK TABLES `spayment` WRITE;
/*!40000 ALTER TABLE `spayment` DISABLE KEYS */;
INSERT INTO `spayment` VALUES (1,'SP00000001',1,1,100,10000,10020,100,'2022-02-05',NULL,'2021-06-05','01111','0774598746','peoples weligama','peoples','cfxhgxxt','2021-12-02 12:25:45','1254687',1,1),(2,'SP00000003',1,8,101,15300,10040,101,'2022-05-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3),(3,'SP00000003',1,8,101,14000,10020,101,'2022-04-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3),(5,'SP00000003',1,8,101,42000,20000,101,'2022-03-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3),(7,'SP00000002',1,1,100,20000,10000,100,'2022-04-23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,3),(8,'SP00000003',1,8,101,15000,14000,101,'2022-02-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3);
/*!40000 ALTER TABLE `spayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submenu`
--

DROP TABLE IF EXISTS `submenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submenu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submenucode` char(8) NOT NULL,
  `submenuname` varchar(150) NOT NULL,
  `submenucategory_id` int NOT NULL,
  `submenustatus_id` int NOT NULL,
  `description` text,
  `addeddate` date NOT NULL,
  `employee_id` int NOT NULL,
  `price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_submenu_submenucategory1_idx` (`submenucategory_id`),
  KEY `fk_submenu_submenustatus1_idx` (`submenustatus_id`),
  KEY `fk_submenu_employee1_idx` (`employee_id`),
  CONSTRAINT `fk_submenu_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_submenu_submenucategory1` FOREIGN KEY (`submenucategory_id`) REFERENCES `submenucategory` (`id`),
  CONSTRAINT `fk_submenu_submenustatus1` FOREIGN KEY (`submenustatus_id`) REFERENCES `submenustatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submenu`
--

LOCK TABLES `submenu` WRITE;
/*!40000 ALTER TABLE `submenu` DISABLE KEYS */;
INSERT INTO `submenu` VALUES (7,'SM000001','Fried Rice Vegi half',1,1,NULL,'2021-02-14',1,495.00),(8,'SM000002','Fried Rice Vegi full',1,1,NULL,'2021-06-25',1,570.00),(9,'SM000003','Fried Rice Fish half',1,1,NULL,'2022-01-08',1,650.00),(10,'SM000004','Rice and Curry Vegi half',4,1,NULL,'2022-05-10',1,420.00),(11,'SM000005','Egg half',4,1,NULL,'2022-05-10',1,300.00),(12,'SM000006','Fish Half',4,1,NULL,'2022-05-10',1,300.00),(38,'SM000005','Rice and Curry Vegi full',4,1,NULL,'2022-05-15',1,465.00),(39,'SM000006','Rice and Curry fish half',4,1,NULL,'2022-05-15',1,465.00),(40,'SM000007','Rice and Curry fish full',4,1,NULL,'2022-05-15',1,525.00),(41,'SM000008','Rice and Curry chicken half',4,1,NULL,'2022-05-15',1,495.00),(42,'SM000009','Rice and Curry chicken full',4,1,NULL,'2022-05-15',1,570.00),(43,'SM000010','Fried Rice Fish full',3,1,NULL,'2022-05-15',1,725.00),(44,'SM000011','Fried Rice Egg half',3,1,NULL,'2022-05-15',1,620.00),(45,'SM000012','Fried Rice Egg full',3,1,NULL,'2022-05-15',1,695.00),(46,'SM000013','Fried Rice Chicken half',1,1,NULL,'2022-05-15',1,725.00),(47,'SM000014','Fried Rice Chicken full',1,1,NULL,'2022-05-15',1,800.00),(48,'SM000015','Chicken Biriyani half',14,1,NULL,'2022-05-15',1,955.00),(49,'SM000016','Chicken Biriyani full',14,1,NULL,'2022-05-15',1,1110.00),(50,'SM000017','Fish Koththu half',2,1,NULL,'2022-05-15',1,650.00),(51,'SM000018','Fish Koththu full',2,1,NULL,'2022-05-15',1,955.00),(52,'SM000019','Egg Koththu half',2,1,NULL,'2022-05-15',1,495.00),(53,'SM000020','Egg Koththu full',2,1,NULL,'2022-05-15',1,650.00),(54,'SM000021','Chicken Koththu half	    ',2,1,NULL,'2022-05-15',1,650.00),(55,'SM000022','Chicken Koththu full	    ',2,1,NULL,'2022-05-15',1,1035.00),(56,'SM000023','Hopper 1',11,3,NULL,'2022-05-15',1,95.00),(57,'SM000024','Egg Hopper 1',11,3,NULL,'2022-05-15',1,185.00),(58,'SM000025','Cheese kottu half',2,1,NULL,'2022-05-15',1,1110.00),(59,'SM000026','Cheese kottu full',2,1,NULL,'2022-05-15',1,1265.00),(60,'SM000027','Egg Dolphin kottu',2,1,NULL,'2022-05-15',1,650.00),(61,'SM000028','Fish Dolphin kottu',2,1,NULL,'2022-05-15',1,800.00),(62,'SM000029','Chicken Dolphin kottu',2,1,NULL,'2022-05-15',1,880.00),(75,'SM000030','5 Parata with Gravy',15,1,NULL,'2022-05-15',1,650.00),(76,'SM000031','String Hoppers 20 with Garvy and Sambol',5,1,NULL,'2022-05-15',1,495.01),(77,'SM000032','String Hoppers 50  with Chicken Curry and Sambol',5,1,NULL,'2022-05-15',1,650.00),(78,'SM000033','Dhall Curry',10,1,NULL,'2022-05-15',1,430.00),(79,'SM000034','Potato Curry',10,1,NULL,'2022-05-15',1,430.00),(80,'SM000035','Chicken Curry',10,1,NULL,'2022-05-15',1,490.00),(81,'SM000036','Kiri Malu Curry',10,1,NULL,'2022-05-15',1,420.00),(82,'SM000037','Chili Fish Curry',10,1,NULL,'2022-05-15',1,420.00),(83,'SM000038','Egg curry',10,1,NULL,'2022-05-15',1,440.00),(84,'SM000039','Ggbergb Bgbirugb',1,1,NULL,'2022-05-25',1,200.00),(85,'SM000040','Uludu Wade',9,1,NULL,'2022-05-28',2,100.00),(86,'SM000041','Pol Rotti',7,1,NULL,'2022-05-28',2,30.00);
/*!40000 ALTER TABLE `submenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submenu_has_material`
--

DROP TABLE IF EXISTS `submenu_has_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submenu_has_material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submenu_id` int NOT NULL,
  `material_id` int NOT NULL,
  `qty` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_submenu_has_material_material1_idx` (`material_id`),
  KEY `fk_submenu_has_material_submenu1_idx` (`submenu_id`),
  CONSTRAINT `fk_submenu_has_material_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  CONSTRAINT `fk_submenu_has_material_submenu1` FOREIGN KEY (`submenu_id`) REFERENCES `submenu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submenu_has_material`
--

LOCK TABLES `submenu_has_material` WRITE;
/*!40000 ALTER TABLE `submenu_has_material` DISABLE KEYS */;
INSERT INTO `submenu_has_material` VALUES (2,7,1,5),(3,9,1,100),(4,10,6,250),(5,11,28,1),(6,12,8,0),(7,84,1,20),(8,85,10,1),(9,86,11,1);
/*!40000 ALTER TABLE `submenu_has_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submenucategory`
--

DROP TABLE IF EXISTS `submenucategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submenucategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submenucategory`
--

LOCK TABLES `submenucategory` WRITE;
/*!40000 ALTER TABLE `submenucategory` DISABLE KEYS */;
INSERT INTO `submenucategory` VALUES (1,'Fried Rice'),(2,'Kottu'),(3,'Noodles'),(4,'Rice and Curry'),(5,'String Hoppers'),(6,'Milk Rice'),(7,'Rotti'),(8,'Rolls'),(9,'Wade'),(10,'Curry'),(11,'Hoppers'),(12,'Pittu'),(13,'Devilled'),(14,'Biriyani'),(15,'Parata');
/*!40000 ALTER TABLE `submenucategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submenustatus`
--

DROP TABLE IF EXISTS `submenustatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submenustatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submenustatus`
--

LOCK TABLES `submenustatus` WRITE;
/*!40000 ALTER TABLE `submenustatus` DISABLE KEYS */;
INSERT INTO `submenustatus` VALUES (1,'Available'),(2,'Not-Available'),(3,'Deleted');
/*!40000 ALTER TABLE `submenustatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `regno` char(10) NOT NULL,
  `fullname` varchar(150) NOT NULL,
  `contactno1` char(10) NOT NULL,
  `cpname` varchar(150) NOT NULL,
  `contactno2` char(10) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `addeddate` date NOT NULL,
  `description` text,
  `bankholdername` varchar(150) DEFAULT NULL,
  `bankname` varchar(150) DEFAULT NULL,
  `bankbranchname` varchar(150) DEFAULT NULL,
  `bankaccountno` varchar(45) DEFAULT NULL,
  `arreasamount` decimal(10,0) DEFAULT NULL,
  `employee_id` int NOT NULL,
  `supplierstatus_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_supplier_employee1_idx` (`employee_id`),
  KEY `fk_supplier_supplierstatus1_idx` (`supplierstatus_id`),
  CONSTRAINT `fk_supplier_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_supplier_supplierstatus1` FOREIGN KEY (`supplierstatus_id`) REFERENCES `supplierstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'S000000001','Aruna silva','0710660082','Aruna',NULL,'aruna@gmail.com','Gampha','2021-03-04',NULL,'saman','peoples','gampaha','0777546541',12000,1,1),(2,'S000000002','Saman Gamage','0715698745','Amal',NULL,'saman@gmail.com','Malambe','2021-04-16',NULL,'Aruna','peoples','Malambe','745648789',1000,1,1),(3,'S000000003','Kamal Silva','0776548924','Kamal',NULL,'Kamal@gmail.com','Matara','2022-04-16',NULL,NULL,NULL,NULL,NULL,3500,1,1),(4,'S000000004','Aravinda Perera','0758974566','Aravinda',NULL,'Aravinda@gmail.com','Seeduwa','2022-04-28',NULL,NULL,NULL,NULL,NULL,1000,1,1),(5,'S000000005','Jagath kumara','0758974512','Jagath',NULL,'Jagath@gmail.com','Kiribathgoda','2022-05-01',NULL,NULL,NULL,NULL,NULL,7500,1,2),(6,'S000000007','Sugath Jayawardana','0785469874','Sugath',NULL,'sugath@gmail.com','Kandana','0200-05-30',NULL,NULL,NULL,NULL,NULL,3000,1,1),(7,'S000000006','Dinesh Sampath','0713245698','Sampath',NULL,'dinesh@gmail.com','Kaluthara','2022-05-10',NULL,NULL,NULL,NULL,NULL,1000,1,1),(8,'S000000007','Siriwardane','0713571597','Siriwardane',NULL,'dinesh@gmail.com','Colombo','2022-05-10',NULL,NULL,NULL,NULL,NULL,1500,1,1),(9,'S000000008','Piyasiri','0781452633','Piyasiri',NULL,'dinesh@gmail.com','Nugegoda','2022-05-10',NULL,NULL,NULL,NULL,NULL,3100,1,1),(10,'S000000009','Samaranayaka','0751478954','Samaranayaka',NULL,'dinesh@gmail.com','Nawala','2022-05-10',NULL,NULL,NULL,NULL,NULL,1300,1,1),(11,'S000000010','Gajadheera','0713216549','Gajadheera',NULL,'dinesh@gmail.com','Rajagiriya','2022-05-10',NULL,NULL,NULL,NULL,NULL,1800,1,1),(12,'S000000011','Amarasinghe','0741526348','Amarasinghe',NULL,'dinesh@gmail.com','Koswatta','2022-05-10',NULL,NULL,NULL,NULL,NULL,2570,1,1);
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_has_material`
--

DROP TABLE IF EXISTS `supplier_has_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_has_material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `material_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_supplier_has_material_material1_idx` (`material_id`),
  KEY `fk_supplier_has_material_supplier1_idx` (`supplier_id`),
  CONSTRAINT `fk_supplier_has_material_material1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  CONSTRAINT `fk_supplier_has_material_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_has_material`
--

LOCK TABLES `supplier_has_material` WRITE;
/*!40000 ALTER TABLE `supplier_has_material` DISABLE KEYS */;
INSERT INTO `supplier_has_material` VALUES (1,1,1),(2,1,4),(3,1,6),(4,2,2),(5,2,5),(6,3,9),(7,4,3),(8,4,12),(9,4,14),(10,7,19),(11,7,21),(12,5,27),(13,5,28),(30,8,7),(31,9,8),(32,10,11),(33,11,18),(34,12,10),(35,4,12),(36,4,15),(37,4,22),(38,7,24),(39,7,23),(40,7,26),(41,2,16),(42,2,20),(43,4,13),(44,4,17),(45,4,25);
/*!40000 ALTER TABLE `supplier_has_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplierstatus`
--

DROP TABLE IF EXISTS `supplierstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplierstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplierstatus`
--

LOCK TABLES `supplierstatus` WRITE;
/*!40000 ALTER TABLE `supplierstatus` DISABLE KEYS */;
INSERT INTO `supplierstatus` VALUES (1,'Available'),(2,'Deleted'),(3,'Not-Available');
/*!40000 ALTER TABLE `supplierstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tableallocation`
--

DROP TABLE IF EXISTS `tableallocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tableallocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tableallocationcode` char(10) NOT NULL,
  `reserveddate` date NOT NULL,
  `reservetime` time NOT NULL,
  `addeddate` date NOT NULL,
  `tablestatus_id` int NOT NULL,
  `reservation_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tableallocation_tablestatus1_idx` (`tablestatus_id`),
  KEY `fk_tableallocation_reservation1_idx` (`reservation_id`),
  CONSTRAINT `fk_tableallocation_reservation1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  CONSTRAINT `fk_tableallocation_tablestatus1` FOREIGN KEY (`tablestatus_id`) REFERENCES `tablestatus` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tableallocation`
--

LOCK TABLES `tableallocation` WRITE;
/*!40000 ALTER TABLE `tableallocation` DISABLE KEYS */;
/*!40000 ALTER TABLE `tableallocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tableallocation_has_tableddetail`
--

DROP TABLE IF EXISTS `tableallocation_has_tableddetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tableallocation_has_tableddetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tableallocation_id` int NOT NULL,
  `tableddetail_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tableallocation_has_tableddetail_tableddetail1_idx` (`tableddetail_id`),
  KEY `fk_tableallocation_has_tableddetail_tableallocation1_idx` (`tableallocation_id`),
  CONSTRAINT `fk_tableallocation_has_tableddetail_tableallocation1` FOREIGN KEY (`tableallocation_id`) REFERENCES `tableallocation` (`id`),
  CONSTRAINT `fk_tableallocation_has_tableddetail_tableddetail1` FOREIGN KEY (`tableddetail_id`) REFERENCES `tableddetail` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tableallocation_has_tableddetail`
--

LOCK TABLES `tableallocation_has_tableddetail` WRITE;
/*!40000 ALTER TABLE `tableallocation_has_tableddetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tableallocation_has_tableddetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tableddetail`
--

DROP TABLE IF EXISTS `tableddetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tableddetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tableallcode` char(10) NOT NULL,
  `tablename` varchar(150) NOT NULL,
  `nofchairs` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tableddetail`
--

LOCK TABLES `tableddetail` WRITE;
/*!40000 ALTER TABLE `tableddetail` DISABLE KEYS */;
INSERT INTO `tableddetail` VALUES (1,'T001','1',0),(2,'T002','2',0),(3,'T003','3',0);
/*!40000 ALTER TABLE `tableddetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tablestatus`
--

DROP TABLE IF EXISTS `tablestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tablestatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tablestatus`
--

LOCK TABLES `tablestatus` WRITE;
/*!40000 ALTER TABLE `tablestatus` DISABLE KEYS */;
INSERT INTO `tablestatus` VALUES (1,'Available'),(2,'Not-Available'),(3,'Deleted');
/*!40000 ALTER TABLE `tablestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unittype`
--

DROP TABLE IF EXISTS `unittype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unittype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unittype`
--

LOCK TABLES `unittype` WRITE;
/*!40000 ALTER TABLE `unittype` DISABLE KEYS */;
INSERT INTO `unittype` VALUES (1,'Kg'),(2,'g'),(3,'Pieces');
/*!40000 ALTER TABLE `unittype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKt7e7djp752sqn6w22i6ocqy6q` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1),(2,2),(3,3),(4,5);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `employee_id` int DEFAULT NULL,
  `employee_created_id` int DEFAULT NULL,
  `hint` char(4) DEFAULT NULL,
  `docreation` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  KEY `fk_users_employee1_idx` (`employee_id`),
  KEY `fk_users_employee2_idx` (`employee_created_id`),
  CONSTRAINT `fk_users_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_users_employee2` FOREIGN KEY (`employee_created_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '','sarath@gmail.com',NULL,NULL,'$2a$10$DBcSvDu0V0t6hg0tY23V4elcGDwhgCIbehP5gCkNY8eFBOwaR9CHW','Admin',1,1,NULL,'2021-01-01'),(2,_binary '','mg.wasantha@gmail.com',NULL,NULL,'$2a$10$wccRob/7cZ14Ez/lhIXrSe1800oY6nCloBXXgjYzTvHSk9qjUdP5C','Wasantha',2,1,NULL,'2022-05-28'),(3,_binary '','ransara@gmail.com',NULL,NULL,'$2a$10$BCs5gBS16Sw7LzNN2U2ZK.vFxIln2svySVmqWFEIj0iJRA.eIEDPe','Ransara',3,1,NULL,'2022-05-28'),(4,_binary '','tharanga@gmail.com',NULL,NULL,'$2a$10$Gq6mFNe1LBcyipeaArAxm.7.C69IWFucaMweqlh8lN2TKCNJy0RHa','Tharanga',4,1,NULL,'2022-05-28');
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

-- Dump completed on 2023-03-25 13:41:47
