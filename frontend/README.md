# Frontend — Gerenciador de Estoque

Interface React + TypeScript construída com Vite. Este documento é para desenvolvimento local **sem Docker**; o frontend conteinerizado e integrado à API é iniciado pelos scripts descritos no [README principal](../README.md).

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.
- API disponível em `http://localhost:8080` para executar operações que acessam dados.

## Instalação e execução local

Na pasta `frontend`:

```powershell
npm ci
npm run dev
```

Abra `http://localhost:8082`. Por padrão, a interface chama `http://localhost:8080/com/api`.

Para configurar outro endereço da API, crie `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080/com/api
```

Variáveis `VITE_*` são incluídas no bundle no momento do build; reinicie o Vite depois de alterá-las.

## Comandos

| Comando | Uso |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Verificação TypeScript e build de produção em `dist/` |
| `npm run preview` | Servir localmente o build de produção |
| `npm run lint` | Executar ESLint |

## Organização técnica

- `src/features`: páginas, tipos e serviços agrupados por domínio.
- `src/utils/api.ts`: cliente Fetch com tratamento de respostas, timeout e cancelamento.
- `src/auth`: contexto da sessão demonstrativa e guarda de rota.
- `src/hooks`: hooks reutilizáveis.
- `src/components`: layout e componentes reutilizáveis de tabela, feedback e confirmação.

TanStack Query gerencia cache, loading e invalidação após mutações. A entrada por nome serve apenas para demonstrar rotas protegidas no cliente; não é autenticação e não protege a API.

## Testes locais

```powershell
npm run lint
npm run build
```

O Dockerfile, a configuração Nginx e o Compose independente da aplicação estão na pasta do frontend. A inicialização conteinerizada é feita por `iniciar-frontend.bat` no Windows ou pelo comando Docker Compose descrito no README principal.