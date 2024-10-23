"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeralModule = exports.saveGeral = exports.initGeral = void 0;
const save_usecases_1 = require("./use-cases/save.usecases");
const init_usecases_1 = require("../geral/use-cases/init.usecases");
const redux_1 = require("../../../../utils/redux/redux");
const geral_extra_reducer_1 = require("./reducer/geral-extra.reducer");
exports.initGeral = geral_extra_reducer_1.GeralExtraReducers.init;
exports.saveGeral = geral_extra_reducer_1.GeralExtraReducers.save;
const init = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new init_usecases_1.InitGeralUseCases(),
    extraReducers: exports.initGeral,
});
const save = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new save_usecases_1.SaveGeralUseCases(),
    extraReducers: exports.saveGeral,
});
const GeralModule = (builder) => {
    builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);
    builder.addCase(init.pending.extra, init.pending.useCase);
    builder.addCase(init.rejected.extra, init.rejected.useCase);
    builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);
    builder.addCase(save.pending.extra, save.pending.useCase);
    builder.addCase(save.rejected.extra, save.rejected.useCase);
};
exports.GeralModule = GeralModule;
//# sourceMappingURL=geral.module.js.map