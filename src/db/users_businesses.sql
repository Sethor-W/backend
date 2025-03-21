-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-03-2025 a las 03:13:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sethor`
--

--
-- Volcado de datos para la tabla `users_businesses`
--

INSERT INTO `users_businesses` (`id`, `email`, `keyword`, `credential`, `password`, `status`, `createdAt`, `updatedAt`, `userBusinessRoleId`) VALUES
('021922a8-0a96-42c3-b942-1e9df1f6c701', 'colledctddodr@example.com', 'codlledddctor', '08569874562.codlledddctor', '$2b$10$SoCT.BMogIe9flJBBjHgguIDv3/FA8Piape2hBeOZTIA7Ruas9BP6', 'active', '2025-01-03 14:38:48', '2025-01-03 14:38:48', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('0b24ed59-2903-45d2-a9c4-366e6050bde1', 'collectddor@example.com', 'codlledctor', '08569874562.codlledctor', '$2b$10$Fu6ZsPv23h0z7IDbvGUTcushU3aySqmsfAGiVCmkVf7oUoU2PIv1a', 'active', '2025-01-02 20:47:05', '2025-01-02 20:47:05', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('11b77381-6746-4c52-a0ac-9301efa3b724', 'aownerd+demo2024@gmail.com', 'aBusinessOwnerDemo', '123456178-9.aBusinessOwnerDemo', '$2b$10$QAo9E7tf2AmHu8tL5gJzDe2UFW9F0mbU4FRaCbPA6zsDJYK2Barx6', 'active', '2024-12-31 15:25:05', '2024-12-31 15:25:05', '9761a93d-c401-47cf-84cd-56930b361b3a'),
('12a2d8af-71b2-45c6-b7b1-17295da5e566', 'dylan@gmail.com', 'cobrador', '08037023.cobrador', '$2b$10$A83f2k9AyYI3ZJXgwRtA.OU0ATDYUNkBCRbSwIv215/WTLTAYXtAC', 'active', '2024-08-28 00:44:31', '2024-08-28 00:44:31', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('19f3e62a-bbc8-4d5c-b1b3-7137c55c58ec', 'collectdor@example.com', 'codllector', '08569874562.codllector', '$2b$10$NBrSSruaECSs46o3eco1/e3gGQGSw.IIXG8K/dk1FwY640x1Uhy/.', 'active', '2025-01-02 20:46:40', '2025-01-02 20:46:40', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('3857581b-a4f1-4977-831a-bbc3374a06a4', 'owner+demo2024@gmail.com', 'BusinessOwnerDemo', '12345678-9.BusinessOwnerDemo', '$2b$10$rRBnAUvniuPa5iwxZD7sfexi7/7JkxSNgif2ozFwqe4jNy3CE8CxW', 'active', '2024-08-26 23:40:08', '2024-08-26 23:40:08', '9761a93d-c401-47cf-84cd-56930b361b3a'),
('48b85a4e-b571-4ceb-9682-0620ec61a9b9', 'aownedrd+demo2024@gmail.com', 'aBusidnessOwnerDemo', '123456178-9.aBusidnessOwnerDemo', '$2b$10$7J628aoioXKzANNRolRTCOspSjAryw2T0p4HcpUznlcBCoiSEa71G', 'active', '2024-12-31 15:27:19', '2024-12-31 15:27:19', '9761a93d-c401-47cf-84cd-56930b361b3a'),
('4d8778b8-2156-430b-93e5-8265dc138703', 'collectddodr@example.com', 'codlleddctor', '08569874562.codlleddctor', '$2b$10$LQ8MHGTFgnDEHGlpPlAQ9ua3klgDn/izsissbe/.Y3d/NYwzMqsCO', 'active', '2025-01-03 14:38:01', '2025-01-03 14:38:01', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('7cc1fecc-e5ea-4917-8e0f-696c18149bbd', 'colledctdddadoddr@example.com', 'codlledddddddctor', '08569874562.codlledddddddctor', '$2b$10$8MjRzronXh0m8n21bfA/r.Ejy4EJpPHV8iUStesIHcDnjGP.qJ2/W', 'active', '2025-01-03 14:47:15', '2025-01-03 14:47:15', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('8023cc3a-62b9-4ab1-bd02-7115f67e0363', 'colledctddddoddr@example.com', 'codlleddddddctor', '08569874562.codlleddddddctor', '$2b$10$B6WhKgrdYKFAlcF1o5gAee12/ON801vmKNim81.fQcebyPtKjyVxy', 'active', '2025-01-03 14:46:02', '2025-01-03 14:46:02', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('80c325cf-3333-4983-80cf-fd59e3abea32', 'collector@example.com', 'collector', '08569874562.collector', '$2b$10$V9TVDdg/g2B.aYHMe0Uliu4ZTmwAK80nxab74LKSdEiYYqYh8yfTK', 'active', '2025-01-02 20:46:16', '2025-01-02 20:46:16', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('9603a865-26e7-4df0-b9e9-8dfeac98fcb0', 'colledctddoddr@example.com', 'codlleddddctor', '08569874562.codlleddddctor', '$2b$10$5m0FhUGxeAEFhQpaFqPj7uyWKPZ4wQ3qSly9tJzHS/uoFvtpzXFrK', 'active', '2025-01-03 14:41:56', '2025-01-03 14:41:56', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('c0fc833b-d986-4860-ab4b-07c6f54d1262', 'colledctdddoddr@example.com', 'codlledddddctor', '08569874562.codlledddddctor', '$2b$10$5QyA9GmUubPh6OnvlINMheDCvK.Bt0Zs8VVsJJ0.oszwPkluKPDTy', 'active', '2025-01-03 14:44:20', '2025-01-03 14:44:20', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('cf79e374-19f4-471f-b183-e66cf1489ba9', 'aowner+demo2024@gmail.com', 'aBusinessOwnerDemo', '12345678-9.aBusinessOwnerDemo', '$2b$10$0lq0fiHHbEwKNfm8TBVXo.T3/U.HjVaA1jmn.zeXdyKS9X6hRrFuu', 'active', '2024-12-31 15:20:38', '2024-12-31 15:20:38', '9761a93d-c401-47cf-84cd-56930b361b3a'),
('d3b3cb9d-a8fb-460f-8246-f1c03a2919c2', 'colledctdddaddoddr@example.com', 'codlleddddsdddctor', '08569874562.codlleddddsdddctor', '$2b$10$9f0dewfyvzoT.FqHDmnL7.bePlNAh.kLSuCkXURaf6E83u897tSw2', 'active', '2025-01-03 14:47:31', '2025-01-03 14:47:31', 'eb06d242-be98-48d8-b6db-af16296c6250'),
('e6494b0f-d8ab-495e-a8e4-4000144b2f90', 'juan@sethor.com', 'gere', '0947859.gere', '$2b$10$RABMqcdiSkuhGPgQFi6t2OMXJR0KW7wXNAfxwkmh96fv2pkQDsuXO', 'active', '2024-08-28 00:47:33', '2024-08-28 00:47:33', '693a2964-5928-4c14-8276-5f16f2bb1355'),
('e7be07ba-68db-4f6b-91ec-393abcb2d000', 'gownerbeats@gmail.com', 'owner2', '0803701895.owner2', '$2b$10$BBbsZ7o3sRkWV1Xc2S3DPuzmf6ejlLIuRZk0ihqHrI0FQLGVzjrEm', 'active', '2024-09-14 00:09:47', '2024-09-14 00:09:47', '9761a93d-c401-47cf-84cd-56930b361b3a'),
('ed62691f-3649-4dec-8b01-f78cade22069', 'aowneddrd+demo2024@gmail.com', 'aBudsidnessOwnerDemo', '123456178-9.aBudsidnessOwnerDemo', '$2b$10$24uM9jrj2ICljjGoP3W4qOeefPbXt5R6svLRB7VequqYdpLwxhWDu', 'active', '2024-12-31 16:59:23', '2024-12-31 16:59:23', '9761a93d-c401-47cf-84cd-56930b361b3a');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
