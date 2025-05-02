import { Project, SyntaxKind, StructureKind } from 'ts-morph';
import { textSync } from 'figlet';
import path from 'path';
import fs from 'fs';

export const initStore = async () => {
  console.log(textSync("Any"));

  // Configura o tsconfig.json
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  let tsConfig: any = {};

  if (fs.existsSync(tsConfigPath)) {
    console.log(fs.readFileSync(tsConfigPath, 'utf-8'));
    
    tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8').replace(/'/g, '"').replace(/(\w+):/g, '"$1":'));
  }

  // Configura os paths para usar @ como root do src
  tsConfig.compilerOptions = {
    ...tsConfig.compilerOptions,
    baseUrl: ".",
    paths: {
      ...tsConfig.compilerOptions?.paths,
      "@/*": ["src/*"]
    }
  };

  // Salva o tsconfig.json atualizado
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));

  // Inicializa o projeto ts-morph
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
  });

  // Cria os diretórios necessários
  const directories = [
    'src/redux-store/hooks',
    'src/@types/redux',
    'src/utils/redux'
  ];

  directories.forEach(dir => {
    project.createDirectory(dir);
  });

  // Cria o arquivo de utilitários
  const utilsFile = project.createSourceFile(
    'src/utils/redux/index.ts',
    {
      statements: [
        {
          kind: StructureKind.Function,
          name: 'createSelector',
          parameters: [
            { name: 'state', type: 'any' },
            { name: 'selector', type: '(state: any) => any' }
          ],
          returnType: 'any',
          statements: 'return selector(state);'
        }
      ]
    },
    { overwrite: true }
  );

  // Cria o arquivo de tipos
  const typesFile = project.createSourceFile(
    'src/@types/redux/index.d.ts',
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@reduxjs/toolkit',
          namedImports: ['PayloadAction']
        },
        {
          kind: StructureKind.Interface,
          name: 'RootState',
          properties: [
            {
              name: 'state',
              type: 'any'
            }
          ]
        }
      ]
    },
    { overwrite: true }
  );

  // Cria o arquivo da store
  const storeFile = project.createSourceFile(
    'src/redux-store/store.ts',
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@reduxjs/toolkit',
          namedImports: ['configureStore']
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@/redux-store/root-reducer',
          namedImports: ['rootReducer']
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@/@types/redux',
          namedImports: ['RootState']
        },
        {
          kind: StructureKind.VariableStatement,
          declarations: [
            {
              name: 'store',
              initializer: 'configureStore({ reducer: rootReducer })'
            }
          ]
        },
        {
          kind: StructureKind.ExportDeclaration,
          namedExports: ['store']
        }
      ]
    },
    { overwrite: true }
  );

  // Cria o arquivo do root reducer
  const rootReducerFile = project.createSourceFile(
    'src/redux-store/root-reducer.ts',
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@reduxjs/toolkit',
          namedImports: ['combineReducers']
        },
        {
           kind: StructureKind.VariableStatement,
           declarations: [
            {
              name: 'propsCombineReducer',
              initializer: '{}'
            }
           ]
        },
        {
          kind: StructureKind.VariableStatement,
          declarations: [
            {
              name: 'rootReducer',
              initializer: 'combineReducers(propsCombineReducer)'
            }
          ]
        },
        {
          kind: StructureKind.ExportDeclaration,
          namedExports: ['rootReducer']
        }
      ]
    },
    { overwrite: true }
  );

  // Cria o arquivo de hooks
  const hooksFile = project.createSourceFile(
    'src/redux-store/hooks/index.ts',
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: 'react-redux',
          namedImports: ['useSelector', 'useDispatch']
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@/redux-store/store',
          namedImports: ['store']
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: '@/@types/redux',
          namedImports: ['RootState']
        },
        {
          kind: StructureKind.TypeAlias,
          name: 'AppDispatch',
          type: 'typeof store.dispatch'
        },
        {
          kind: StructureKind.VariableStatement,
          declarations: [
            {
              name: 'useAppDispatch',
              initializer: '() => useDispatch<AppDispatch>()'
            }
          ]
        },
        {
          kind: StructureKind.VariableStatement,
          declarations: [
            {
              name: 'useAppSelector',
              initializer: '<T>(selector: (state: RootState) => T) => useSelector<RootState, T>(selector)'
            }
          ]
        },
        {
          kind: StructureKind.ExportDeclaration,
          namedExports: ['useAppDispatch', 'useAppSelector']
        }
      ]
    },
    { overwrite: true }
  );

  // Salva todos os arquivos
  await project.save();
};

//   const result = await inquirer.prompt([
//     {
//       type: "list",
//       name: "type",
//       message: "What type project? \n",
//       choices: ["Nextjs", "Reactjs"]
//     }
//   ])

 
//   fs.writeFileSync(`any.json`, `
// {
//   "type_project": "${result.type}"
// }    
// `);