"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitThemeUseCases = void 0;
const _1 = require(".");
class InitThemeUseCases extends _1.ThemeUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.InitThemeUseCases = InitThemeUseCases;
//# sourceMappingURL=init.usecases.js.map