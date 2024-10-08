export const templateReducer = (name: string) => {

  return `
import { current, PayloadAction } from "@reduxjs/toolkit";
import { State${name} } from "../${name}.slice";
import { ReduxState } from "../../../../@types/redux/reduxe";

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