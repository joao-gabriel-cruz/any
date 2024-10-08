export const templateReducer = (name: string) => {

  return `
import { current, PayloadAction } from "@reduxjs/toolkit";
import { State${name} } from "../geral.slice";
import { ReduxState } from "@/models/redux/type";

export const ${name}Reducer = () => {
  
  const rollback${name} = (state: ReduxState<State${name}>) => {
    if (state?.old) {
      state.data = state.old;
    }
    state.old = null;
  };

  return {
    set${name},
    rollback${name},
  };
};

`
}