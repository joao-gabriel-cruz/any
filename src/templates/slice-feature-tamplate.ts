export const templateSlice = (name: string) => `
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ${name}Module } from "./geral.module";
import { GeralConfigReducer } from "./reducer/geral.reducer";
import { ReduxState } from "@/models/redux/type";

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
  reducers: GeralConfigReducer,
  extraReducers: ${name}Module,
});

export const { set${name}, rollback${name} } = ${name.toLocaleLowerCase()}Slice.actions;

`