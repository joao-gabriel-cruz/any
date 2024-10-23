"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeModule = exports.saveTheme = exports.initTheme = void 0;
const save_usecases_1 = require("./use-cases/save.usecases");
const init_usecases_1 = require("../theme/use-cases/init.usecases");
const redux_1 = require("../../../../utils/redux/redux");
const theme_extra_reducer_1 = require("./reducer/theme-extra.reducer");
exports.initTheme = theme_extra_reducer_1.ThemeExtraReducers.init;
exports.saveTheme = theme_extra_reducer_1.ThemeExtraReducers.save;
const init = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new init_usecases_1.InitThemeUseCases(),
    extraReducers: exports.initTheme,
});
const save = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new save_usecases_1.SaveThemeUseCases(),
    extraReducers: exports.saveTheme,
});
const ThemeModule = (builder) => {
    builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);
    builder.addCase(init.pending.extra, init.pending.useCase);
    builder.addCase(init.rejected.extra, init.rejected.useCase);
    builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);
    builder.addCase(save.pending.extra, save.pending.useCase);
    builder.addCase(save.rejected.extra, save.rejected.useCase);
};
exports.ThemeModule = ThemeModule;
//# sourceMappingURL=theme.module.js.map