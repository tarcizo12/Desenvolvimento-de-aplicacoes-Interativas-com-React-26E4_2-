# Como executar o front-end (React + Vite)

## Pré-requisito

Node.js 20.19+ ou 22.12+. Confira com:

```bash
node -v
```

## Criar o projeto (uma única vez)

```bash
npm create vite@latest estoque-frontend -- --template react-ts
cd estoque-frontend
npm install
```

## Executar

```bash
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Outros comandos

| Comando           | O que faz                                  |
|-------------------|--------------------------------------------|
| `npm run dev`     | Servidor de desenvolvimento                |
| `npm run build`   | Gera a versão de produção na pasta `dist`  |
| `npm run preview` | Serve localmente o build de produção       |
