"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateCreateUseCase = void 0;
const templateCreateUseCase = (nameUsecase, nameFeature, combine) => {
    const pathType = combine ? "../../../../../@types/redux/redux" : "../../../@types/redux/redux";
    return `
import { ReduxState } from "${pathType}";
import { ${nameFeature}UseCases } from ".";
import { State${nameFeature} } from "../${nameFeature.toLocaleLowerCase()}.slice";

export class ${nameUsecase + nameFeature}UseCases extends ${nameFeature}UseCases {
  fulfilled(state: ReduxState<State${nameFeature}>): void {
    state.status = "succeeded";
    state.error = "";
    state.old = null;
  }
}

`;
};
exports.templateCreateUseCase = templateCreateUseCase;
//# sourceMappingURL=create-usecase-template.js.map