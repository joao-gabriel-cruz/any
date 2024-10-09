"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateMainSlice = void 0;
const templateMainSlice = () => `
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the "RootState" and "AppDispatch" types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

`;
exports.templateMainSlice = templateMainSlice;
//# sourceMappingURL=store-tamplate.js.map