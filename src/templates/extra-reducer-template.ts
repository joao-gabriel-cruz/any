export const templateExtraReducer = (name: string) =>  {

  const type = name.charAt(0).toLowerCase() + name.slice(1).toLocaleLowerCase();

  return `
import { createAsyncThunk } from "@reduxjs/toolkit";

export class ${name}ExtraReducers {
  static init = createAsyncThunk("${type}/init", async () => {
    const result = new Promise<typeof any>((resolve) => {
      setTimeout(() => {
        resolve({} as any);
      }, 1000);
    });
    return result;
  });

  static save = createAsyncThunk("${type}/save", async () => {
    const result = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    return result;
  });
}
`
}