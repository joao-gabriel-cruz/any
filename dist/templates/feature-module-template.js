"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateFeatureModule = void 0;
const templateFeatureModule = (name, combine) => {
    const pathType = combine ? "../../../../@types/redux/redux" : "../../../@types/redux/redux";
    const pathUtil = combine ? "../../../../utils/redux/redux" : "../../../utils/redux/redux";
    return `
import { ReduxModule } from "${pathType}";
import { Save${name}UseCases } from "./use-cases/save.usecases";
import { Init${name}UseCases } from "../${name.toLocaleLowerCase()}/use-cases/init.usecases";
import { combineUseCasesWithExtraReducers } from "${pathUtil}";
import { ${name}ExtraReducers } from "./reducer/${name.toLocaleLowerCase()}-extra.reducer";

export const init${name} = ${name}ExtraReducers.init;
export const save${name} = ${name}ExtraReducers.save;

const init = combineUseCasesWithExtraReducers({
  useCase: new Init${name}UseCases(),
  extraReducers: init${name},
});

const save = combineUseCasesWithExtraReducers({
  useCase: new Save${name}UseCases(),
  extraReducers: save${name},
});

export const ${name}Module: ReduxModule<any> = (builder) => {
  builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);
  builder.addCase(init.pending.extra, init.pending.useCase);
  builder.addCase(init.rejected.extra, init.rejected.useCase);

  builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);
  builder.addCase(save.pending.extra, save.pending.useCase);
  builder.addCase(save.rejected.extra, save.rejected.useCase);
};

`;
};
exports.templateFeatureModule = templateFeatureModule;
//# sourceMappingURL=feature-module-template.js.map