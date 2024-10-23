"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitBatataUseCases = void 0;
const _1 = require(".");
class InitBatataUseCases extends _1.BatataUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.InitBatataUseCases = InitBatataUseCases;
//# sourceMappingURL=init.usecases.js.map