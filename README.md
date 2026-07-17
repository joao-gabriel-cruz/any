# Any

CLI para gerar e evoluir a camada Redux (slices, reducers, use-cases e thunks) em projetos TypeScript — usando [ts-morph](https://ts-morph.com/) para manipular AST em vez de templates de string.

> Por que ts-morph? Gerar código por AST evita bugs de indentação, imports quebrados e strings fora de sincronia com a tipagem. Cada comando do `any` abre o `tsconfig.json` do seu projeto, modifica arquivos existentes (ex.: o `root-reducer`) e escreve os novos — tudo respeitando o AST do TypeScript.

## Sumário

- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Comandos](#comandos)
- [Convenções do código gerado](#convenções-do-código-gerado)
  - [Exemplo — código gerado por `any --feature`](#exemplo--código-gerado-por-any---feature-teste)
- [Estrutura do projeto gerado](#estrutura-do-projeto-gerado)
  - [Exemplo — scaffold gerado por `any --init`](#exemplo--scaffold-gerado-por-any---init)
- [O que dá para criar a partir dos arquivos](#o-que-dá-para-criar-a-partir-dos-arquivos)
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

### Exemplo — código gerado por `any --feature teste`

<details>
<summary><code>teste.slice.ts</code> — <code>createSlice</code> + estado + actions</summary>

```ts
import { createSlice } from "@reduxjs/toolkit";
import { TesteModule } from "./teste.module";
import { TesteReducer } from "./reducer/teste.reducer";
import { ReduxState } from "@/@types/redux/redux";

export type StateTeste = any;

export const initialStateTeste: ReduxState<StateTeste> = {
  old: null,
  error: "",
  status: "idle",
  data: {},
};

export const testeSlice = createSlice({
  name: "general",
  initialState: initialStateTeste,
  reducers: TesteReducer,
  extraReducers: TesteModule,
});

export const { setTeste, rollbackTeste } = testeSlice.actions;
```

</details>

<details>
<summary><code>teste.module.ts</code> — costura use-cases + extra reducers via <code>builder.addCase</code></summary>

```ts
import { ReduxModule } from "../../../@types/redux/redux";
import { SaveTesteUseCases } from "./use-cases/save.usecases";
import { InitTesteUseCases } from "../teste/use-cases/init.usecases";
import { combineUseCasesWithExtraReducers } from "../../../utils/redux/redux";
import { TesteExtraReducers } from "./reducer/teste-extra.reducer";

export const initTeste = TesteExtraReducers.init;
export const saveTeste = TesteExtraReducers.save;

const init = combineUseCasesWithExtraReducers({
  useCase: new InitTesteUseCases(),
  extraReducers: initTeste,
});

const save = combineUseCasesWithExtraReducers({
  useCase: new SaveTesteUseCases(),
  extraReducers: saveTeste,
});

export const TesteModule: ReduxModule<any> = (builder) => {
  builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);
  builder.addCase(init.pending.extra, init.pending.useCase);
  builder.addCase(init.rejected.extra, init.rejected.useCase);

  builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);
  builder.addCase(save.pending.extra, save.pending.useCase);
  builder.addCase(save.rejected.extra, save.rejected.useCase);
};
```

</details>

<details>
<summary><code>use-cases/index.ts</code> — classe base <code>TesteUseCases</code> (<code>pending</code>/<code>rejected</code> compartilhados)</summary>

```ts
import {
  ActionExtraReducer,
  ReduxState,
  ReduxUseCases,
} from "../../../@types/redux/redux";

export class TesteUseCases implements ReduxUseCases {
  fulfilled(state: ReduxState<any>, action: ActionExtraReducer<any>): void {
    throw new Error("Method not implemented.");
  }
  pending(state: ReduxState<any>): void {
    state.status = "loading";
  }
  rejected(state: ReduxState<any>, action: any): void {
    state.status = "failed";
    state.error = action.error.message ?? "Erro desconhecido";
    state.data = action.payload;
  }
}
```

</details>

<details>
<summary><code>use-cases/init.usecases.ts</code> e <code>save.usecases.ts</code> — sobrescrevem <code>fulfilled</code></summary>

```ts
// init.usecases.ts
import { ReduxState } from "../../../@types/redux/redux";
import { TesteUseCases } from ".";
import { StateTeste } from "../teste.slice";

export class InitTesteUseCases extends TesteUseCases {
  fulfilled(state: ReduxState<StateTeste>): void {
    state.status = "succeeded";
    state.error = "";
    state.old = null;
  }
}
```

`save.usecases.ts` é análogo, com a classe `SaveTesteUseCases extends TesteUseCases`.

</details>

<details>
<summary><code>reducer/teste.reducer.ts</code> — reducers síncronos (ex.: <code>rollback</code>)</summary>

```ts
import { current, PayloadAction } from "@reduxjs/toolkit";
import { StateTeste } from "../teste.slice";
import { ReduxState } from "../../../@types/redux/redux";

export const TesteReducer = () => {
  const rollbackTeste = (state: ReduxState<StateTeste>) => {
    if (state?.old) {
      state.data = state.old;
    }
    state.old = null;
  };

  return {
    rollbackTeste,
  };
};
```

</details>

<details>
<summary><code>reducer/teste-extra.reducer.ts</code> — os <code>createAsyncThunk</code> (init/save)</summary>

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

export class TesteExtraReducers {
  static init = createAsyncThunk("teste/init", async () => {
    const result = new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({} as any);
      }, 1000);
    });
    return result;
  });

  static save = createAsyncThunk("teste/save", async () => {
    const result = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    return result;
  });
}
```

</details>

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

### Exemplo — scaffold gerado por `any --init`

<details>
<summary><code>@types/redux/index.d.ts</code> — tipos base do padrão</summary>

```ts
export type ReduxStateStatus = "idle" | "loading" | "succeeded" | "failed";

export type ActionExtraReducer<T> = PayloadAction<
  T,
  string,
  {
    arg: any;
    requestId: string;
    requestStatus: "pending" | "fulfilled" | "rejected";
  },
  never
>;

export abstract class ReduxUseCases {
  abstract fulfilled(state: any, action: ActionExtraReducer<any>): void;
  abstract pending(state: any, action: ActionExtraReducer<typeof state>): void;
  abstract rejected(state: any, action: any): void;
}

export type ReduxModule<T> = (builder: ActionReducerMapBuilder<T>) => void;

export type ReduxState<T> = {
  old: T | null;
  data: T;
  error: string;
  status: ReduxStateStatus;
};
```

</details>

<details>
<summary><code>utils/redux/index.ts</code> — <code>combineUseCasesWithExtraReducers</code></summary>

```ts
import { AsyncThunk } from "@reduxjs/toolkit";
import { ReduxUseCases } from "../../@types/redux/redux";

interface CombineProps {
  useCase: ReduxUseCases;
  extraReducers: AsyncThunk<any, any, any>;
}

export const combineUseCasesWithExtraReducers = (props: CombineProps) => {
  const { useCase, extraReducers } = props;
  const { fulfilled: fulfilledUseCase, pending: pendingUseCase, rejected: rejectedUseCase } = useCase;
  const { pending: extraPending, fulfilled: extraFulfilled, rejected: extraReject } = extraReducers;

  return {
    pending: { useCase: pendingUseCase, extra: extraPending },
    fulfilled: { useCase: fulfilledUseCase, extra: extraFulfilled },
    rejected: { useCase: rejectedUseCase, extra: extraReject },
  };
};
```

</details>

<details>
<summary><code>redux-store/store.ts</code> e <code>hooks/index.ts</code> — store tipada + hooks</summary>

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";

export const makeStore = () => {
  return configureStore({ reducer: rootReducer });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
```

```ts
// hooks/index.ts
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "../store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
```

</details>

<details>
<summary>Feature-pai (<code>--combine</code>) — <code>combineSlices</code></summary>

```ts
// config.slice.ts — gerado por `any --combine config` + features filhas
import { combineSlices } from "@reduxjs/toolkit";
import { chatSlice } from "./chat/chat.slice";
import { geralSlice } from "./geral/geral.slice";

export const configSlice = combineSlices(chatSlice, geralSlice);
```

</details>

## O que dá para criar a partir dos arquivos

Os arquivos gerados já expõem tudo o que você precisa para consumir a feature: a store tipada, os hooks (`useAppSelector`/`useAppDispatch`), os thunks (`initTeste`/`saveTeste`, exportados pelo `module.ts`) e as actions síncronas (`rollbackTeste`). O que fica por sua conta é **preencher a lógica de negócio** dentro dos pontos de extensão. Abaixo, o fluxo completo usando a feature `teste`.

### 1. Consumir a feature em um componente

O estado de cada feature segue a forma `ReduxState<T>` (`{ data, old, error, status }`), então dá para reagir ao `status` sem escrever nenhum boilerplate de loading/erro:

```tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { initTeste, rollbackTeste } from "@/features/teste/teste.module";

export function TesteView() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((s) => s.teste);

  useEffect(() => {
    dispatch(initTeste()); // dispara o createAsyncThunk "teste/init"
  }, [dispatch]);

  if (status === "loading") return <p>Carregando…</p>;
  if (status === "failed") return <p>Erro: {error}</p>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => dispatch(rollbackTeste())}>Desfazer</button>
    </div>
  );
}
```

### 2. Preencher a lógica real do thunk

O `teste-extra.reducer.ts` nasce com um `setTimeout` de placeholder. Troque pela sua chamada de API — a tipagem do `ReduxState<T>` acompanha o retorno:

```ts
// reducer/teste-extra.reducer.ts
static init = createAsyncThunk("teste/init", async (id: string) => {
  const res = await fetch(`/api/teste/${id}`);
  return (await res.json()) as StateTeste;
});
```

Depois, defina o que acontece no sucesso dentro do use-case — o `fulfilled` é o único ponto que você sobrescreve; `pending`/`rejected` já vêm prontos da classe base:

```ts
// use-cases/init.usecases.ts
export class InitTesteUseCases extends TesteUseCases {
  fulfilled(state: ReduxState<StateTeste>, action: ActionExtraReducer<StateTeste>): void {
    state.status = "succeeded";
    state.old = state.data;      // guarda o valor anterior…
    state.data = action.payload; // …e aplica o novo
  }
}
```

### 3. Rollback otimista de graça

Como o `fulfilled` guarda `state.old`, a action síncrona `rollbackTeste` (no `teste.reducer.ts`) restaura o valor anterior sem nenhuma ida ao servidor — útil para "desfazer" ou para reverter uma atualização otimista que falhou.

### 4. Estender a feature sem editar na mão

Precisa de mais uma operação assíncrona além de `init`/`save`? Não crie o `createAsyncThunk` + use-case + wiring do `module.ts` manualmente — a CLI faz o `addCase` correto no AST:

```bash
any --thunk loadProfile --feature teste
# adiciona TesteExtraReducers.loadProfile, LoadProfileTesteUseCases
# e o builder.addCase correspondente no teste.module.ts
```

E para agrupar várias features sob um mesmo domínio (ex.: `user`), o `--combine` gera o `combineSlices` que costura os slices filhos — veja o exemplo em [Estrutura do projeto gerado](#exemplo--scaffold-gerado-por-any---init).

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
