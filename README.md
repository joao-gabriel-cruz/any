# Any

Uma CLI poderosa para gerenciar configurações e features do Redux em projetos TypeScript.

## 🚀 Funcionalidades

- Inicializar estrutura do Redux store
- Criar novas features do Redux
- Combinar múltiplas features
- Gerar tipos TypeScript e utilitários
- Geração de código programática usando ts-morph

## 📦 Instalação

```bash
npm install -g any
```

## 🛠️ Como Usar

### Inicializar Projeto
Inicializar uma nova estrutura de Redux store no seu projeto:
```bash
any --init
# ou
any -i
```

### Criar uma Nova Feature
Criar uma nova feature do Redux com todos os arquivos necessários:
```bash
any --feature <nome-da-feature>
# ou
any -f <nome-da-feature>
```

### Combinar Features
Combinar múltiplas features em uma única store:
```bash
any --combine <nome-da-feature>
# ou
any -c <nome-da-feature>
```

### Criar e Combinar Feature
Criar uma nova feature e combiná-la em um único comando:
```bash
any --feature <nome-da-feature> --combine <nome-da-feature>
# ou
any -f <nome-da-feature> -c <nome-da-feature>
```

### Verificar Versão
Verificar a versão atual da CLI:
```bash
any --version
# ou
any -v
```

## 📁 Estrutura do Projeto

```
src/
├── @types/           # Definições de tipos TypeScript
├── redux-store/      # Configuração do Redux store
│   ├── features/     # Implementações individuais de features
│   ├── hooks/        # Hooks personalizados do Redux
│   ├── root-reducer.ts
│   └── store.ts
├── use-cases/        # Implementações da funcionalidade principal
└── utils/            # Funções utilitárias
```

## 🔧 Desenvolvimento

Para contribuir com este projeto:

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Faça suas alterações
4. Envie um pull request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.