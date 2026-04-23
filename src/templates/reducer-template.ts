import { Project, StructureKind, VariableDeclarationKind } from "ts-morph";

export const templateReducer = (
  project: Project,
  filePath: string,
  name: string,
  combine?: boolean,
) => {
  const lower = name.toLocaleLowerCase();
  const pathType = combine
    ? "../../../../../@types/redux/redux"
    : "../../../@types/redux/redux";

  return project.createSourceFile(
    filePath,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@reduxjs/toolkit",
          namedImports: ["current", "PayloadAction"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: `../${lower}.slice`,
          namedImports: [`State${name}`],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: pathType,
          namedImports: ["ReduxState"],
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `${name}Reducer`,
              initializer: `() => {\n  const rollback${name} = (state: ReduxState<State${name}>) => {\n    if (state?.old) {\n      state.data = state.old;\n    }\n    state.old = null;\n  };\n\n  return {\n    rollback${name},\n  };\n}`,
            },
          ],
        },
      ],
    },
    { overwrite: true },
  );
};
