import { Project, StructureKind } from "ts-morph";

export const templateCreateUseCase = (
  project: Project,
  filePath: string,
  nameUsecase: string,
  nameFeature: string,
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
          namedImports: ["ReduxState"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: ".",
          namedImports: [`${nameFeature}UseCases`],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: `../${nameFeature.toLocaleLowerCase()}.slice`,
          namedImports: [`State${nameFeature}`],
        },
        {
          kind: StructureKind.Class,
          name: `${nameUsecase}${nameFeature}UseCases`,
          isExported: true,
          extends: `${nameFeature}UseCases`,
          methods: [
            {
              name: "fulfilled",
              parameters: [
                { name: "state", type: `ReduxState<State${nameFeature}>` },
              ],
              returnType: "void",
              statements: [
                `state.status = "succeeded";`,
                `state.error = "";`,
                `state.old = null;`,
              ],
            },
          ],
        },
      ],
    },
    { overwrite: true },
  );
};
