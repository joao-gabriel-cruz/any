# Any

CLI para gerar e evoluir a camada Redux (slices, reducers, use-cases e thunks) em projetos TypeScript — usando [ts-morph](https://ts-morph.com/) para manipular AST em vez de templates de string.

> Por que ts-morph? Gerar código por AST evita bugs de indentação, imports quebrados e strings fora de sincronia com a tipagem. Cada comando do `any` abre o `tsconfig.json` do seu projeto, modifica arquivos existentes (ex.: o `root-reducer`) e escreve os novos — tudo respeitando o AST do TypeScript.

## Sumário

- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Comandos](#comandos)
- [Convenções do código gerado](#convenções-do-código-gerado)
- [Estrutura do projeto gerado](#estrutura-do-projeto-gerado)
- [Desenvolvimento](#desenvolvimento)

## Instalação

```bash
npm install -g any
# ou, sem instalar global, durante o desenvolvimento:
yarn dev -- --init
```

Requisitos: Node.js ≥ 18 e um projeto com `tsconfig.json` na raiz.

## Uso rápido

```bash
# 1. No seu projeto TS, inicialize o scaffold Redux
any --init

# 2. Crie uma feature simples
any --feature profile

# 3. Crie uma feature dentro de um grupo combinado
any --feature profile --combine user

# 4. Adicione um thunk a uma feature existente
any --thunk loadProfile --feature profile
```

## Comandos

| Comando | Flag curta | O que faz |
|---|---|---|
| `any --init` | `-i` | Cria o scaffold Redux (`store`, `root-reducer`, `hooks`, tipos e utils) e injeta o alias `@/*` no `tsconfig.json`. |
| `any --feature <name>` | `-f` | Cria uma feature isolada: `slice`, `module`, `reducer`, `extra-reducer` e use-cases (`init` / `save`). Registra o slice no `root-reducer`. |
| `any --combine <name>` | `-c` | Cria um grupo `combineSlices` (feature-pai que agrupa outras). |
| `any --feature <name> --combine <group>` | `-f … -c …` | Cria a feature dentro do grupo combinado e faz o wiring nos dois níveis. |
| `any --thunk <name> --feature <feat>` | `-t … -f …` | Adiciona um `createAsyncThunk` + use-case à feature existente. Aceita `--combine` se a feature está em um grupo. |
| `any --version` | `-v` | Mostra a versão. |

Todos os comandos que tocam a store exigem que `any --init` tenha sido rodado antes (a CLI verifica a existência de `src/redux-store`).

## Convenções do código gerado

Cada feature gerada segue este formato:

```
src/redux-store/features/<feature>/
├── <feature>.slice.ts       # createSlice + StateX + initialStateX + actions
├── <feature>.module.ts      # combineUseCasesWithExtraReducers + builder addCase
├── use-cases/
│   ├── index.ts             # classe base <Feature>UseCases implements ReduxUseCases
│   ├── init.usecases.ts     # Init<Feature>UseCases extends <Feature>UseCases
│   └── save.usecases.ts     # Save<Feature>UseCases extends <Feature>UseCases
└── reducer/
    ├── <feature>.reducer.ts        # reducers síncronos (rollback, …)
    └── <feature>-extra.reducer.ts  # createAsyncThunk estáticos (init/save)
```

O padrão separa **use-cases** (o que acontece no `fulfilled`/`pending`/`rejected`) de **extra reducers** (os `createAsyncThunk` em si), e o `module.ts` costura os dois via `combineUseCasesWithExtraReducers` (utilitário gerado pelo `--init`).

## Estrutura do projeto gerado

Após `any --init` seguido de `any --feature profile --combine user`:

```
src/
├── @types/redux/
│   └── index.d.ts           # ReduxState, ReduxUseCases, ActionExtraReducer, ReduxModule
├── redux-store/
│   ├── store.ts             # configureStore(rootReducer)
│   ├── root-reducer.ts      # combineReducers(propsCombineReducer)
│   ├── hooks/index.ts       # useAppDispatch, useAppSelector
│   └── features/
│       └── user/
│           ├── user.slice.ts          # combineSlices(profileSlice, …)
│           └── profile/
│               ├── profile.slice.ts
│               ├── profile.module.ts
│               ├── use-cases/
│               └── reducer/
└── utils/redux/
    └── index.ts             # combineUseCasesWithExtraReducers, …
```

## Desenvolvimento

```bash
yarn install
yarn dev -- --init           # roda a CLI direto do fonte via tsx
yarn test                    # roda a suíte Jest
yarn test:watch
```

A suíte cobre:

- **Templates** (`src/__tests__/templates.test.ts`) — cada gerador ts-morph é testado isoladamente com `Project({ useInMemoryFileSystem: true })`, validando imports, classes e tipos do AST gerado.
- **Integração** (`feature.test.ts`, `init.test.ts`) — criam um projeto sandbox em `os.tmpdir()`, rodam os comandos de verdade e conferem os arquivos produzidos.
- **CLI** (`main.test.ts`) — valida o dispatch dos flags do `commander` para os use-cases.

Para contribuir:

1. Fork + branch a partir de `main`.
2. `yarn test` precisa passar.
3. Abra um PR descrevendo o comportamento adicionado/alterado.

## Licença

MIT.
