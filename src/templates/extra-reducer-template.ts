import { Project, StructureKind } from "ts-morph";

export const templateExtraReducer = (
  project: Project,
  filePath: string,
  name: string,
  _combine?: boolean,
) => {
  const type = name.charAt(0).toLowerCase() + name.slice(1).toLocaleLowerCase();

  return project.createSourceFile(
    filePath,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@reduxjs/toolkit",
          namedImports: ["createAsyncThunk"],
        },
        {
          kind: StructureKind.Class,
          name: `${name}ExtraReducers`,
          isExported: true,
          properties: [
            {
              name: "init",
              isStatic: true,
              initializer: `createAsyncThunk("${type}/init", async () => {\n    const result = new Promise<any>((resolve) => {\n      setTimeout(() => {\n        resolve({} as any);\n      }, 1000);\n    });\n    return result;\n  })`,
            },
            {
              name: "save",
              isStatic: true,
              initializer: `createAsyncThunk("${type}/save", async () => {\n    const result = new Promise<void>((resolve) => {\n      setTimeout(() => {\n        resolve();\n      }, 1000);\n    });\n    return result;\n  })`,
            },
          ],
        },
      ],
    },
    { overwrite: true },
  );
};
