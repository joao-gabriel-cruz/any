"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveBatataUseCases = void 0;
const _1 = require(".");
class SaveBatataUseCases extends _1.BatataUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.SaveBatataUseCases = SaveBatataUseCases;
//# sourceMappingURL=save.usecases.js.map