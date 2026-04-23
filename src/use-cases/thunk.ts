import fs from 'node:fs';
import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph';
import { templateCreateUseCase } from '../templates/create-usecase-template';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const featurePath = (feature: string, combineRoot?: string) =>
  combineRoot
    ? `src/redux-store/features/${combineRoot}/${feature}`
    : `src/redux-store/features/${feature}`;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const createThunk = (
  name: string,
  feature: string,
  combineRoot?: string,
) => {
  const upName = cap(name);
  const upFeature = cap(feature);
  const base = featurePath(feature, combineRoot);

  if (!fs.existsSync(base)) {
    console.error(`Feature ${feature} does not exist`);
    return;
  }

  const extraReducerPath = `${base}/reducer/${feature}-extra.reducer.ts`;
  const useCasePath = `${base}/use-cases/${name}.usecases.ts`;
  const modulePath = `${base}/${feature}.module.ts`;

  if (fs.existsSync(useCasePath)) {
    console.error(`Thunk ${name} already exists in feature ${feature}`);
    return;
  }

  console.log(`Creating thunk ${name} in feature ${feature}`);

  addThunkToExtraReducer(extraReducerPath, upFeature, name, feature);
  templateCreateUseCase(project, useCasePath, upName, upFeature, !!combineRoot);
  wireThunkIntoModule(modulePath, upFeature, upName, name);

  project.saveSync();
};

const addThunkToExtraReducer = (
  filePath: string,
  upFeature: string,
  name: string,
  feature: string,
) => {
  const file = project.addSourceFileAtPath(filePath);
  const cls = file.getClassOrThrow(`${upFeature}ExtraReducers`);

  if (cls.getStaticProperty(name)) {
    return;
  }

  cls.addProperty({
    name,
    isStatic: true,
    initializer: `createAsyncThunk("${feature}/${name}", async () => {\n    const result = new Promise<any>((resolve) => {\n      setTimeout(() => {\n        resolve({} as any);\n      }, 1000);\n    });\n    return result;\n  })`,
  });
};

const wireThunkIntoModule = (
  filePath: string,
  upFeature: string,
  upName: string,
  name: string,
) => {
  const file = project.addSourceFileAtPath(filePath);

  file.addImportDeclaration({
    moduleSpecifier: `./use-cases/${name}.usecases`,
    namedImports: [`${upName}${upFeature}UseCases`],
  });

  file.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${name}${upFeature}`,
        initializer: `${upFeature}ExtraReducers.${name}`,
      },
    ],
  });

  const moduleVar = file.getVariableDeclarationOrThrow(`${upFeature}Module`);
  const moduleStatement = moduleVar.getVariableStatementOrThrow();

  file.insertVariableStatement(moduleStatement.getChildIndex(), {
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name,
        initializer: `combineUseCasesWithExtraReducers({\n  useCase: new ${upName}${upFeature}UseCases(),\n  extraReducers: ${name}${upFeature},\n})`,
      },
    ],
  });

  const arrow = moduleVar.getInitializerIfKindOrThrow(SyntaxKind.ArrowFunction);
  const body = arrow.getBody();

  if (body.getKind() !== SyntaxKind.Block) {
    throw new Error(`${upFeature}Module body is not a block`);
  }

  body.asKindOrThrow(SyntaxKind.Block).addStatements([
    '',
    `builder.addCase(${name}.fulfilled.extra, ${name}.fulfilled.useCase);`,
    `builder.addCase(${name}.pending.extra, ${name}.pending.useCase);`,
    `builder.addCase(${name}.rejected.extra, ${name}.rejected.useCase);`,
  ]);
};
