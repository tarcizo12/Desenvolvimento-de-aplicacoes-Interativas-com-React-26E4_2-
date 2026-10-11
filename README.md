# Gerenciador de Estoque: Front-end React

Esta etapa do projeto desenvolve a **interface web em React** do sistema de estoque. Ela dá continuidade ao projeto anterior, em que foram construídos a API em Spring Boot, o banco MySQL e a orquestração com Docker Compose.

## Escopo

Para manter o foco, o escopo foi reduzido ao núcleo do domínio:

* **CRUD de Produto** (foco principal desta etapa): listar, cadastrar, editar e excluir.
* **Categoria** e **Fornecedor**: entidades de apoio, usadas para classificar e associar cada produto (por exemplo, nos campos de seleção do formulário).

Ficam fora desta etapa: `Usuario`, `Movimentacao`, `ItemMovimentacao` e `TipoMovimentacao`.

## Modelo de domínio

!\[Diagrama de entidades](./diagrama-entidades.png)

Pontos principais do modelo:

* `Produto` é uma classe abstrata, com dois tipos:

  * `ProdutoPerecivel`: possui `dataValidade` e `lote`.
  * `ProdutoNaoPerecivel`: possui `garantiaMeses`.
* Uma `Categoria` possui vários produtos (1 para N).
* Um `Fornecedor` fornece vários produtos (1 para N).

Consequência para a interface: o formulário de produto deve exibir campos diferentes conforme o tipo escolhido (validade e lote para perecível, garantia para não perecível).

## Back-end utilizado

A interface consome a API da aplicação principal (projeto anterior):

* API: `http://localhost:8080`
* Documentação (Swagger): `http://localhost:8080/swagger-ui.html`

Para subir a API e o banco, na raiz do projeto anterior:

```bash
docker compose up --build -d
```

