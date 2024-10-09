"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateIndexUseCase = void 0;
const templateIndexUseCase = (name, combine) => {
    const pathType = combine ? "../../../../../@types/redux/redux" : "../../../@types/redux/redux";
    return `
import {
  ActionExtraReducer,
  ReduxState,
  ReduxUseCases,
} from "${pathType}";

export class ${name}UseCases implements ReduxUseCases {
  fulfilled(state: ReduxState<any>, action: ActionExtraReducer<any>): void {
    throw new Error("Method not implemented.");
  }
  pending(state: ReduxState<any>): void {
    state.status = "loading";
  }
  rejected(state: ReduxState<any>, action: any): void {
    state.status = "failed";
    state.error = action.error.message ?? "Erro desconhecido";
    state.data = action.payload;
  }
}

`;
};
exports.templateIndexUseCase = templateIndexUseCase;
//# sourceMappingURL=index-usecase-template.js.map