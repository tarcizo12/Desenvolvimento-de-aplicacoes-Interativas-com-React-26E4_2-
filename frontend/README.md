# Front-end: React + TypeScript + Vite

Interface do Gerenciador de Estoque, construída com React, TypeScript, Vite, React Router, TanStack Query e componentes de tabela/feedback do Material UI.

## Pré-requisito

Node.js 20.19+ ou 22.12+. Confira com:

```bash
node -v
```

## Como executar

Na pasta `frontend`:

```bash
npm install
npm run dev
```

A aplicação abre em `http://localhost:8082` e consome a API em
`http://localhost:8080/com/api`. Inicie o backend antes de usar as páginas.
O endereço da API pode ser alterado em `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080/com/api
```

O acesso inicial é uma rota protegida demonstrativa por nome de sessão no
navegador; não representa autenticação e não protege a API.

Na raiz do repositório, os scripts [`iniciar-backend.bat`](../iniciar-backend.bat)
e [`iniciar-frontend.bat`](../iniciar-frontend.bat) iniciam cada parte na ordem.

## Comandos disponíveis

| Comando           | O que faz                                 |
|-------------------|-------------------------------------------|
| `npm run dev`     | Inicia o servidor de desenvolvimento      |
| `npm run build`   | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Serve localmente o build de produção      |
| `npm run lint`    | Executa o linter                          |

## Problemas comuns

- **`npm` bloqueado no PowerShell** (execução de scripts desabilitada): rode uma vez `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, ou use `npm.cmd` no lugar de `npm`.
- **`node` não reconhecido:** instale o Node.js LTS e abra um novo terminal.
- **Porta em uso:** o Vite escolhe outra porta e mostra a nova URL no terminal.