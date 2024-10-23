"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatataReducer = void 0;
const BatataReducer = () => {
    const rollbackBatata = (state) => {
        if (state === null || state === void 0 ? void 0 : state.old) {
            state.data = state.old;
        }
        state.old = null;
    };
    return {
        rollbackBatata,
    };
};
exports.BatataReducer = BatataReducer;
//# sourceMappingURL=batata.reducer.js.map