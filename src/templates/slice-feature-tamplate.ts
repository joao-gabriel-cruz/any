export const templateSlice = (name: string, combine?: boolean) =>  {
const pathType = combine ? "../../../../@types/redux/redux" : "../../../@types/redux/redux"
  return `
import { createSlice } from "@reduxjs/toolkit";
import { ${name}Module } from "./${name.toLocaleLowerCase()}.module";
import { ${name}Reducer } from "./reducer/${name.toLocaleLowerCase()}.reducer";
import { ReduxState } from "${pathType}";

export type State${name} = any

export const initialState${name}: ReduxState<State${name}> = {
  old: null,
  error: "",
  status: "idle",
  data: {},
};

export const ${name.toLocaleLowerCase()}Slice = createSlice({
  name: "general",
  initialState: initialState${name},
  reducers: ${name}Reducer,
  extraReducers: ${name}Module,
});

export const { set${name}, rollback${name} } = ${name.toLocaleLowerCase()}Slice.actions;

`
}