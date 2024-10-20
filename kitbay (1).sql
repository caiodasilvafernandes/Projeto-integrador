-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 11-Out-2024 às 22:31
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `kitbay`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `idAvalia` int(11) NOT NULL,
  `avaliacao` enum('1','2','3','4','5') NOT NULL,
  `idPacote` int(11) NOT NULL,
  `dataAvaliacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `avaliacao`
--

INSERT INTO `avaliacao` (`idAvalia`, `avaliacao`, `idPacote`, `dataAvaliacao`) VALUES
(1, '5', 8, '2024-09-28 21:59:09'),
(2, '4', 8, '2024-09-28 21:59:09'),
(3, '3', 8, '2024-09-28 21:59:09');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cidade`
--

CREATE TABLE `cidade` (
  `idCidade` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `idEstado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

CREATE TABLE `cliente` (
  `idCliente` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `idCidade` int(11) NOT NULL,
  `dataNasc` date NOT NULL,
  `slug` varchar(256) NOT NULL,
  `imgPerfil` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`idCliente`, `nome`, `login`, `senha`, `email`, `bio`, `idCidade`, `dataNasc`, `slug`, `imgPerfil`) VALUES
(1, 'Caio da Silva Fernandes', 'capysman2', '$2a$10$nI2mM25AVKDUmqa4TYemP.I8PC1JJxSUrEcoxDCUDZqwAKNgA9rh2', 'caio@gmail.com', 'brockhampton', 1, '2006-12-08', 'capysman2', '98Captura de Tela (33).png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `comentario`
--

CREATE TABLE `comentario` (
  `idComentario` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `idPacote` int(11) NOT NULL,
  `idFkCliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estado`
--

CREATE TABLE `estado` (
  `idEstado` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `idPais` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pacote`
--

CREATE TABLE `pacote` (
  `idPacote` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `dirImg` varchar(255) NOT NULL,
  `dirPacote` varchar(255) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `dirDemo` varchar(256) NOT NULL,
  `preco` double NOT NULL,
  `slug` varchar(256) NOT NULL,
  `tipo` enum('Loops','Drums','Drums and Loops','Others') DEFAULT NULL,
  `dataCriacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `pacote`
--

INSERT INTO `pacote` (`idPacote`, `nome`, `dirImg`, `dirPacote`, `idCliente`, `dirDemo`, `preco`, `slug`, `tipo`, `dataCriacao`) VALUES
(1, 'caio', 'function getHours() { [native code] }function getMilliseconds() { [native code] }Captura de Tela (28).png', 'function getHours() { [native code] }function getMilliseconds() { [native code] }808.zip', 1, '0', 1, 'caio', NULL, '2024-10-06 17:48:19'),
(2, 'caio', 'function getHours() { [native code] }function getMilliseconds() { [native code] }Captura de Tela (28).png', 'function getHours() { [native code] }function getMilliseconds() { [native code] }808.zip', 1, '0', 1, 'caio', NULL, '2024-10-06 17:48:19'),
(3, 'caio', 'function getHours() { [native code] }function getMilliseconds() { [native code] }Captura de Tela (28).png', 'function getHours() { [native code] }function getMilliseconds() { [native code] }808.zip', 1, '0', 1, 'caio', NULL, '2024-10-06 17:48:19'),
(4, 'caio', 'function getHours() { [native code] }function getMilliseconds() { [native code] }Captura de Tela (28).png', 'function getHours() { [native code] }function getMilliseconds() { [native code] }808.zip', 1, '0', 1, 'caio', NULL, '2024-10-06 17:48:19'),
(5, 'gsdgdss', '200Captura de Tela (28).png', '200808.zip', 1, '200808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 2, 'gsdgdss', 'Loops', '2024-10-06 17:48:19'),
(6, 'Cfigvi', '897Captura de Tela (35).png', '897808.zip', 1, '897808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 1, 'cfigvi', '', '2024-10-06 17:48:19'),
(7, 'Cfigvi', '334Captura de Tela (35).png', '334808.zip', 1, '334808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 1, 'cfigvi', '', '2024-10-06 17:48:19'),
(8, 'Cfigvi', '634Captura de Tela (35).png', '634808.zip', 1, '634808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 1, 'cfigvi', '', '2024-10-06 17:48:19'),
(9, 'Cfigvi', '240Captura de Tela (35).png', '240808.zip', 1, '240808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 1, 'cfigvi', '', '2024-10-06 17:48:19'),
(10, 'vanvá', '614Captura de Tela (28).png', '614808.zip', 1, '614808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 3, 'vanva', 'Others', '2024-10-06 17:48:19'),
(11, 'fasfjasf', '604Captura de Tela (32).png', '604808.zip', 1, '604808_Cowbell_Oneshot_WCHipHop_drum_BANDLAB.zip', 23, 'fasfjasf', 'Loops', '2024-10-06 17:48:19');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pacotesfav_comp`
--

CREATE TABLE `pacotesfav_comp` (
  `idPacoteFav` int(11) NOT NULL,
  `idFkPacote` int(11) NOT NULL,
  `idFkCliente` int(11) NOT NULL,
  `dataCompra` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` enum('fav','comp') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pais`
--

CREATE TABLE `pais` (
  `idPais` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `idUser` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `slug` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`idAvalia`),
  ADD KEY `idFKPacote` (`idPacote`);

--
-- Índices para tabela `cidade`
--
ALTER TABLE `cidade`
  ADD PRIMARY KEY (`idCidade`),
  ADD KEY `idFkEstado` (`idEstado`);

--
-- Índices para tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idCliente`);

--
-- Índices para tabela `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`idComentario`),
  ADD KEY `idFPacote` (`idPacote`);

--
-- Índices para tabela `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`idEstado`),
  ADD KEY `idFkPais` (`idPais`);

--
-- Índices para tabela `pacote`
--
ALTER TABLE `pacote`
  ADD PRIMARY KEY (`idPacote`),
  ADD KEY `idFkCliente` (`idCliente`);

--
-- Índices para tabela `pacotesfav_comp`
--
ALTER TABLE `pacotesfav_comp`
  ADD PRIMARY KEY (`idPacoteFav`),
  ADD KEY `idPacote` (`idFkPacote`),
  ADD KEY `idCliente` (`idFkCliente`);

--
-- Índices para tabela `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`idPais`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `idAvalia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `cidade`
--
ALTER TABLE `cidade`
  MODIFY `idCidade` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `comentario`
--
ALTER TABLE `comentario`
  MODIFY `idComentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `estado`
--
ALTER TABLE `estado`
  MODIFY `idEstado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pacote`
--
ALTER TABLE `pacote`
  MODIFY `idPacote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `pacotesfav_comp`
--
ALTER TABLE `pacotesfav_comp`
  MODIFY `idPacoteFav` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pais`
--
ALTER TABLE `pais`
  MODIFY `idPais` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `idFKPacote` FOREIGN KEY (`idPacote`) REFERENCES `pacote` (`idPacote`);

--
-- Limitadores para a tabela `cidade`
--
ALTER TABLE `cidade`
  ADD CONSTRAINT `idFkEstado` FOREIGN KEY (`idEstado`) REFERENCES `estado` (`idEstado`);

--
-- Limitadores para a tabela `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `idFPacote` FOREIGN KEY (`idPacote`) REFERENCES `pacote` (`idPacote`);

--
-- Limitadores para a tabela `estado`
--
ALTER TABLE `estado`
  ADD CONSTRAINT `idFkPais` FOREIGN KEY (`idPais`) REFERENCES `pais` (`idPais`);

--
-- Limitadores para a tabela `pacote`
--
ALTER TABLE `pacote`
  ADD CONSTRAINT `idFkCliente` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`);

--
-- Limitadores para a tabela `pacotesfav_comp`
--
ALTER TABLE `pacotesfav_comp`
  ADD CONSTRAINT `idCliente` FOREIGN KEY (`idFkCliente`) REFERENCES `cliente` (`idCliente`),
  ADD CONSTRAINT `idPacote` FOREIGN KEY (`idFkPacote`) REFERENCES `pacote` (`idPacote`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
