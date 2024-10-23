"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeralReducer = void 0;
const GeralReducer = () => {
    const rollbackGeral = (state) => {
        if (state === null || state === void 0 ? void 0 : state.old) {
            state.data = state.old;
        }
        state.old = null;
    };
    return {
        rollbackGeral,
    };
};
exports.GeralReducer = GeralReducer;
//# sourceMappingURL=geral.reducer.js.map