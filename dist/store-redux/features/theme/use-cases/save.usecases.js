"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveThemeUseCases = void 0;
const _1 = require(".");
class SaveThemeUseCases extends _1.ThemeUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.SaveThemeUseCases = SaveThemeUseCases;
//# sourceMappingURL=save.usecases.js.map