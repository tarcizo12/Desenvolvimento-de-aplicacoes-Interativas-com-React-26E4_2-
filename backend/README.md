# Backend — Gerenciador de Estoque

API REST de produtos, categorias e fornecedores, implementada com Java 21 e Spring Boot. Este documento descreve execução e desenvolvimento **sem Docker**. A inicialização conteinerizada e integrada com o frontend está documentada no [README principal](../README.md).

## Requisitos

- JDK 21.
- MySQL 8.4 em execução local, acessível em `localhost:3306`.
- Maven Wrapper incluído no projeto.

## Preparar o banco local

Na raiz do repositório, execute o script SQL de desenvolvimento em uma instância MySQL local:

```powershell
Push-Location .\backend
cmd.exe /c "mysql -u root -p < mysql\init-dev.sql"
Pop-Location
```

O script cria o banco `estoque_principal`, tabelas e usuário da aplicação. As configurações locais esperadas estão em `backend/api/src/main/resources/application-dev.properties` e `backend/api/src/main/resources/env.dev`. Não altere `ddl-auto=none`: o schema é gerenciado pelo script SQL.

## Executar a API

No PowerShell:

```powershell
cd .\backend\api
.\mvnw.cmd spring-boot:run
```

Por padrão, a aplicação usa o profile `dev` e a porta `8080`. Para compilar e executar os testes:

```powershell
.\mvnw.cmd clean test
```

## API e documentação

- Base de rotas: `http://localhost:8080/com/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`

| Recurso | Operações |
|---|---|
| `/produtos` | GET, GET por ID, POST, PUT por ID e DELETE por ID |
| `/categorias` | GET e POST |
| `/fornecedores` | GET e POST |
| `/fornecedores/importacao` | PUT multipart, com o campo `arquivo` |

A importação CSV é síncrona. O arquivo deve conter as colunas `nome,cnpj,telefone,email,endereco`; registros duplicados pelo CNPJ são ignorados. A API retorna uma mensagem com os totais inseridos e ignorados.

## Estrutura

- `api/src/main/java/com/api`: controllers, configuração CORS, documentação e tratamento de erros.
- `api/src/main/java/com/produto`, `categoria` e `fornecedor`: entidades, DTOs, repositórios e regras de negócio.
- `api/src/main/resources`: configuração Spring e profiles.
- `mysql/init-dev.sql` e `mysql/init-prod.sql`: inicialização dos schemas.
- `api/src/test`: testes automatizados.

Para executar em containers, o backend e o banco usam `backend/docker-compose.yml`; o frontend tem configuração independente em `frontend/docker-compose.yml`. Os scripts da raiz e os comandos para cada parte estão descritos no README principal.
