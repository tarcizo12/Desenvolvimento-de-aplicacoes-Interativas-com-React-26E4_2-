# Front-end: React + TypeScript + Vite

Interface web do Gerenciador de Estoque, construída com React, TypeScript e Vite.

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

A aplicação abre em `http://localhost:5173`.

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
- **Porta 5173 em uso:** o Vite escolhe outra porta e mostra a nova URL no terminal.