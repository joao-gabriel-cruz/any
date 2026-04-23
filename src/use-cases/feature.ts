import fs from 'node:fs';
import { templateSlice } from '../templates/slice-feature-tamplate';
import { templateExtraReducer } from '../templates/extra-reducer-template';
import { templateReducer } from '../templates/reducer-template';
import { templateCreateUseCase } from '../templates/create-usecase-template';
import { templateIndexUseCase } from '../templates/index-usecase-template';
import { templateFeatureModule } from '../templates/feature-module-template';
import { Project, ts, VariableDeclarationKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

export const createCombine = (combineRoot: string) => {

  fs.mkdirSync(`src/redux-store/features/${combineRoot}`, { recursive: true });
  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${combineRoot}.slice.ts`, "");
  const combineFiles = project.addSourceFileAtPath(`src/redux-store/features/${combineRoot}/${combineRoot}.slice.ts`);

  combineFiles.addImportDeclaration({
    moduleSpecifier: `@reduxjs/toolkit`,
    namedImports: ["combineSlices"]
  });

  const rootReducerFiles = project.addSourceFileAtPath("src/redux-store/root-reducer.ts");


  const variebleRoot = rootReducerFiles.getVariableDeclarationOrThrow("propsCombineReducer");

  // Verifica se o combineRoot já existe no propsCombineReducer
  const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);
  const existCombine = objectLiteral.getChildren().find(child => child.getKind() === ts.SyntaxKind.PropertyAssignment && child.getText() === combineRoot);

  if (!existCombine) {
    console.error(`Combine ${combineRoot} already exists in propsCombineReducer`);

    rootReducerFiles.addImportDeclaration({
      moduleSpecifier: `@/features/${combineRoot}/${combineRoot}.slice`,
      namedImports: [`${combineRoot}Slice`]
    });


    objectLiteral.addPropertyAssignment({
      name: combineRoot,
      initializer: `${combineRoot}Slice`
    })
  }


  combineFiles.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: `${combineRoot}Slice`,
      initializer: `combineSlices()`
    }],
    isExported: true,
  });

  combineFiles.saveSync();
  rootReducerFiles.saveSync();
}



export const createCombineAndFeature = (name: string, combineRoot: string) => {

  const upName = name.charAt(0).toUpperCase() + name.slice(1);
  const existCombine = fs.existsSync(`src/redux-store/features/${combineRoot}`);
  const existFeature = fs.existsSync(`src/redux-store/features/${combineRoot}/${name}`);


  if (existFeature) {
    console.error(`Feature ${name} already exists in ${combineRoot}`);
    return;
  }

  if (!existCombine) {
    createCombine(combineRoot);
  }

  const base = `src/redux-store/features/${combineRoot}/${name}`;

  templateSlice(project, `${base}/${name}.slice.ts`, upName, true);
  templateFeatureModule(project, `${base}/${name}.module.ts`, upName, true);

  templateIndexUseCase(project, `${base}/use-cases/index.ts`, upName, true);
  templateCreateUseCase(project, `${base}/use-cases/init.usecases.ts`, "Init", upName, true);
  templateCreateUseCase(project, `${base}/use-cases/save.usecases.ts`, "Save", upName, true);

  templateExtraReducer(project, `${base}/reducer/${name}-extra.reducer.ts`, upName, true);
  templateReducer(project, `${base}/reducer/${name}.reducer.ts`, upName, true);

  const rootReducerFiles = project.addSourceFileAtPath("src/redux-store/root-reducer.ts");

  const variebleRoot = rootReducerFiles.getVariableDeclarationOrThrow("propsCombineReducer");

  const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);

  const existCombineFeature = objectLiteral.getChildren().find(child => child.getText().includes(combineRoot));

  if (!existCombineFeature) {
    rootReducerFiles.addImportDeclaration({
      moduleSpecifier: `@/features/${combineRoot}/${combineRoot}.slice`,
      namedImports: [`${combineRoot}Slice`]
    });

    objectLiteral.addPropertyAssignment({
      name: combineRoot,
      initializer: `${combineRoot}Slice`
    })
  }


  const combineSliceFiles = project.addSourceFileAtPath(`src/redux-store/features/${combineRoot}/${combineRoot}.slice.ts`);

  combineSliceFiles.addImportDeclaration({
    moduleSpecifier: `./${name}/${name}.slice`,
    namedImports: [`${name}Slice`]
  });

  const variebleCombine = combineSliceFiles.getVariableDeclarationOrThrow(`${combineRoot}Slice`);

  const objectLiteralCombine = variebleCombine.getInitializerIfKindOrThrow(ts.SyntaxKind.CallExpression);


  objectLiteralCombine.addArgument(`${name}Slice`);

  project.saveSync();

}

export const createFeature = (name: string) => {
  const upName = name.charAt(0).toUpperCase() + name.slice(1);
  const existFeature = fs.existsSync(`src/redux-store/features/${name}`);

  if (existFeature) {
    console.error(`Feature ${name} already exists`);
    return;
  }

  console.log(`Creating feature ${name}`);

  const base = `src/redux-store/features/${name}`;

  templateSlice(project, `${base}/${name}.slice.ts`, upName);
  templateFeatureModule(project, `${base}/${name}.module.ts`, upName);

  templateIndexUseCase(project, `${base}/use-cases/index.ts`, upName);
  templateCreateUseCase(project, `${base}/use-cases/init.usecases.ts`, "Init", upName);
  templateCreateUseCase(project, `${base}/use-cases/save.usecases.ts`, "Save", upName);

  templateExtraReducer(project, `${base}/reducer/${name}-extra.reducer.ts`, upName);
  templateReducer(project, `${base}/reducer/${name}.reducer.ts`, upName);

  const sourceFiles = project.addSourceFileAtPath("src/redux-store/root-reducer.ts");

  sourceFiles.addImportDeclaration({
    moduleSpecifier: `@/features/${name}/${name}.slice`,
    namedImports: [`${name}Slice`]
  });

  const variebleRoot = sourceFiles.getVariableDeclarationOrThrow("propsCombineReducer");

  const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);

  objectLiteral.addPropertyAssignment({
    name: name,
    initializer: `${name}Slice.reducer`
  })

  project.saveSync();

}
