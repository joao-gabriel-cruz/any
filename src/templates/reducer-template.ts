export const templateReducer = (name: string) => {

  return `
import { current, PayloadAction } from "@reduxjs/toolkit";
import { State${name} } from "../${name.toLocaleLowerCase()}.slice";
import { ReduxState } from "../../../../@types/redux/redux";

export const ${name}Reducer = () => {
  
  const rollback${name} = (state: ReduxState<State${name}>) => {
    if (state?.old) {
      state.data = state.old;
    }
    state.old = null;
  };

  return {
    rollback${name},
  };
};

`
}