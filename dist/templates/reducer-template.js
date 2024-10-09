"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateReducer = void 0;
const templateReducer = (name, combine) => {
    const pathType = combine ? "../../../../../@types/redux/redux" : "../../../@types/redux/redux";
    return `
import { current, PayloadAction } from "@reduxjs/toolkit";
import { State${name} } from "../${name.toLocaleLowerCase()}.slice";
import { ReduxState } from "${pathType}";

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

`;
};
exports.templateReducer = templateReducer;
//# sourceMappingURL=reducer-template.js.map