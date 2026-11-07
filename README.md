# Gerenciador de Estoque

## 1. Título do projeto

**Gerenciador de Estoque** — aplicação web para organizar produtos, categorias e fornecedores.

## 2. Objetivo do projeto

O projeto oferece uma interface para manter um catálogo de produtos e suas informações de estoque, relacionando cada produto a uma categoria e a um fornecedor. Também permite cadastrar fornecedores individualmente ou importar seus dados a partir de um arquivo CSV. A API valida e persiste os registros em MySQL.

## 3. Features implementadas

- **Produtos:** listar, cadastrar, editar e excluir produtos. O modelo diferencia produtos perecíveis (validade e lote) e não perecíveis (meses de garantia).
- **Categorias:** listar e cadastrar categorias para classificar os produtos.
- **Fornecedores:** listar e cadastrar fornecedores, além de importar CSV de forma síncrona. A resposta da API informa quantos registros foram criados e quantos duplicados foram ignorados.
- **Interface reativa:** formulários controlados, tabelas, confirmação de exclusão e estados visíveis de carregamento, sucesso e erro.
- **Navegação:** páginas distintas com React Router. O acesso inicial por nome é uma proteção demonstrativa do frontend, não uma autenticação.
- **Persistência e validação:** API REST em Spring Boot, regras de domínio e persistência relacional em MySQL.

> A rota de entrada demonstrativa não autentica o usuário e não protege os endpoints da API.

## 4. Tecnologias utilizadas

- **Frontend:** React 19, TypeScript, Vite, React Router, TanStack Query, Material UI, Fetch API e CSS.
- **Backend:** Java 21, Spring Boot, Spring Web, Spring Validation, Spring Data JPA, OpenFeign e Springdoc OpenAPI.
- **Dados:** MySQL 8.4.
- **Ambiente conteinerizado:** Docker, Docker Compose, Node.js 22 e Nginx para servir o build estático do frontend.
- **Testes:** JUnit 5, Mockito e Spring Boot Test.

## 5. Instruções de execução

### Requisitos

- Docker instalado e em execução. No Windows, use o Docker Desktop; no Linux, Docker Engine e o plugin Docker Compose; no macOS, Docker Desktop.
- Git, para clonar o repositório.
- Não é necessário instalar Node.js ou Java no computador para a execução via scripts Docker. Para desenvolvimento local sem Docker, veja os READMEs de [backend](./backend/README.md) e [frontend](./frontend/README.md).

### Subir a aplicação

1. Clone o repositório:

   ```powershell
   git clone https://github.com/tarcizo12/Desenvolvimento-de-aplicacoes-Interativas-com-React-26E4_2-.git
   cd Desenvolvimento-de-aplicacoes-Interativas-com-React-26E4_2-
   ```

2. Inicie o Docker Desktop e aguarde até que ele esteja pronto.
3. Execute [`iniciar-backend.bat`](./iniciar-backend.bat). O script constrói e inicia a API e o MySQL de desenvolvimento.
4. Execute [`iniciar-frontend.bat`](./iniciar-frontend.bat). O script constrói a imagem React/Nginx, inicia somente o frontend e abre o navegador.
5. Acesse:
   - Aplicação: [http://localhost:8082](http://localhost:8082)
   - API: [http://localhost:8080](http://localhost:8080)
   - Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Cada parte possui sua própria configuração Compose: [`backend/docker-compose.yml`](./backend/docker-compose.yml) para API e bancos, e [`frontend/docker-compose.yml`](./frontend/docker-compose.yml) para a interface. Assim, é possível construir, iniciar ou atualizar uma parte sem recriar a outra. A primeira execução baixa as imagens-base e compila as aplicações, podendo levar alguns minutos. O frontend é servido em um container Nginx e chama a API em `http://localhost:8080/com/api`. Para usar outro endereço, defina `VITE_API_BASE_URL` antes de construir a imagem; essa variável é aplicada no build do frontend.

### Linux e macOS

Em sistemas sem suporte a arquivos `.bat`, execute os comandos Docker Compose separadamente, a partir da raiz do repositório. Inicie API e banco:

```bash
docker compose -f backend/docker-compose.yml up --build -d api
```

O banco de desenvolvimento é iniciado automaticamente como dependência da API. Em seguida, construa e inicie somente o frontend:

```bash
docker compose -f frontend/docker-compose.yml up --build -d
```

O frontend pode iniciar independentemente, mas as operações de dados precisam da API em execução. Acompanhe os logs de cada parte com `docker compose -f backend/docker-compose.yml logs -f` ou `docker compose -f frontend/docker-compose.yml logs -f`. A aplicação fica disponível em `http://localhost:8082`.

### Encerrar ou recomeçar

Execute [`parar-aplicacao.bat`](./parar-aplicacao.bat) para encerrar frontend, API e bancos. Por padrão, o script preserva os volumes MySQL. Confirme a opção de apagar volumes somente se quiser excluir os dados e inicializar os bancos do zero.

Execute [`parar-aplicacao.bat`](./parar-aplicacao.bat) para encerrar as duas partes. No Linux ou macOS, a partir da raiz do repositório, encerre os Compose separadamente:

```bash
docker compose -f backend/docker-compose.yml down --remove-orphans
docker compose -f frontend/docker-compose.yml down --remove-orphans
```

Para apagar também os dados persistidos no MySQL e recomeçar com bancos vazios, use `docker compose -f backend/docker-compose.yml down --volumes --remove-orphans`. Essa opção remove permanentemente os volumes do banco. A configuração do frontend não possui volumes persistentes.

Os bancos de desenvolvimento e produção usam volumes separados. A aplicação inicia o ambiente de desenvolvimento. As tabelas são criadas pelo script [`init-dev.sql`](./backend/mysql/init-dev.sql) no primeiro início do volume.

### Endpoints principais

- Produtos: `/com/api/produtos` (CRUD).
- Categorias: `/com/api/categorias` (listagem e cadastro).
- Fornecedores: `/com/api/fornecedores` (listagem e cadastro).
- Importação: `PUT /com/api/fornecedores/importacao`, multipart field `arquivo`.

## 6. Repositório GitHub

[tarcizo12/Desenvolvimento-de-aplicacoes-Interativas-com-React-26E4_2-](https://github.com/tarcizo12/Desenvolvimento-de-aplicacoes-Interativas-com-React-26E4_2-)

## 7. Screenshots e demonstração

As telas abaixo foram adicionadas ao repositório como imagens de referência da interface:

### Acesso demonstrativo

![Tela de acesso demonstrativo](./docs/images/Tela_Inicial.png)

### Listagem de produtos

![Tela de produtos](<./docs/images/Tela Produtos.png>)

### Formulário de produto

![Formulário de inclusão de produto](./docs/images/Formulario_Inclusao_Produto.png)

### Categorias

![Tela de categorias](./docs/images/Tela_Categorias.png)

### Fornecedores

![Tela de fornecedores](./docs/images/Tela_Fornecedores.png)

### Modelo de dados

![Diagrama de entidades](./docs/images/diagrama-entidades.png)

## 8. Considerações finais

O desenvolvimento reuniu uma interface React com formulários e navegação, uma API REST com persistência relacional e um processo Docker Compose para facilitar a execução completa. Entre os desafios estiveram alinhar os contratos entre frontend e backend, validar dados antes de persistir e deixar os serviços simples de iniciar em um ambiente de avaliação.

O projeto aplica conceitos de componentes, hooks, Context API, requisições assíncronas com tratamento de erros, rotas protegidas demonstrativas, serviços REST e modelagem com herança. A autenticação real e a proteção de API não fazem parte do escopo atual.
