-- ============================================================
-- Inicializacao do ambiente prod
-- Escopo: Produto (CRUD), Categoria e Fornecedor
-- Idempotente: pode ser executado varias vezes sem duplicar nada
-- ============================================================

-- ------------------------------------------------------------
-- Banco
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS estoque_principal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Usuario e permissoes
-- ------------------------------------------------------------
CREATE USER IF NOT EXISTS 'estoque_prod'@'%' IDENTIFIED BY 'estoque_prod';
GRANT ALL PRIVILEGES ON estoque_principal.* TO 'estoque_prod'@'%';

FLUSH PRIVILEGES;

-- ============================================================
-- BANCO: estoque_principal  (aplicacao-principal)
-- ============================================================
USE estoque_principal;

CREATE TABLE IF NOT EXISTS categoria (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    nome       VARCHAR(100) NOT NULL,
    descricao  VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categoria_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fornecedor (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(150) NOT NULL,
    cnpj      VARCHAR(18)  NOT NULL,
    telefone  VARCHAR(20)  NULL,
    email     VARCHAR(150) NULL,
    endereco  VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_fornecedor_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Produto (abstract) com heranca SINGLE_TABLE:
--   tipo_produto = 'PERECIVEL'     -> usa data_validade e lote
--   tipo_produto = 'NAO_PERECIVEL' -> usa garantia_meses
CREATE TABLE IF NOT EXISTS produto (
    id                  BIGINT         NOT NULL AUTO_INCREMENT,
    tipo_produto        VARCHAR(20)    NOT NULL,
    nome                VARCHAR(150)   NOT NULL,
    descricao           VARCHAR(255)   NULL,
    preco               DECIMAL(12,2)  NOT NULL,
    quantidade_estoque  INT            NOT NULL DEFAULT 0,
    categoria_id        BIGINT         NOT NULL,
    fornecedor_id       BIGINT         NOT NULL,
    -- ProdutoPerecivel
    data_validade       DATE           NULL,
    lote                VARCHAR(50)    NULL,
    -- ProdutoNaoPerecivel
    garantia_meses      INT            NULL,
    PRIMARY KEY (id),
    KEY idx_produto_categoria  (categoria_id),
    KEY idx_produto_fornecedor (fornecedor_id),
    CONSTRAINT fk_produto_categoria  FOREIGN KEY (categoria_id)  REFERENCES categoria  (id),
    CONSTRAINT fk_produto_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedor (id),
    CONSTRAINT ck_produto_tipo CHECK (tipo_produto IN ('PERECIVEL', 'NAO_PERECIVEL')),
    CONSTRAINT ck_produto_quantidade CHECK (quantidade_estoque >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;