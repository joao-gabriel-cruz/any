import { Project, StructureKind, VariableDeclarationKind } from "ts-morph";

export const templateSlice = (
  project: Project,
  filePath: string,
  name: string,
  _combine?: boolean,
) => {
  const lower = name.toLocaleLowerCase();

  return project.createSourceFile(
    filePath,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@reduxjs/toolkit",
          namedImports: ["createSlice"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: `./${lower}.module`,
          namedImports: [`${name}Module`],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: `./reducer/${lower}.reducer`,
          namedImports: [`${name}Reducer`],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@/@types/redux/redux",
          namedImports: ["ReduxState"],
        },
        {
          kind: StructureKind.TypeAlias,
          name: `State${name}`,
          type: "any",
          isExported: true,
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `initialState${name}`,
              type: `ReduxState<State${name}>`,
              initializer: `{\n  old: null,\n  error: "",\n  status: "idle",\n  data: {},\n}`,
            },
          ],
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `${lower}Slice`,
              initializer: `createSlice({\n  name: "general",\n  initialState: initialState${name},\n  reducers: ${name}Reducer,\n  extraReducers: ${name}Module,\n})`,
            },
          ],
        },
        {
          kind: StructureKind.VariableStatement,
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `{ set${name}, rollback${name} }`,
              initializer: `${lower}Slice.actions`,
            },
          ],
        },
      ],
    },
    { overwrite: true },
  );
};
