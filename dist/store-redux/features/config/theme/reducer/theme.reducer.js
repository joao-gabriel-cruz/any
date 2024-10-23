"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeReducer = void 0;
const ThemeReducer = () => {
    const rollbackTheme = (state) => {
        if (state === null || state === void 0 ? void 0 : state.old) {
            state.data = state.old;
        }
        state.old = null;
    };
    return {
        rollbackTheme,
    };
};
exports.ThemeReducer = ThemeReducer;
//# sourceMappingURL=theme.reducer.js.map