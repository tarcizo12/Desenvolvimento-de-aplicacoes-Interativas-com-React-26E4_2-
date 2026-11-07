# Frontend — Gerenciador de Estoque

Interface React + TypeScript criada com Create React App (`react-scripts`). Este documento é para desenvolvimento local **sem Docker**; o frontend conteinerizado é iniciado separadamente conforme o [README principal](../README.md).

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.
- API disponível em `http://localhost:8080` para executar operações que acessam dados.

## Instalação e execução local

Na pasta `frontend`, instale as dependências e inicie o servidor CRA:

```powershell
npm ci
npm start
```

Abra `http://localhost:8082`. O projeto configura essa porta no arquivo `.env`; por padrão, a interface chama `http://localhost:8080/com/api`.

Para configurar outro endereço da API, altere `REACT_APP_API_BASE_URL` no `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/com/api
```

Variáveis `REACT_APP_*` são incluídas no bundle no momento do build; reinicie o servidor depois de alterá-las.

## Comandos

| Comando | Uso |
|---|---|
| `npm start` | Servidor de desenvolvimento Create React App |
| `npm run build` | Verificação TypeScript e build de produção em `build/` |
| `npm test` | Testes unitários com Jest |
| `npm run lint` | Executar ESLint |

## Organização técnica

- `src/features`: páginas, tipos e serviços agrupados por domínio.
- `src/utils/api.ts`: cliente Fetch com tratamento de respostas, timeout e cancelamento.
- `src/store`: Redux Toolkit store, slice de sessão e hooks tipados (`useSelector`/`useDispatch`).
- `src/hooks`: hooks reutilizáveis.
- `src/components`: layout e componentes reutilizáveis de tabela, feedback e confirmação.
- `src/components/ErrorBoundary.tsx`: componente de classe que captura erros de renderização; as páginas e demais componentes são funcionais.

Redux gerencia a sessão demonstrativa da interface; ações `loggedIn` e `loggedOut` atualizam o store e a renderização observa o estado com `useSelector`. TanStack Query gerencia cache, carregamento, erros e invalidação dos dados da API após mutações. O cadastro de fornecedor consulta o serviço externo ViaCEP por Fetch para preencher o endereço a partir do CEP.

## Testes locais

```powershell
npm test
npm run lint
npm run build
```

Para uma checagem manual de compatibilidade, execute `npm start` e repita o fluxo de login, navegação e consulta de páginas em cada navegador disponível (por exemplo, Chrome, Edge, Firefox ou Safari). Confirme que as telas carregam, os formulários aceitam entrada e os erros são exibidos. Essa verificação não instala navegadores ou ferramentas extras. Para depuração, use as ferramentas de desenvolvedor do navegador; o Error Boundary também exibe uma mensagem de recuperação e registra detalhes técnicos no console.

O Dockerfile, a configuração Nginx e o Compose independente da aplicação estão na pasta do frontend. Para inicializar via automação, use [`iniciar-frontend.bat`](../scripts/windows/iniciar-frontend.bat) no Windows ou `scripts/linux/iniciar-frontend.sh` no Linux/macOS, conforme as instruções do README principal.