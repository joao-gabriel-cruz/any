import fs from 'node:fs';
import { templateSlice } from '../templates/slice-feature-tamplate';
import { templateExtraReducer } from '../templates/extra-reducer-template';
import { templateReducer } from '../templates/reducer-template';
import { templateCreateUseCase } from '../templates/create-usecase-template';
import { templateIndexUseCase } from '../templates/index-usecase-template';
import { templateFeatureModule } from '../templates/feature-module-template';
import { rootReducer } from '../store-redux/root-reducer';
import { Project, ts } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const updateMainSlice = (name: string) => {};

const createCombine = (name: string) => {
  


}

export const createFeature = (name: string, combineRoot?: string) => {
  const upName = name.charAt(0).toUpperCase() + name.slice(1);
  console.log(`Creating feature ${name}`);
  fs.mkdirSync(`src/store-redux/features/${name}/use-cases`,{ recursive: true });
  fs.mkdirSync(`src/store-redux/features/${name}/reducer`,{ recursive: true });
  fs.mkdirSync(`src/store-redux/features/${name}`,{ recursive: true });

  fs.writeFileSync(`src/store-redux/features/${name}/${name}.slice.ts`, templateSlice(upName));
  fs.writeFileSync(`src/store-redux/features/${name}/${name}.module.ts`, templateFeatureModule(upName));

  fs.writeFileSync(`src/store-redux/features/${name}/use-cases/index.ts`, templateIndexUseCase(upName));
  fs.writeFileSync(`src/store-redux/features/${name}/use-cases/init.usecases.ts`, templateCreateUseCase("Init", upName));
  fs.writeFileSync(`src/store-redux/features/${name}/use-cases/save.usecases.ts`, templateCreateUseCase("Save", upName));

  fs.writeFileSync(`src/store-redux/features/${name}/reducer/${name}-extra.reducer.ts`, templateExtraReducer(upName));
  fs.writeFileSync(`src/store-redux/features/${name}/reducer/${name}.reducer.ts`, templateReducer(upName));

  const sourceFiles = project.addSourceFileAtPath("src/store-redux/root-reducer.ts");

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