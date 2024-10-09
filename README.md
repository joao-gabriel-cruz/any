# Any

<p>
  Any é uma cli para agilizar o desenvolvimento com Redux toolkit.
</p>

## Estrutura de pastas do projeto gerado

```
src
├── @types
│   └── redux.d.ts
├── store-redux
│   ├── hooks
│   │   └── index.ts
│   ├── features
│   │   ├── theme
│   │   │   ├── theme-slice.ts
│   │   │   ├── theme.module.ts
│   │   │   ├── use-cases
│   │   │   │    ├ index.ts
│   │   │   │    ├ init.usecases.ts
│   │   │   │    ├ save.usecases.ts
│   │   │   │    ...
│   │   │   └── reducer
│   │   │       ├── theme-extra-reducer.ts
│   │   │       └── theme-reducer.ts
│   │
│   ├── root-reducer.ts
│   └── store.ts
└── utils
    └── redux
        └── index.ts
```