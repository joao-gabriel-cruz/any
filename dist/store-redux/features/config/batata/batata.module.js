"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatataModule = exports.saveBatata = exports.initBatata = void 0;
const save_usecases_1 = require("./use-cases/save.usecases");
const init_usecases_1 = require("../batata/use-cases/init.usecases");
const redux_1 = require("../../../../utils/redux/redux");
const batata_extra_reducer_1 = require("./reducer/batata-extra.reducer");
exports.initBatata = batata_extra_reducer_1.BatataExtraReducers.init;
exports.saveBatata = batata_extra_reducer_1.BatataExtraReducers.save;
const init = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new init_usecases_1.InitBatataUseCases(),
    extraReducers: exports.initBatata,
});
const save = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new save_usecases_1.SaveBatataUseCases(),
    extraReducers: exports.saveBatata,
});
const BatataModule = (builder) => {
    builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);
    builder.addCase(init.pending.extra, init.pending.useCase);
    builder.addCase(init.rejected.extra, init.rejected.useCase);
    builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);
    builder.addCase(save.pending.extra, save.pending.useCase);
    builder.addCase(save.rejected.extra, save.rejected.useCase);
};
exports.BatataModule = BatataModule;
//# sourceMappingURL=batata.module.js.map