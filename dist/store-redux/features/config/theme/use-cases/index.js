"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeUseCases = void 0;
class ThemeUseCases {
    fulfilled(state, action) {
        throw new Error("Method not implemented.");
    }
    pending(state) {
        state.status = "loading";
    }
    rejected(state, action) {
        var _a;
        state.status = "failed";
        state.error = (_a = action.error.message) !== null && _a !== void 0 ? _a : "Erro desconhecido";
        state.data = action.payload;
    }
}
exports.ThemeUseCases = ThemeUseCases;
//# sourceMappingURL=index.js.map