import { Project, StructureKind, VariableDeclarationKind } from "ts-morph";

export const templateFeatureModule = (
  project: Project,
  filePath: string,
  name: string,
  combine?: boolean,
) => {
  const lower = name.toLocaleLowerCase();
  const pathType = combine
    ? "../../../../@types/redux/redux"
    : "../../../@types/redux/redux";
  const pathUtil = combine
    ? "../../../../utils/redux/redux"
    : "../../../utils/redux/redux";

  return project.createSourceFile(
    filePath,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: pathType,
          namedImports: ["ReduxModule"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "./use-cases/save.usecases",
          namedImports: [`Save${name}UseCases`],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: `../${lower}/use-cases/init.usecases`,
          namedImports: [`Init${name}UseCases`],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: pathUtil,
          namedImports: ["combineUseCasesWithExtraReducers"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: `./reducer/${lower}-extra.reducer`,
          namedImports: [`${name}ExtraReducers`],
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            { name: `init${name}`, initializer: `${name}ExtraReducers.init` },
          ],
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            { name: `save${name}`, initializer: `${name}ExtraReducers.save` },
          ],
        },
        {
          kind: StructureKind.VariableStatement,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "init",
              initializer: `combineUseCasesWithExtraReducers({\n  useCase: new Init${name}UseCases(),\n  extraReducers: init${name},\n})`,
            },
          ],
        },
        {
          kind: StructureKind.VariableStatement,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: "save",
              initializer: `combineUseCasesWithExtraReducers({\n  useCase: new Save${name}UseCases(),\n  extraReducers: save${name},\n})`,
            },
          ],
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `${name}Module`,
              type: "ReduxModule<any>",
              initializer: `(builder) => {\n  builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);\n  builder.addCase(init.pending.extra, init.pending.useCase);\n  builder.addCase(init.rejected.extra, init.rejected.useCase);\n\n  builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);\n  builder.addCase(save.pending.extra, save.pending.useCase);\n  builder.addCase(save.rejected.extra, save.rejected.useCase);\n}`,
            },
          ],
        },
      ],
    },
    { overwrite: true },
  );
};
