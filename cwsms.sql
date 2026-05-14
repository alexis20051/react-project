-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2026 at 04:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cwsms`
--

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `PlateNumber` varchar(20) NOT NULL,
  `CarType` varchar(50) DEFAULT NULL,
  `CarSize` varchar(20) DEFAULT NULL,
  `DriverName` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`PlateNumber`, `CarType`, `CarSize`, `DriverName`, `PhoneNumber`) VALUES
('A2026a', 'toyota', '12', 'alexis', '078123344'),
('Ab400c', 'BMW', '12', 'alexis', '067883555545'),
('R123AB', 'ebride', '12', 'fabie', '+2201234567');

-- --------------------------------------------------------

--
-- Table structure for table `package`
--

CREATE TABLE `package` (
  `PackageNumber` int(11) NOT NULL,
  `PackageName` varchar(50) NOT NULL,
  `PackageDescription` text DEFAULT NULL,
  `PackagePrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package`
--

INSERT INTO `package` (`PackageNumber`, `PackageName`, `PackageDescription`, `PackagePrice`) VALUES
(1, 'Basic wash', 'Exterior hand wash', 5000.00),
(2, 'Classic wash', 'Interior hand wash', 10000.00),
(3, 'Premium wash', 'Exterior and Interior hand wash', 20000.00),
(4, 'washing in deep', 'machine wash', 120000.00),
(5, 'washing moto', 'to clean it', 520000.00);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentNumber` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDate` date NOT NULL,
  `RecordNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentNumber`, `AmountPaid`, `PaymentDate`, `RecordNumber`) VALUES
(1, 12000000.00, '2026-03-18', 2),
(7, 1200000.00, '2026-03-10', 3),
(8, 119999.00, '2026-03-05', 4),
(11, 49997.00, '2026-03-05', 5);

-- --------------------------------------------------------

--
-- Table structure for table `servicepackage`
--

CREATE TABLE `servicepackage` (
  `RecordNumber` int(11) NOT NULL,
  `ServiceDate` date NOT NULL,
  `PackageNumber` int(11) NOT NULL,
  `PlateNumber` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicepackage`
--

INSERT INTO `servicepackage` (`RecordNumber`, `ServiceDate`, `PackageNumber`, `PlateNumber`) VALUES
(2, '2026-03-03', 1, 'A2026a'),
(3, '2026-03-10', 4, 'R123AB'),
(4, '2026-03-05', 2, 'R123AB'),
(5, '2026-03-05', 4, 'R123AB');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`PlateNumber`);

--
-- Indexes for table `package`
--
ALTER TABLE `package`
  ADD PRIMARY KEY (`PackageNumber`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentNumber`),
  ADD UNIQUE KEY `RecordNumber` (`RecordNumber`);

--
-- Indexes for table `servicepackage`
--
ALTER TABLE `servicepackage`
  ADD PRIMARY KEY (`RecordNumber`),
  ADD KEY `PackageNumber` (`PackageNumber`),
  ADD KEY `PlateNumber` (`PlateNumber`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `package`
--
ALTER TABLE `package`
  MODIFY `PackageNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `servicepackage`
--
ALTER TABLE `servicepackage`
  MODIFY `RecordNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`RecordNumber`) REFERENCES `servicepackage` (`RecordNumber`) ON DELETE CASCADE;

--
-- Constraints for table `servicepackage`
--
ALTER TABLE `servicepackage`
  ADD CONSTRAINT `servicepackage_ibfk_1` FOREIGN KEY (`PackageNumber`) REFERENCES `package` (`PackageNumber`) ON DELETE CASCADE,
  ADD CONSTRAINT `servicepackage_ibfk_2` FOREIGN KEY (`PlateNumber`) REFERENCES `car` (`PlateNumber`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
