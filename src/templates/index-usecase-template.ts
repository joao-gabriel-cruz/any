import { Project, StructureKind } from "ts-morph";

export const templateIndexUseCase = (
  project: Project,
  filePath: string,
  name: string,
  combine?: boolean,
) => {
  const pathType = combine
    ? "../../../../../@types/redux/redux"
    : "../../../@types/redux/redux";

  return project.createSourceFile(
    filePath,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: pathType,
          namedImports: ["ActionExtraReducer", "ReduxState", "ReduxUseCases"],
        },
        {
          kind: StructureKind.Class,
          name: `${name}UseCases`,
          isExported: true,
          implements: ["ReduxUseCases"],
          methods: [
            {
              name: "fulfilled",
              parameters: [
                { name: "state", type: "ReduxState<any>" },
                { name: "action", type: "ActionExtraReducer<any>" },
              ],
              returnType: "void",
              statements: [`throw new Error("Method not implemented.");`],
            },
            {
              name: "pending",
              parameters: [{ name: "state", type: "ReduxState<any>" }],
              returnType: "void",
              statements: [`state.status = "loading";`],
            },
            {
              name: "rejected",
              parameters: [
                { name: "state", type: "ReduxState<any>" },
                { name: "action", type: "any" },
              ],
              returnType: "void",
              statements: [
                `state.status = "failed";`,
                `state.error = action.error.message ?? "Erro desconhecido";`,
                `state.data = action.payload;`,
              ],
            },
          ],
        },
      ],
    },
    { overwrite: true },
  );
};
