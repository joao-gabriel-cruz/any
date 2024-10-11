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
 
  
 
  fs.mkdirSync(`src/redux-store/features/${combineRoot}`,{ recursive: true });
  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${combineRoot}.slice.ts`, "");
  const combineFiles = project.addSourceFileAtPath(`src/redux-store/features/${combineRoot}/${combineRoot}.slice.ts`);

  combineFiles.addImportDeclaration({
    moduleSpecifier: `@reduxjs/toolkit`,
    namedImports: ["combineSlices"]
  });

  combineFiles.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: `${combineRoot}Slice`,
      initializer: `combineSlices()`
    }],
    isExported: true,
  });

  combineFiles.saveSync();
  
}



export const createCombineAndFeature = (name: string, combineRoot: string) => {

  const upName = name.charAt(0).toUpperCase() + name.slice(1);
  // const upCombineRoot = combineRoot.charAt(0).toUpperCase() + combineRoot.slice(1);
  const existCombine = fs.existsSync(`src/redux-store/features/${combineRoot}`);
  const existFeature = fs.existsSync(`src/redux-store/features/${combineRoot}/${name}`);

  
  if (existFeature) {
    console.error(`Feature ${name} already exists in ${combineRoot}`);
    return;
  }

  if (!existCombine) {
    createCombine(combineRoot);
  }

  fs.mkdirSync(`src/redux-store/features/${combineRoot}/${name}/use-cases`,{ recursive: true });
  fs.mkdirSync(`src/redux-store/features/${combineRoot}/${name}/reducer`,{ recursive: true });
  fs.mkdirSync(`src/redux-store/features/${combineRoot}/${name}`,{ recursive: true });

  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/${name}.slice.ts`, templateSlice(upName, true));
  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/${name}.module.ts`, templateFeatureModule(upName, true));

  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/use-cases/index.ts`, templateIndexUseCase(upName, true));
  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/use-cases/init.usecases.ts`, templateCreateUseCase("Init", upName, true));
  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/use-cases/save.usecases.ts`, templateCreateUseCase("Save", upName, true));

  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/reducer/${name}-extra.reducer.ts`, templateExtraReducer(upName, true));
  fs.writeFileSync(`src/redux-store/features/${combineRoot}/${name}/reducer/${name}.reducer.ts`, templateReducer(upName, true));

  const rootReducerFiles = project.addSourceFileAtPath("src/redux-store/root-reducer.ts");

  rootReducerFiles.addImportDeclaration({
    moduleSpecifier: `./features/${combineRoot}/${name}/${name}.slice`,
    namedImports: [`${name}Slice`]
  });

  const variebleRoot = rootReducerFiles.getVariableDeclarationOrThrow("rootReducer");

  const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);

  objectLiteral.addPropertyAssignment({
    name: name,
    initializer: `${name}Slice.reducer`
  })

  const combineSliceFiles = project.addSourceFileAtPath(`src/redux-store/features/${combineRoot}/${combineRoot}.slice.ts`);

  combineSliceFiles.addImportDeclaration({
    moduleSpecifier: `./${name}/${name}.slice`,
    namedImports: [`${name}Slice`]
  });

  const variebleCombine = combineSliceFiles.getVariableDeclarationOrThrow(`${combineRoot}Slice`);

  const objectLiteralCombine = variebleCombine.getInitializerIfKindOrThrow(ts.SyntaxKind.CallExpression);

  
  objectLiteralCombine.addArgument(`${name}Slice`);

  combineSliceFiles.saveSync();

  rootReducerFiles.saveSync();

}

export const createFeature = (name: string) => {
  const upName = name.charAt(0).toUpperCase() + name.slice(1);
  const existFeature = fs.existsSync(`src/redux-store/features/${name}`);

  if (existFeature) {
    console.error(`Feature ${name} already exists`);
    return;
  }

  console.log(`Creating feature ${name}`);
  fs.mkdirSync(`src/redux-store/features/${name}/use-cases`,{ recursive: true });
  fs.mkdirSync(`src/redux-store/features/${name}/reducer`,{ recursive: true });
  fs.mkdirSync(`src/redux-store/features/${name}`,{ recursive: true });

  fs.writeFileSync(`src/redux-store/features/${name}/${name}.slice.ts`, templateSlice(upName));
  fs.writeFileSync(`src/redux-store/features/${name}/${name}.module.ts`, templateFeatureModule(upName));

  fs.writeFileSync(`src/redux-store/features/${name}/use-cases/index.ts`, templateIndexUseCase(upName));
  fs.writeFileSync(`src/redux-store/features/${name}/use-cases/init.usecases.ts`, templateCreateUseCase("Init", upName));
  fs.writeFileSync(`src/redux-store/features/${name}/use-cases/save.usecases.ts`, templateCreateUseCase("Save", upName));

  fs.writeFileSync(`src/redux-store/features/${name}/reducer/${name}-extra.reducer.ts`, templateExtraReducer(upName));
  fs.writeFileSync(`src/redux-store/features/${name}/reducer/${name}.reducer.ts`, templateReducer(upName));

  const sourceFiles = project.addSourceFileAtPath("src/redux-store/root-reducer.ts");

  sourceFiles.addImportDeclaration({
    moduleSpecifier: `./features/${name}/${name}.slice`,
    namedImports: [`${name}Slice`]
  });

  const variebleRoot = sourceFiles.getVariableDeclarationOrThrow("rootReducer");

  const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);

  objectLiteral.addPropertyAssignment({
    name: name,
    initializer: `${name}Slice.reducer`
  })

  sourceFiles.saveSync();

}