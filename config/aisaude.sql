-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 27/06/2024 às 23:57
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `aisaude`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `sessions`
--

INSERT INTO `sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('cc9BcvPj0lwYGYjbPwKVMegBz_kVRP6x', '2024-06-27 19:55:26', '{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2024-06-27T19:55:26.120Z\",\"httpOnly\":true,\"path\":\"/\"},\"userId\":2,\"username\":\"TAVIN1\"}', '2024-06-27 19:25:26', '2024-06-27 19:25:26'),
('m45dY5TJpjntZBYhaasK1rPI7hD8WAZz', '2024-06-27 20:12:30', '{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2024-06-27T20:03:02.180Z\",\"httpOnly\":true,\"path\":\"/\"},\"userId\":2,\"username\":\"TAVIN1\"}', '2024-06-27 19:33:02', '2024-06-27 19:42:30'),
('mytUXVxW4gqewnBFcJL9-fFFdRChTzDy', '2024-06-27 20:50:53', '{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2024-06-27T20:50:53.432Z\",\"httpOnly\":true,\"path\":\"/\"},\"userId\":2,\"username\":\"TAVIN1\"}', '2024-06-27 20:20:53', '2024-06-27 20:20:53');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `interactions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`interactions`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `interactions`, `createdAt`, `updatedAt`) VALUES
(2, 'TAVIN1', '$2a$10$vlUT/eYoFwZ5x/GpVQPqdu/XiEzM4eHa8PUvGtH7Pu9I1b2e3EKuG', NULL, '2024-06-27 12:14:24', '2024-06-27 12:14:24');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
